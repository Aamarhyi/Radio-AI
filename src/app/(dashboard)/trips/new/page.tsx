"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar as CalendarIcon, MapPin, Sparkles, Plane, Hotel, Utensils, Camera } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function NewTripPage() {
  const [step, setStep] = useState(1);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 lg:ml-64 p-8">
        <div className="max-w-4xl mx-auto">
          <header className="mb-10">
            <h1 className="text-3xl font-bold tracking-tight">Create Your Next Adventure</h1>
            <p className="text-muted-foreground">Tell us where you want to go and what you love.</p>
          </header>

          <div className="mb-8 flex items-center justify-between">
            <div className="flex gap-2">
              {[1, 2, 3].map((s) => (
                <div 
                  key={s} 
                  className={`h-2 w-16 rounded-full ${s <= step ? 'bg-primary' : 'bg-muted'}`} 
                />
              ))}
            </div>
            <span className="text-sm font-medium text-muted-foreground">Step {step} of 3</span>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Destination & Dates</CardTitle>
                    <CardDescription>Where are you heading and when?</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-2">
                      <Label htmlFor="destination">Destination</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input id="destination" placeholder="e.g. Kyoto, Japan" className="pl-10" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="start-date">Start Date</Label>
                        <div className="relative">
                          <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input id="start-date" type="date" className="pl-10" />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="end-date">End Date</Label>
                        <div className="relative">
                          <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input id="end-date" type="date" className="pl-10" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardHeader className="pt-0">
                    <Button onClick={() => setStep(2)} className="w-full">Next: Interests</Button>
                  </CardHeader>
                </Card>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Interests & Style</CardTitle>
                    <CardDescription>What kind of experiences are you looking for?</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {[
                        { name: "Culture", icon: Camera },
                        { name: "Food", icon: Utensils },
                        { name: "Nature", icon: MapPin },
                        { name: "Relaxation", icon: Hotel },
                        { name: "Adventure", icon: Plane },
                        { name: "Shopping", icon: Camera },
                      ].map((interest) => (
                        <div 
                          key={interest.name}
                          className="flex flex-col items-center justify-center p-4 border rounded-xl hover:border-primary hover:bg-primary/5 cursor-pointer transition-all gap-2"
                        >
                          <interest.icon className="h-6 w-6 text-muted-foreground" />
                          <span className="text-sm font-medium">{interest.name}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardHeader className="pt-0 flex flex-row gap-4">
                    <Button variant="outline" onClick={() => setStep(1)} className="flex-1">Back</Button>
                    <Button onClick={() => setStep(3)} className="flex-[2]">Next: Budget</Button>
                  </CardHeader>
                </Card>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Budget & Preferences</CardTitle>
                    <CardDescription>Help us optimize your itinerary spend.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Tabs defaultValue="moderate">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="budget">Budget</TabsTrigger>
                        <TabsTrigger value="moderate">Moderate</TabsTrigger>
                        <TabsTrigger value="luxury">Luxury</TabsTrigger>
                      </TabsList>
                    </Tabs>
                    <div className="grid gap-2">
                      <Label htmlFor="companions">Who are you traveling with?</Label>
                      <Input id="companions" placeholder="e.g. Solo, Partner, Family of 4" />
                    </div>
                  </CardContent>
                  <CardHeader className="pt-0 flex flex-row gap-4">
                    <Button variant="outline" onClick={() => setStep(2)} className="flex-1">Back</Button>
                    <Button className="flex-[2] gap-2">
                      <Sparkles className="h-4 w-4" />
                      Generate AI Itinerary
                    </Button>
                  </CardHeader>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
