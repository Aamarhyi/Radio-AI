"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileText, Calendar, Share2, Printer, Mail } from "lucide-react";

export function ExportMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 rounded-xl p-2">
        <DropdownMenuLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground px-2 py-1.5">Download As</DropdownMenuLabel>
        <DropdownMenuItem className="gap-3 py-2.5 rounded-lg cursor-pointer">
          <FileText className="h-4 w-4 text-primary" />
          <div className="flex flex-col">
            <span className="font-bold text-sm">PDF Itinerary</span>
            <span className="text-[10px] text-muted-foreground">Print-ready high quality</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-3 py-2.5 rounded-lg cursor-pointer">
          <Calendar className="h-4 w-4 text-primary" />
          <div className="flex flex-col">
            <span className="font-bold text-sm">Calendar (iCal)</span>
            <span className="text-[10px] text-muted-foreground">Sync to Google/Apple</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="my-2" />
        <DropdownMenuLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground px-2 py-1.5">Share</DropdownMenuLabel>
        <DropdownMenuItem className="gap-3 py-2.5 rounded-lg cursor-pointer">
          <Share2 className="h-4 w-4 text-primary" />
          <span className="font-bold text-sm">Copy Public Link</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-3 py-2.5 rounded-lg cursor-pointer">
          <Mail className="h-4 w-4 text-primary" />
          <span className="font-bold text-sm">Email to Friends</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
