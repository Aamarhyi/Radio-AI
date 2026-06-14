"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  MapPin, 
  Users, 
  Wallet, 
  ArrowRight, 
  Plane, 
  Hotel, 
  Utensils, 
  Camera,
  CheckCircle2
} from "lucide-react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { WeatherWidget } from "@/components/weather-widget";
import { CountdownTimer } from "@/components/countdown-timer";
import { ExportMenu } from "@/components/export-menu";
import { MobileNav } from "@/components/layout/mobile-nav";

export default function TripOverviewPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar tripId={id} />
      <main className="flex-1 lg:ml-64 flex flex-col">
        <MobileNav tripId={id} />
        <div className="p-8 max-w-6xl mx-auto w-full">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge>Upcoming</Badge>
                <span className="text-sm text-muted-foreground">Created on June 1, 2026</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight">Summer in Santorini</h1>
              <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  Greece
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  July 15 - July 22, 2026
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  3 Travelers
                </div>
              </div>
            </div>
            <div className="flex gap-3 shrink-0">
              <ExportMenu />
              <Button className="gap-2">
                Edit Trip
              </Button>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
            <div className="lg:col-span-2 space-y-8">
              <div className="relative aspect-[21/9] rounded-2xl overflow-hidden shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200&q=80" 
                  alt="Santorini"
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                  <div className="text-white">
                    <h2 className="text-2xl font-bold">Oia & Fira Exploration</h2>
                    <p className="opacity-90">8 days of sun, sea, and Greek cuisine.</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="hover:shadow-md transition-shadow cursor-pointer group">
                  <Link href={`/trips/${id}/itinerary`}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                      <CardTitle className="text-lg">Next Stop</CardTitle>
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                          <Plane className="h-6 w-6" />
                        </div>
                        <div>
                          <div className="font-bold">Flight LH 1234</div>
                          <div className="text-xs text-muted-foreground">Departs at 09:45 AM</div>
                        </div>
                      </div>
                    </CardContent>
                  </Link>
                </Card>

                <Card className="hover:shadow-md transition-shadow cursor-pointer group">
                  <Link href={`/trips/${id}/accommodations`}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                      <CardTitle className="text-lg">Current Stay</CardTitle>
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600">
                          <Hotel className="h-6 w-6" />
                        </div>
                        <div>
                          <div className="font-bold">Canaves Oia Boutique</div>
                          <div className="text-xs text-muted-foreground">Oia, Santorini</div>
                        </div>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Trip Checklist</CardTitle>
                  <CardDescription>Preparation steps for your departure.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { task: "Book airport transfer", done: true },
                    { task: "Confirm dinner at Melitini", done: true },
                    { task: "Check-in for flights", done: false },
                    { task: "Finalize packing list", done: false },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <CheckCircle2 className={`h-5 w-5 ${item.done ? 'text-emerald-500' : 'text-muted-foreground opacity-30'}`} />
                      <span className={`text-sm ${item.done ? 'text-muted-foreground line-through' : 'font-medium'}`}>
                        {item.task}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              <Card className="bg-primary text-primary-foreground">
                <CardHeader>
                  <CardTitle className="text-center text-sm font-medium uppercase tracking-wider opacity-80">Departure Countdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <CountdownTimer targetDate="2026-07-15T09:00:00" />
                </CardContent>
              </Card>

              <WeatherWidget 
                location="Oia, Santorini"
                temp={27}
                condition="Sunny"
                high={30}
                low={22}
              />

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    Budget Summary
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Budget</span>
                    <span className="font-bold">$5,000.00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Spent</span>
                    <span className="font-bold text-emerald-600">$3,100.00</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[62%]" />
                  </div>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/trips/${id}/budget`}>View Detailed Budget</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
