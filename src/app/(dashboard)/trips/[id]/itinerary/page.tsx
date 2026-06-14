"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar,
  Plus
} from "lucide-react";
import { useParams } from "next/navigation";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ItineraryTimeline } from "@/components/itinerary-timeline";

const itineraryDays = [
  {
    day: 1,
    date: "July 15, 2026",
    activities: [
      {
        id: "a1",
        time: "09:00",
        title: "Arrival at Santorini Airport",
        location: "Santorini (JTR)",
        type: "Transport",
        cost: 0
      },
      {
        id: "a2",
        time: "11:30",
        title: "Check-in at Canaves Oia Boutique Hotel",
        location: "Oia, Santorini",
        type: "Accommodation",
        cost: 1200
      },
      {
        id: "a3",
        time: "01:30",
        title: "Lunch at Melitini",
        location: "Oia",
        type: "Food",
        cost: 65
      },
    ],
  },
  {
    day: 2,
    date: "July 16, 2026",
    activities: [
      {
        id: "b1",
        time: "10:00",
        title: "Fira to Oia Hike",
        location: "Santorini Caldera",
        type: "Adventure",
        cost: 0
      },
    ],
  },
];

export default function ItineraryPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar tripId={id} />
      <main className="flex-1 lg:ml-64 flex flex-col">
        <MobileNav tripId={id} />
        <div className="p-8 max-w-4xl mx-auto w-full">
          <header className="flex justify-between items-end mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="rounded-full">Santorini, Greece</Badge>
                <Badge variant="outline" className="rounded-full">8 Days</Badge>
              </div>
              <h1 className="text-3xl font-bold tracking-tight">Summer in Santorini</h1>
              <p className="text-muted-foreground flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4" />
                July 15 - July 22, 2026
              </p>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Activity
            </Button>
          </header>

          <ItineraryTimeline itinerary={itineraryDays} />
        </div>
      </main>
    </div>
  );
}
