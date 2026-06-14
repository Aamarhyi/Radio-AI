"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, MoreVertical } from "lucide-react";

interface ActivityCardProps {
  activity: {
    id: string;
    time: string;
    title: string;
    location: string;
    type: string;
    cost: number;
  };
}

export function ActivityCard({ activity }: ActivityCardProps) {
  return (
    <div className="relative group">
      <div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-background border-2 border-primary z-10 flex items-center justify-center">
        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-sm font-bold text-primary">{activity.time} AM</span>
            <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider h-4 px-1.5">
              {activity.type}
            </Badge>
          </div>
          <h4 className="font-bold text-base">{activity.title}</h4>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {activity.location}
          </p>
        </div>
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="text-right">
            <div className="text-sm font-bold">${activity.cost}</div>
            <div className="text-[10px] text-muted-foreground font-medium">Estimated</div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
