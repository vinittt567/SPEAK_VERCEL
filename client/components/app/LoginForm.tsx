import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export type LoginSpec = {
  role: string;
  expectedId: string;
  expectedPassword: string;
  onSuccess: (id: string) => void;
};

function isEdu(email: string){
  return /@edu\.in$/i.test(email.trim());
}

export function LoginForm({ role, expectedId, expectedPassword, onSuccess }: LoginSpec){
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!isEdu(id)){
      toast({ title: "Invalid ID", description: "Use your @edu.in institutional ID." });
      return;
    }
    setLoading(true);
    await new Promise(r=> setTimeout(r, 400));
    if(id.trim().toLowerCase() === expectedId.toLowerCase() && pw === expectedPassword){
      toast({ title: `${role} login successful` });
      onSuccess(id.trim());
    } else {
      toast({ title: "Login failed", description: "Incorrect ID or password" });
    }
    setLoading(false);
  };

  return (
    <div className="grid place-items-center py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl">{role} Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="id">Institutional ID (@edu.in)</Label>
              <Input id="id" type="email" placeholder={expectedId} value={id} onChange={e=> setId(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={pw} onChange={e=> setPw(e.target.value)} required />
            </div>
            <Button type="submit" disabled={loading} className="w-full rounded-full">
              {loading ? "Signing in…" : "Sign in"}
            </Button>
            <div className="text-xs text-muted-foreground">Use the demo credentials exactly as shown.</div>
            <div className="text-xs"><span className="text-muted-foreground">Demo:</span> <code>{expectedId}</code> • <code>{expectedPassword}</code></div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
