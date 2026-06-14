"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Plus, TrendingUp } from "lucide-react";
import Link from "next/link";
import { MobileNav } from "@/components/layout/mobile-nav";
import { TripCard } from "@/components/trip-card";

const recentTrips = [
  {
    id: "1",
    title: "Summer in Santorini",
    destination: "Greece",
    dates: "Jul 15 - Jul 22, 2026",
    status: "Upcoming",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&q=80",
  },
  {
    id: "2",
    title: "Tokyo Tech Adventure",
    destination: "Japan",
    dates: "Oct 5 - Oct 15, 2026",
    status: "Draft",
    image: "https://images.unsplash.com/photo-1540959733332-e9ab65bc0ad1?w=400&q=80",
  },
];

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 lg:ml-64 flex flex-col">
        <MobileNav />
        <div className="p-8 max-w-6xl mx-auto w-full">
          <header className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Welcome back, Traveler</h1>
              <p className="text-muted-foreground">Here's what's happening with your trips.</p>
            </div>
            <Link href="/trips/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Plan New Trip
              </Button>
            </Link>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Trips</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">Next one in 24 days</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Saved Destinations</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">+2 since last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Budget Optimized</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$1,240</div>
                <p className="text-xs text-muted-foreground">Saved via AI suggestions</p>
              </CardContent>
            </Card>
          </div>

          <h2 className="text-xl font-semibold mb-6">Recent Itineraries</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
            <Link href="/trips/new" className="group">
              <Card className="h-full border-dashed flex flex-col items-center justify-center p-8 bg-muted/20 group-hover:bg-muted/40 transition-colors">
                <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Plus className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="font-medium text-muted-foreground">Start a new plan</p>
              </Card>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
