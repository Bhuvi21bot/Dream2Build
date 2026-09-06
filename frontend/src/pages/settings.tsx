import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { User, Wallet, Plus, Settings } from "lucide-react";

export function SettingsPage() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [balance, setBalance] = useState(0.00);

  const handleAddMoney = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const amount = parseFloat((form.elements.namedItem("amount") as HTMLInputElement).value);
    if (amount > 0) {
        setBalance(b => b + amount);
        toast({ title: "Success", description: `Added $${amount.toFixed(2)} to your wallet.` });
        form.reset();
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Profile Saved", description: "Your personal details have been updated." });
  };

  return (
    <div className="container max-w-4xl py-10">
      <div className="flex items-center gap-3 mb-8">
        <Settings className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-serif font-bold tracking-tight">Account Settings</h1>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6 grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="profile"><User className="w-4 h-4 mr-2" /> Profile</TabsTrigger>
          <TabsTrigger value="wallet"><Wallet className="w-4 h-4 mr-2" /> Wallet</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Personal Details</CardTitle>
              <CardDescription>Update your personal information and preferences.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue="John Doe" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="john@example.com" />
                </div>
                <Button type="submit" className="mt-2">Save Changes</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wallet">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Current Balance</CardTitle>
                <CardDescription>Your available funds for purchasing premium assets and templates.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-5xl font-mono font-bold text-primary mb-4">
                  ${balance.toFixed(2)}
                </div>
                <p className="text-sm text-muted-foreground">
                  Use your wallet balance to unlock premium furniture packs and high-resolution renders.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Add Money</CardTitle>
                <CardDescription>Top up your wallet balance.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddMoney} className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="amount">Amount (USD)</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                      <Input id="amount" name="amount" type="number" min="5" step="5" placeholder="50.00" className="pl-7" required />
                    </div>
                  </div>
                  <Button type="submit" className="w-full">
                    <Plus className="w-4 h-4 mr-2" /> Add Funds
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
