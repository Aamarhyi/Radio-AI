"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Plane } from "lucide-react";
import { Sidebar } from "./sidebar";
import { useState } from "react";

export function MobileNav({ tripId }: { tripId?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden flex items-center justify-between p-4 border-b bg-background sticky top-0 z-40">
      <div className="flex items-center gap-2">
        <Plane className="h-6 w-6 text-primary" />
        <span className="font-bold text-lg">Raido AI</span>
      </div>
      
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <Sidebar tripId={tripId} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
