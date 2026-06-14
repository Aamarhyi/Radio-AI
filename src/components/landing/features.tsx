import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Calendar, Compass, Map, Users, Zap } from "lucide-react";

const features = [
  {
    title: "AI Itinerary Genius",
    description: "Generate complete day-by-day plans in seconds based on your interests and budget.",
    icon: Brain,
  },
  {
    title: "Interactive Mapping",
    description: "Visualize your entire trip on a map with optimized routes between every stop.",
    icon: Map,
  },
  {
    title: "Real-time Collaboration",
    description: "Invite friends and family to plan together. Sync changes instantly across all devices.",
    icon: Users,
  },
  {
    title: "Smart Budgeting",
    description: "Track expenses, compare costs, and get AI recommendations to save more.",
    icon: Zap,
  },
  {
    title: "Seamless Logistics",
    description: "Integrated flight tracking, hotel bookings, and restaurant reservations.",
    icon: Calendar,
  },
  {
    title: "Curated Discovery",
    description: "Hidden gems and local favorites you won't find in standard guidebooks.",
    icon: Compass,
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-muted/30">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Everything you need for the perfect trip.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From the first spark of inspiration to the final flight home, Raido AI handles all the details.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow bg-background">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
