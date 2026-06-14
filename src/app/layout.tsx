import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { AIChatBot } from "@/components/ai-chat-bot";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Raido AI - Personalized Travel Planning",
  description: "AI-powered travel planner that creates fully personalized, optimized day-by-day itineraries.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} min-h-screen bg-background text-foreground antialiased`}>
        <TooltipProvider>
          {children}
          <Toaster />
          <AIChatBot />
        </TooltipProvider>
      </body>
    </html>
  );
}
