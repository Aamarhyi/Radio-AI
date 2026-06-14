"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

interface TripCardProps {
  trip: {
    id: string;
    title: string;
    destination: string;
    dates: string;
    image: string;
    status: string;
  };
}

export function TripCard({ trip }: TripCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-video relative overflow-hidden">
        <img
          src={trip.image}
          alt={trip.title}
          className="object-cover w-full h-full"
        />
        <Badge className="absolute top-3 right-3" variant={trip.status === 'Upcoming' ? 'default' : 'secondary'}>
          {trip.status}
        </Badge>
      </div>
      <CardHeader>
        <CardTitle className="text-lg">{trip.title}</CardTitle>
        <CardDescription className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {trip.destination}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{trip.dates}</p>
      </CardContent>
      <CardContent className="pt-0">
        <Link href={`/trips/${trip.id}`}>
          <Button variant="outline" className="w-full">View Details</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
