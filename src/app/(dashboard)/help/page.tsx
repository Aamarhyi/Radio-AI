"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Send, 
  Sparkles, 
  HelpCircle, 
  MessageSquare, 
  Phone, 
  Mail, 
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Search
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MobileNav } from "@/components/layout/mobile-nav";

const faqs = [
  {
    question: "How do I share my itinerary?",
    answer: "Go to your Trip Detail page and click on 'Collaborators'. You can invite people via email or generate a public link."
  },
  {
    question: "Can I use Raido AI offline?",
    answer: "Yes! If you have a Pro subscription, you can access your itineraries and documents offline via our Progressive Web App (PWA)."
  },
  {
    question: "How does AI budget optimization work?",
    answer: "Our AI analyzes thousands of data points to suggest cheaper travel dates, alternative accommodations, and hidden gem local eateries."
  }
];

export default function HelpPage() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi Alex! I'm your Raido AI assistant. How can I help you plan your perfect trip today?"
    }
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', content: inputValue }]);
    setInputValue("");
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "That's a great question about Santorini! Based on your preferences for luxury and food, I'd recommend checking out the sunset dinner at Ammoudi Bay. Would you like me to add a reservation to your itinerary?" 
      }]);
    }, 1000);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 lg:ml-64 flex flex-col">
        <MobileNav />
        <div className="p-8 max-w-6xl mx-auto w-full flex-grow flex flex-col">
          <header className="mb-10 shrink-0">
            <h1 className="text-3xl font-bold tracking-tight">Support & Assistance</h1>
            <p className="text-muted-foreground">We're here to help you make your travel dreams a reality.</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-grow">
            <div className="lg:col-span-2 flex flex-col gap-6">
              <Card className="flex-grow flex flex-col overflow-hidden min-h-[500px]">
                <CardHeader className="border-b bg-muted/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                      <Sparkles className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Raido AI Concierge</CardTitle>
                      <CardDescription className="text-xs">Available 24/7 for your travel needs</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow p-0">
                  <ScrollArea className="h-[400px] p-6">
                    <div className="space-y-4">
                      {messages.map((msg, idx) => (
                        <div 
                          key={idx} 
                          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div 
                            className={`max-w-[80%] p-4 rounded-2xl ${
                              msg.role === 'user' 
                                ? 'bg-primary text-primary-foreground rounded-tr-none' 
                                : 'bg-muted rounded-tl-none'
                            }`}
                          >
                            <p className="text-sm leading-relaxed">{msg.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
                <CardFooter className="p-4 border-t bg-muted/20">
                  <div className="flex w-full gap-2">
                    <Input 
                      placeholder="Ask anything about your trip..." 
                      className="flex-1"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button size="icon" onClick={handleSendMessage}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="hover:bg-muted/30 transition-colors cursor-pointer">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold">Email Support</h3>
                      <p className="text-xs text-muted-foreground">Response within 24 hours</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="hover:bg-muted/30 transition-colors cursor-pointer">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                      <Phone className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold">Priority Phone</h3>
                      <p className="text-xs text-muted-foreground">Pro members exclusive</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Frequently Asked</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {faqs.map((faq, idx) => (
                    <div key={idx} className="space-y-2">
                      <h4 className="text-sm font-semibold flex items-center gap-2">
                        <HelpCircle className="h-4 w-4 text-primary" />
                        {faq.question}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full gap-2 text-xs">
                    View Knowledge Base
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </CardFooter>
              </Card>

              <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">Community</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Join over 50,000 travelers sharing tips, itineraries, and advice.
                  </p>
                  <Button className="w-full">Visit Community Forum</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
