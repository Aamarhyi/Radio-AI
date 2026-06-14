"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Wallet, 
  TrendingDown, 
  Plus, 
  ArrowUpRight, 
  Hotel, 
  Utensils, 
  Plane, 
  Camera,
  MoreHorizontal
} from "lucide-react";
import { useParams } from "next/navigation";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip,
  Legend
} from "recharts";
import { MobileNav } from "@/components/layout/mobile-nav";

const data = [
  { name: "Flights", value: 850, color: "var(--primary)" },
  { name: "Stay", value: 1200, color: "#3b82f6" },
  { name: "Food", value: 450, color: "#10b981" },
  { name: "Activities", value: 600, color: "#f59e0b" },
];

const dailySpending = [
  { day: "Day 1", amount: 150 },
  { day: "Day 2", amount: 230 },
  { day: "Day 3", amount: 180 },
  { day: "Day 4", amount: 420 },
  { day: "Day 5", amount: 200 },
];

const expenses = [
  { id: 1, title: "Canaves Oia Hotel", category: "Stay", amount: 1200, status: "Paid", icon: Hotel },
  { id: 2, title: "Lufthansa Flights", category: "Flights", amount: 850, status: "Paid", icon: Plane },
  { id: 3, title: "Sunset Cruise", category: "Activities", amount: 180, status: "Planned", icon: Camera },
  { id: 4, title: "Melitini Lunch", category: "Food", amount: 65, status: "Paid", icon: Utensils },
];

export default function BudgetPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar tripId={id} />
      <main className="flex-1 lg:ml-64 flex flex-col">
        <MobileNav tripId={id} />
        <div className="p-8 max-w-6xl mx-auto w-full">
          <header className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Budget Planner</h1>
              <p className="text-muted-foreground">Manage your travel expenses and savings.</p>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Expense
            </Button>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            <Card className="md:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$5,000</div>
                <p className="text-xs text-muted-foreground">$1,900 remaining</p>
              </CardContent>
            </Card>
            <Card className="md:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Spent to Date</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$3,100</div>
                <div className="flex items-center text-xs text-emerald-500 font-medium">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  -5% under budget
                </div>
              </CardContent>
            </Card>
            <Card className="md:col-span-2 bg-primary text-primary-foreground">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium opacity-90">AI Savings Tip</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="font-medium">Save $120 on your Santorini stay</div>
                <p className="text-xs opacity-80 mt-1">
                  Book directly through the hotel website using our referral code "RAIDO10".
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
            <Card>
              <CardHeader>
                <CardTitle>Spending Breakdown</CardTitle>
                <CardDescription>Allocation across categories</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Daily Spending</CardTitle>
                <CardDescription>Your expenses over the course of the trip</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailySpending}>
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                    <Tooltip 
                      cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="amount" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {expenses.map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        <expense.icon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="font-medium">{expense.title}</div>
                        <div className="text-xs text-muted-foreground">{expense.category}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="font-bold">${expense.amount}</div>
                        <Badge variant={expense.status === 'Paid' ? 'secondary' : 'outline'} className="text-[10px] h-4">
                          {expense.status}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardHeader className="pt-0">
              <Button variant="outline" className="w-full">View All Expenses</Button>
            </CardHeader>
          </Card>
        </div>
      </main>
    </div>
  );
}
