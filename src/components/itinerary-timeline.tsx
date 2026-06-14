"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ActivityCard } from "@/components/activity-card";

interface ItineraryTimelineProps {
  itinerary: any[];
}

export function ItineraryTimeline({ itinerary }: ItineraryTimelineProps) {
  return (
    <Accordion type="multiple" defaultValue={["day-1"]} className="space-y-4">
      {itinerary.map((day: any) => (
        <AccordionItem 
          key={day.day} 
          value={`day-${day.day}`}
          className="border rounded-xl px-6 bg-background shadow-sm overflow-hidden"
        >
          <AccordionTrigger className="hover:no-underline py-6">
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 rounded-xl bg-primary flex flex-col items-center justify-center text-primary-foreground shadow-inner">
                <span className="text-[10px] font-bold uppercase leading-none">Day</span>
                <span className="text-xl font-bold leading-none">{day.day}</span>
              </div>
              <div>
                <div className="font-bold text-lg">Daily Schedule</div>
                <div className="text-sm text-muted-foreground">Detailed Activities</div>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-6 border-t pt-6">
            <div className="space-y-6 relative ml-4 pl-8 border-l-2 border-dashed border-muted">
              {day.activities.map((activity: any) => (
                <ActivityCard key={activity.id} activity={activity} />
              ))}
              
              <Button variant="ghost" className="w-full border-2 border-dashed h-12 gap-2 text-muted-foreground hover:text-primary hover:border-primary hover:bg-primary/5 transition-all">
                <Plus className="h-4 w-4" />
                Add activity for Day {day.day}
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
