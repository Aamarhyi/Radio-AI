"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Sparkles } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32 lg:pt-32 lg:pb-48">
      <div className="container relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center rounded-full border bg-background px-3 py-1 text-sm font-medium mb-6">
              <Sparkles className="mr-2 h-4 w-4 text-primary" />
              <span>AI-Powered Travel Planning</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
              The only travel planner you'll ever need.
            </h1>
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
              Experience the world with personalized, AI-optimized itineraries. 
              Luxury travel expertise, real-time mapping, and group collaboration — all in one app.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/trips/new">
                <Button size="lg" className="h-12 px-8 text-base">
                  Start Planning Your Trip
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                  View Demo
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Background decorations */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] bg-accent/10 rounded-full blur-3xl" />
      </div>
    </section>
  );
}
