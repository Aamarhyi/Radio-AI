"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  UserPlus, 
  Mail, 
  Trash2, 
  Shield, 
  MoreHorizontal,
  Clock,
  CheckCircle2,
  Lock,
  Globe
} from "lucide-react";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { MobileNav } from "@/components/layout/mobile-nav";

const collaborators = [
  {
    id: "1",
    name: "Alex Rivera",
    email: "alex@example.com",
    role: "Owner",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
    status: "Active",
  },
  {
    id: "2",
    name: "Sarah Miller",
    email: "sarah.m@example.com",
    role: "Editor",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
    status: "Active",
  },
  {
    id: "3",
    name: "Marcus Johnson",
    email: "mj@example.com",
    role: "Viewer",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
    status: "Invited",
  },
];

export default function CollaboratorsPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar tripId={id} />
      <main className="flex-1 lg:ml-64 flex flex-col">
        <MobileNav tripId={id} />
        <div className="p-8 max-w-4xl mx-auto w-full">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Trip Collaborators</h1>
              <p className="text-muted-foreground">Invite friends and family to plan your adventure together.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <Globe className="h-4 w-4" />
                Public Link
              </Button>
              <Button className="gap-2">
                <UserPlus className="h-4 w-4" />
                Invite
              </Button>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  Access Control
                </CardTitle>
                <CardDescription>
                  Manage who can edit or just view this itinerary.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                    <span>Private Trip</span>
                  </div>
                  <Button variant="link" className="h-auto p-0">Change</Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  See what your team has been working on.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Sarah Miller added <span className="font-medium text-primary">Melitini Restaurant</span> 2 hours ago.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-10">
            <CardHeader>
              <CardTitle>Invite via Email</CardTitle>
              <CardDescription>
                Recipients will receive an invitation to join this trip.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="email@example.com" className="pl-10" />
                </div>
                <Button className="shrink-0">Send Invite</Button>
              </div>
            </CardContent>
          </Card>

          <h2 className="text-xl font-bold mb-6">Current Team</h2>
          <div className="space-y-4">
            {collaborators.map((person) => (
              <Card key={person.id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={person.avatar} />
                      <AvatarFallback>{person.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold flex items-center gap-2">
                        {person.name}
                        {person.role === 'Owner' && (
                          <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/10 border-none text-[10px] px-2 h-4">
                            Owner
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">{person.email}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="hidden sm:flex flex-col items-end">
                      <div className="text-sm font-medium">{person.role}</div>
                      <div className="flex items-center gap-1">
                        {person.status === 'Active' ? (
                          <>
                            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                            <span className="text-[10px] text-emerald-600 font-medium">Active</span>
                          </>
                        ) : (
                          <>
                            <Clock className="h-3 w-3 text-orange-500" />
                            <span className="text-[10px] text-orange-600 font-medium">Invited</span>
                          </>
                        )}
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Change Permissions</DropdownMenuItem>
                        <DropdownMenuItem>Transfer Ownership</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Remove from Trip</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 p-6 border-2 border-dashed rounded-xl bg-muted/20 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center mb-4">
              <Globe className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-bold mb-2">Want to share with everyone?</h3>
            <p className="text-sm text-muted-foreground max-w-sm mb-6">
              Create a public view-only link that you can share on social media or with friends who aren't on Raido AI.
            </p>
            <Button variant="outline">Generate Public Link</Button>
          </div>
        </div>
      </main>
    </div>
  );
}
