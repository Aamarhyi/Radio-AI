"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, Tag, ShoppingBag, Backpack, Briefcase } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { MobileNav } from "@/components/layout/mobile-nav";

const initialPackingList = [
  { id: "1", item: "Passport", category: "Essentials", packed: true },
  { id: "2", item: "Sunscreen", category: "Toiletries", packed: false },
  { id: "3", item: "Comfortable Walking Shoes", category: "Clothing", packed: true },
  { id: "4", item: "Swimwear", category: "Clothing", packed: false },
  { id: "5", item: "Portable Charger", category: "Electronics", packed: false },
  { id: "6", item: "Camera & Extra Batteries", category: "Electronics", packed: true },
  { id: "7", item: "Travel Insurance Documents", category: "Essentials", packed: false },
];

export default function PackingPage() {
  const params = useParams();
  const id = params.id as string;
  const [list, setList] = useState(initialPackingList);

  const packedCount = list.filter(item => item.packed).length;
  const progress = Math.round((packedCount / list.length) * 100);

  const toggleItem = (itemId: string) => {
    setList(prev => prev.map(item => 
      item.id === itemId ? { ...item, packed: !item.packed } : item
    ));
  };

  const categories = ["All", ...Array.from(new Set(list.map(item => item.category)))];

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar tripId={id} />
      <main className="flex-1 lg:ml-64 flex flex-col">
        <MobileNav tripId={id} />
        <div className="p-8 max-w-4xl mx-auto w-full">
          <header className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Packing List</h1>
              <p className="text-muted-foreground">Stay organized and don't leave anything behind.</p>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Item
            </Button>
          </header>

          <Card className="mb-10">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-end mb-2">
                <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
                <span className="text-sm font-bold">{progress}% Packed</span>
              </div>
              <Progress value={progress} className="h-2" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4 text-primary" />
                  <span className="text-xs font-medium text-muted-foreground">{list.length} Items Total</span>
                </div>
                <div className="flex items-center gap-2">
                  <Backpack className="h-4 w-4 text-emerald-500" />
                  <span className="text-xs font-medium text-muted-foreground">{packedCount} Packed</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-orange-500" />
                  <span className="text-xs font-medium text-muted-foreground">{list.length - packedCount} Remaining</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="All">
            <TabsList className="mb-6 flex-wrap h-auto">
              {categories.map(cat => (
                <TabsTrigger key={cat} value={cat}>{cat}</TabsTrigger>
              ))}
            </TabsList>
            
            {categories.map(cat => (
              <TabsContent key={cat} value={cat} className="space-y-4">
                <Card>
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {list
                        .filter(item => cat === "All" || item.category === cat)
                        .map((item) => (
                          <div key={item.id} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                            <div className="flex items-center gap-4">
                              <Checkbox 
                                id={item.id} 
                                checked={item.packed}
                                onCheckedChange={() => toggleItem(item.id)}
                              />
                              <div className="flex flex-col">
                                <label 
                                  htmlFor={item.id}
                                  className={`text-sm font-medium cursor-pointer transition-all ${item.packed ? 'line-through text-muted-foreground' : ''}`}
                                >
                                  {item.item}
                                </label>
                                <div className="flex items-center gap-1 mt-0.5">
                                  <Tag className="h-3 w-3 text-muted-foreground/60" />
                                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{item.category}</span>
                                </div>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
                {list.filter(item => cat === "All" || item.category === cat).length === 0 && (
                  <div className="text-center py-12 border-2 border-dashed rounded-xl">
                    <p className="text-muted-foreground">No items in this category yet.</p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>

          <div className="mt-8">
            <Button variant="outline" className="w-full border-dashed gap-2">
              <Plus className="h-4 w-4" />
              Add a new packing category
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
