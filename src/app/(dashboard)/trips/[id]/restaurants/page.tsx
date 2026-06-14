"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Utensils, Star, MapPin, Clock, ExternalLink, Flame, Fish } from "lucide-react";
import { useParams } from "next/navigation";
import { MobileNav } from "@/components/layout/mobile-nav";

const restaurants = [
  {
    id: "1",
    name: "Melitini",
    cuisine: "Traditional Greek Tapas",
    rating: 4.8,
    price: "$$",
    location: "Oia, Santorini",
    image: "https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?w=400&q=80",
    specialty: "Grilled Octopus",
    description: "Famous for its authentic tapas and rooftop views of the caldera.",
    status: "Reserved",
  },
  {
    id: "2",
    name: "Ammoudi Fish Tavern",
    cuisine: "Seafood",
    rating: 4.9,
    price: "$$$",
    location: "Ammoudi Bay, Santorini",
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&q=80",
    specialty: "Fresh Catch of the Day",
    description: "Dine right on the water at the base of the cliffs in Oia.",
    status: "Recommended",
  },
  {
    id: "3",
    name: "Sunset Ammoudi by Paraskevas",
    cuisine: "Mediterranean",
    rating: 4.7,
    price: "$$$",
    location: "Ammoudi Bay, Santorini",
    image: "https://images.unsplash.com/photo-1544124499-58912cbddaad?w=400&q=80",
    specialty: "Sun-dried Octopus",
    description: "Iconic spot for sunset dining with tables literally at sea level.",
    status: "Recommended",
  },
];

export default function RestaurantsPage() {
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
              <h1 className="text-3xl font-bold tracking-tight">Restaurants & Dining</h1>
              <p className="text-muted-foreground">Savor the best local flavors during your trip.</p>
            </div>
            <Button className="gap-2">
              <Utensils className="h-4 w-4" />
              Discover More
            </Button>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((place) => (
              <Card key={place.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img 
                    src={place.image} 
                    alt={place.name}
                    className="object-cover w-full h-full"
                  />
                  <Badge 
                    className="absolute top-3 right-3" 
                    variant={place.status === 'Reserved' ? 'default' : 'secondary'}
                  >
                    {place.status}
                  </Badge>
                </div>
                <CardHeader className="p-4">
                  <div className="flex justify-between items-start mb-1">
                    <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider">{place.cuisine}</Badge>
                    <div className="flex items-center gap-1 text-sm font-bold">
                      <Star className="h-3 w-3 fill-primary text-primary" />
                      {place.rating}
                    </div>
                  </div>
                  <CardTitle className="text-xl">{place.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {place.location}
                    <span className="mx-1">•</span>
                    <span className="font-medium">{place.price}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex items-center gap-2 mb-3">
                    {place.cuisine.includes("Seafood") ? (
                      <Fish className="h-4 w-4 text-blue-500" />
                    ) : (
                      <Flame className="h-4 w-4 text-orange-500" />
                    )}
                    <span className="text-xs font-medium italic">Specialty: {place.specialty}</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {place.description}
                  </p>
                </CardContent>
                <CardContent className="p-4 pt-0 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 gap-2">
                    <ExternalLink className="h-3 w-3" />
                    Menu
                  </Button>
                  <Button size="sm" className="flex-1 gap-2" variant={place.status === 'Reserved' ? 'secondary' : 'default'}>
                    <Clock className="h-3 w-3" />
                    {place.status === 'Reserved' ? 'Details' : 'Reserve'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
