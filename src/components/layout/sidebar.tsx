"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Map, 
  Calendar, 
  Wallet, 
  Hotel, 
  Utensils, 
  Backpack, 
  FileText, 
  Users, 
  Settings, 
  HelpCircle,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";

const sidebarItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Trips", href: "/trips", icon: Map },
  { name: "New Trip", href: "/trips/new", icon: Plus, highlight: true },
];

const tripSpecificItems = [
  { name: "Itinerary", href: "/itinerary", icon: Calendar },
  { name: "Map", href: "/map", icon: Map },
  { name: "Budget", href: "/budget", icon: Wallet },
  { name: "Accommodations", href: "/accommodations", icon: Hotel },
  { name: "Restaurants", href: "/restaurants", icon: Utensils },
  { name: "Packing List", href: "/packing", icon: Backpack },
  { name: "Documents", href: "/documents", icon: FileText },
  { name: "Collaborators", href: "/collaborators", icon: Users },
];

const bottomItems = [
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Help", href: "/help", icon: HelpCircle },
];

export function Sidebar({ tripId }: { tripId?: string }) {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 border-r bg-muted/30">
      <div className="p-6 flex items-center gap-2">
        <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold">
          R
        </div>
        <span className="font-bold text-xl tracking-tight">Raido AI</span>
      </div>
      
      <div className="flex-grow px-4 space-y-8 mt-4 overflow-y-auto">
        <div>
          <h3 className="px-2 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Menu
          </h3>
          <div className="space-y-1">
            {sidebarItems.map((item) => (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 h-10",
                    item.highlight && "bg-primary text-primary-foreground hover:bg-primary/90"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Button>
              </Link>
            ))}
          </div>
        </div>

        {tripId && (
          <div>
            <h3 className="px-2 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Current Trip
            </h3>
            <div className="space-y-1">
              {tripSpecificItems.map((item) => {
                const href = `/trips/${tripId}${item.href}`;
                return (
                  <Link key={item.name} href={href}>
                    <Button
                      variant={pathname === href ? "secondary" : "ghost"}
                      className="w-full justify-start gap-3 h-10"
                    >
                      <item.icon className="h-4 w-4" />
                      {item.name}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t mt-auto">
        <div className="space-y-1">
          {bottomItems.map((item) => (
            <Link key={item.name} href={item.href}>
              <Button
                variant={pathname === item.href ? "secondary" : "ghost"}
                className="w-full justify-start gap-3 h-10"
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
