"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Navigation,
  Layers,
  Search,
  Maximize2,
  Calendar
} from "lucide-react";
import { useParams } from "next/navigation";
import Map, { Marker, NavigationControl, Popup } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { useState } from "react";
import { MobileNav } from "@/components/layout/mobile-nav";

const locations = [
  { id: 1, title: "Canaves Oia Boutique Hotel", lat: 36.4632, lng: 25.3715, day: 1, type: "Stay" },
  { id: 2, title: "Oia Castle", lat: 36.4601, lng: 25.3725, day: 1, type: "Visit" },
  { id: 3, title: "Melitini", lat: 36.4615, lng: 25.3768, day: 1, type: "Eat" },
  { id: 4, title: "Ammoudi Bay", lat: 36.4589, lng: 25.3698, day: 2, type: "Visit" },
];

export default function MapPage() {
  const params = useParams();
  const id = params.id as string;
  const [selectedLocation, setSelectedLocation] = useState<any>(null);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar tripId={id} />
      <main className="flex-1 lg:ml-64 relative flex flex-col">
        <MobileNav tripId={id} />
        
        {/* Overlay Controls */}
        <div className="absolute top-20 lg:top-6 left-6 right-6 z-20 flex justify-between items-start pointer-events-none">
          <div className="flex gap-2 pointer-events-auto">
            <Card className="flex items-center gap-2 px-3 py-1.5 shadow-lg border-none bg-background/95 backdrop-blur">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-bold">
                    D{i}
                  </div>
                ))}
              </div>
              <div className="h-4 w-[1px] bg-muted mx-1" />
              <Button variant="ghost" size="sm" className="h-8 px-2 text-xs font-semibold gap-1">
                <Calendar className="h-3 w-3" />
                All Days
              </Button>
            </Card>
          </div>

          <div className="flex flex-col gap-2 pointer-events-auto">
            <Button size="icon" variant="secondary" className="shadow-lg bg-background/95 backdrop-blur">
              <Search className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="secondary" className="shadow-lg bg-background/95 backdrop-blur">
              <Layers className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="secondary" className="shadow-lg bg-background/95 backdrop-blur">
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 w-full h-full bg-muted/20">
          <Map
            initialViewState={{
              latitude: 36.4615,
              longitude: 25.3750,
              zoom: 14
            }}
            style={{ width: "100%", height: "100%" }}
            mapStyle="https://demotiles.maplibre.org/style.json"
          >
            <NavigationControl position="bottom-right" />
            
            {locations.map((loc) => (
              <Marker 
                key={loc.id} 
                latitude={loc.lat} 
                longitude={loc.lng}
                onClick={e => {
                  e.originalEvent.stopPropagation();
                  setSelectedLocation(loc);
                }}
              >
                <div className="cursor-pointer transition-transform hover:scale-125">
                  <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center shadow-xl border-2 border-background">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div className="mt-1 bg-background px-2 py-0.5 rounded shadow text-[10px] font-bold whitespace-nowrap">
                    Day {loc.day}: {loc.title}
                  </div>
                </div>
              </Marker>
            ))}

            {selectedLocation && (
              <Popup
                latitude={selectedLocation.lat}
                longitude={selectedLocation.lng}
                onClose={() => setSelectedLocation(null)}
                closeButton={false}
                className="rounded-lg shadow-2xl"
              >
                <div className="p-2 min-w-[200px]">
                  <Badge variant="secondary" className="mb-2 text-[10px] uppercase font-bold tracking-wider">
                    {selectedLocation.type}
                  </Badge>
                  <h3 className="font-bold text-sm mb-2">{selectedLocation.title}</h3>
                  <div className="flex gap-2">
                    <Button size="sm" className="h-7 text-[10px] flex-1 gap-1">
                      <Navigation className="h-3 w-3" />
                      Go there
                    </Button>
                    <Button variant="outline" size="sm" className="h-7 text-[10px] flex-1">
                      View Details
                    </Button>
                  </div>
                </div>
              </Popup>
            )}
          </Map>
        </div>

        {/* Bottom Drawer for selection */}
        <div className="absolute bottom-6 left-6 right-6 lg:left-[calc(256px+24px)] z-20 pointer-events-none">
          <Card className="max-w-md pointer-events-auto shadow-2xl border-none bg-background/95 backdrop-blur overflow-hidden">
            <CardContent className="p-4 flex gap-4">
              <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                <img 
                  src="https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=100&q=80" 
                  className="w-full h-full object-cover"
                  alt="Destination"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-bold">Oia Castle Sunset Point</h4>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  The most famous sunset spot in Santorini. Expect crowds but the view is worth it.
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <Badge variant="outline" className="text-[10px]">10 min walk</Badge>
                  <Button variant="ghost" size="sm" className="h-6 text-[10px] font-bold text-primary">
                    View Day 1 Schedule
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
