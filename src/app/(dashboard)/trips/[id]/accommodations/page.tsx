"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Hotel, Star, MapPin, ExternalLink, Wifi, Coffee, Waves } from "lucide-react";
import { useParams } from "next/navigation";
import { MobileNav } from "@/components/layout/mobile-nav";

const accommodations = [
  {
    id: "1",
    name: "Canaves Oia Boutique Hotel",
    type: "Luxury Hotel",
    rating: 5,
    price: "$600/night",
    location: "Oia, Santorini",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&q=80",
    amenities: ["Free WiFi", "Infinity Pool", "Ocean View", "Spa"],
    status: "Booked",
  },
  {
    id: "2",
    name: "Mystique, a Luxury Collection Hotel",
    type: "Resort",
    rating: 5,
    price: "$750/night",
    location: "Oia, Santorini",
    image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=400&q=80",
    amenities: ["Fine Dining", "Wine Cellar", "Private Veranda"],
    status: "Recommended",
  },
  {
    id: "3",
    name: "Katikies Santorini",
    type: "Boutique Hotel",
    rating: 5,
    price: "$850/night",
    location: "Oia, Santorini",
    image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=400&q=80",
    amenities: ["3 Swimming Pools", "Rooftop Restaurant", "Spa"],
    status: "Recommended",
  },
];

export default function AccommodationsPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar tripId={id} />
      <main className="flex-1 lg:ml-64 flex flex-col">
        <MobileNav tripId={id} />
        <div className="p-8 max-w-5xl mx-auto w-full">
          <header className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Accommodations</h1>
              <p className="text-muted-foreground">Find and manage your stays for this trip.</p>
            </div>
            <Button className="gap-2">
              <Hotel className="h-4 w-4" />
              Find More Stays
            </Button>
          </header>

          <div className="grid gap-8">
            {accommodations.map((hotel) => (
              <Card key={hotel.id} className="overflow-hidden flex flex-col md:flex-row hover:shadow-lg transition-shadow">
                <div className="md:w-1/3 aspect-video md:aspect-auto relative overflow-hidden">
                  <img 
                    src={hotel.image} 
                    alt={hotel.name}
                    className="object-cover w-full h-full"
                  />
                  <Badge 
                    className="absolute top-3 left-3" 
                    variant={hotel.status === 'Booked' ? 'default' : 'secondary'}
                  >
                    {hotel.status}
                  </Badge>
                </div>
                <div className="flex-1 flex flex-col">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-[10px] uppercase">{hotel.type}</Badge>
                          <div className="flex items-center">
                            {[...Array(hotel.rating)].map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-primary text-primary" />
                            ))}
                          </div>
                        </div>
                        <CardTitle className="text-2xl">{hotel.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" />
                          {hotel.location}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-primary">{hotel.price}</div>
                        <div className="text-xs text-muted-foreground">Est. total price</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-4 mt-2">
                      {hotel.amenities.includes("Free WiFi") && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Wifi className="h-4 w-4" />
                          <span>WiFi</span>
                        </div>
                      )}
                      {hotel.amenities.includes("Infinity Pool") && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Waves className="h-4 w-4" />
                          <span>Pool</span>
                        </div>
                      )}
                      {hotel.amenities.includes("Fine Dining") && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Coffee className="h-4 w-4" />
                          <span>Dining</span>
                        </div>
                      )}
                    </div>
                    <p className="mt-4 text-sm text-muted-foreground line-clamp-2">
                      Experience unparalleled luxury and breathtaking caldera views at {hotel.name}. 
                      Perfectly situated for witnessing Santorini's world-famous sunsets.
                    </p>
                  </CardContent>
                  <CardFooter className="mt-auto border-t bg-muted/20 p-4 flex justify-between">
                    <Button variant="outline" size="sm" className="gap-2">
                      <ExternalLink className="h-4 w-4" />
                      View Website
                    </Button>
                    {hotel.status === 'Booked' ? (
                      <Button variant="secondary" size="sm">Manage Booking</Button>
                    ) : (
                      <Button size="sm">Book Now</Button>
                    )}
                  </CardFooter>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
