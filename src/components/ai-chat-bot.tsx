"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send, X, Bot, Sparkles, User } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hi! I am your Raido AI travel assistant. How can I help with your Santorini trip today?' }
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input) return;
    setMessages(prev => [...prev, { role: 'user', text: input }]);
    setInput("");
    
    // Mock bot response
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'bot', text: "That sounds like a great idea! I'll look into that for you." }]);
    }, 1000);
  };

  return (
    <>
      <div className="fixed bottom-8 right-8 z-50">
        <Button 
          onClick={() => setIsOpen(!isOpen)}
          className="h-16 w-16 rounded-full shadow-2xl hover:scale-110 transition-transform bg-primary"
        >
          {isOpen ? <X className="h-8 w-8" /> : <MessageSquare className="h-8 w-8" />}
        </Button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-28 right-8 z-50 w-96 max-h-[600px] flex flex-col shadow-2xl rounded-3xl overflow-hidden border-none bg-background ring-1 ring-black/5"
          >
            <Card className="border-none flex flex-col h-full">
              <CardHeader className="bg-primary text-primary-foreground p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                    <Bot className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Raido AI Assistant</CardTitle>
                    <div className="flex items-center gap-1.5 mt-0.5 opacity-80">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Always Online</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-6 space-y-6 min-h-[300px]">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex gap-3 max-w-[80%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                       <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${m.role === 'user' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                         {m.role === 'user' ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                       </div>
                       <div className={`p-4 rounded-2xl text-sm font-medium leading-relaxed ${m.role === 'user' ? 'bg-primary text-primary-foreground rounded-tr-none' : 'bg-muted/50 rounded-tl-none'}`}>
                        {m.text}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <div className="flex gap-2 w-full">
                  <Input 
                    placeholder="Ask about flights, hotels..." 
                    className="h-12 rounded-xl bg-muted/50 border-none px-4"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'enter' && handleSend()}
                  />
                  <Button onClick={handleSend} className="h-12 w-12 p-0 rounded-xl">
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
