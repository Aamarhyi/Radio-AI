"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Upload, 
  Download, 
  Trash2, 
  Eye, 
  Search,
  MoreVertical,
  FileCode,
  FileImage,
  ShieldCheck
} from "lucide-react";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { MobileNav } from "@/components/layout/mobile-nav";

const documents = [
  {
    id: "1",
    name: "Passport Scan - John.pdf",
    type: "PDF",
    size: "1.2 MB",
    category: "Identity",
    uploadedAt: "June 1, 2026",
    status: "Verified",
  },
  {
    id: "2",
    name: "Flight Tickets - Santorini.pdf",
    type: "PDF",
    size: "2.4 MB",
    category: "Travel",
    uploadedAt: "June 5, 2026",
    status: "Verified",
  },
  {
    id: "3",
    name: "Hotel Confirmation.png",
    type: "PNG",
    size: "0.8 MB",
    category: "Accommodation",
    uploadedAt: "June 10, 2026",
    status: "Pending",
  },
  {
    id: "4",
    name: "Travel Insurance.pdf",
    type: "PDF",
    size: "3.1 MB",
    category: "Insurance",
    uploadedAt: "June 12, 2026",
    status: "Verified",
  },
];

export default function DocumentsPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar tripId={id} />
      <main className="flex-1 lg:ml-64 flex flex-col">
        <MobileNav tripId={id} />
        <div className="p-8 max-w-5xl mx-auto w-full">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Travel Documents</h1>
              <p className="text-muted-foreground">Keep your important papers safe and accessible anywhere.</p>
            </div>
            <Button className="gap-2 shrink-0">
              <Upload className="h-4 w-4" />
              Upload Document
            </Button>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Secure Storage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Your documents are encrypted and only accessible to you and your chosen collaborators.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Files</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{documents.length}</div>
                <p className="text-xs text-muted-foreground">7.5 MB used of 1 GB</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Offline Access</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-none">Enabled</Badge>
                <p className="text-xs text-muted-foreground mt-1">Available on mobile PWA</p>
              </CardContent>
            </Card>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search documents..." className="pl-10" />
            </div>
            <Button variant="outline" className="gap-2 shrink-0">
              All Categories
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
                    <tr>
                      <th className="px-6 py-4 min-w-[200px]">Name</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {documents.map((doc) => (
                      <tr key={doc.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                              {doc.type === 'PDF' ? (
                                <FileText className="h-5 w-5 text-red-500" />
                              ) : (
                                <FileImage className="h-5 w-5 text-blue-500" />
                              )}
                            </div>
                            <div>
                              <div className="font-medium truncate max-w-[150px]">{doc.name}</div>
                              <div className="text-xs text-muted-foreground">{doc.size}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="outline" className="font-normal">{doc.category}</Badge>
                        </td>
                        <td className="px-6 py-4">
                          <Badge 
                            variant="secondary" 
                            className={doc.status === 'Verified' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-orange-500/10 text-orange-600'}
                          >
                            {doc.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {doc.uploadedAt}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-dashed flex flex-col items-center justify-center p-8 text-center bg-muted/20 hover:bg-muted/30 transition-colors cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center mb-4">
                <Upload className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-medium mb-1">Upload from Computer</h3>
              <p className="text-sm text-muted-foreground">Drag and drop or click to browse</p>
            </Card>
            <Card className="border-dashed flex flex-col items-center justify-center p-8 text-center bg-muted/20 hover:bg-muted/30 transition-colors cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center mb-4">
                <FileCode className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-medium mb-1">Import from Email</h3>
              <p className="text-sm text-muted-foreground">Connect your inbox to auto-sync tickets</p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
