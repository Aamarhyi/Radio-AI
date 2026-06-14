"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Cloud, Sun, CloudRain, Thermometer, Wind, Droplets } from "lucide-react";

interface WeatherProps {
  location: string;
  temp: number;
  condition: "Sunny" | "Cloudy" | "Rainy";
  high: number;
  low: number;
}

export function WeatherWidget({ location, temp, condition, high, low }: WeatherProps) {
  const getIcon = () => {
    switch (condition) {
      case "Sunny": return <Sun className="h-8 w-8 text-yellow-500" />;
      case "Cloudy": return <Cloud className="h-8 w-8 text-muted-foreground" />;
      case "Rainy": return <CloudRain className="h-8 w-8 text-blue-500" />;
      default: return <Sun className="h-8 w-8 text-yellow-500" />;
    }
  };

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-background to-muted/30 border-none shadow-md">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="font-bold text-lg">{location}</h3>
            <p className="text-sm text-muted-foreground">{condition}</p>
          </div>
          {getIcon()}
        </div>
        
        <div className="flex items-end gap-2 mb-6">
          <span className="text-4xl font-bold">{temp}°C</span>
          <div className="flex flex-col text-xs text-muted-foreground pb-1">
            <span>H: {high}°</span>
            <span>L: {low}°</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 border-t pt-4">
          <div className="flex flex-col items-center gap-1">
            <Thermometer className="h-4 w-4 text-primary opacity-70" />
            <span className="text-[10px] font-medium">Feels 28°</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Wind className="h-4 w-4 text-primary opacity-70" />
            <span className="text-[10px] font-medium">12 km/h</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Droplets className="h-4 w-4 text-primary opacity-70" />
            <span className="text-[10px] font-medium">45% Hum.</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
