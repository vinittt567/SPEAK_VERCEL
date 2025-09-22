import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";

const perf = Array.from({ length: 10 }).map((_, i)=> ({ t:`W${i+1}`, value: Math.round(90 + Math.sin(i/2)*8 + Math.random()*4) }));

export default function PanelAdmin(){
  return (
    <div className="container py-8 space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Main Admin Panel</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">System Configuration</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="rounded-lg border p-3">Manage roles, feature flags, and platform settings.</div>
            <Button className="rounded-full">Open settings</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Multi-Institution</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="rounded-lg border p-3">Add or manage colleges and deployments.</div>
            <Button variant="outline" className="rounded-full">Manage institutions</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Security & Compliance</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="rounded-lg border p-3">HIPAA/FERPA checks, audit logs, data retention policies.</div>
            <Button variant="outline" className="rounded-full">View logs</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-base">Analytics & Reporting</CardTitle></CardHeader>
        <CardContent>
          <ChartContainer config={{ value:{ label:"Uptime %", color:"#22c55e" } }} className="h-60">
            <LineChart data={perf}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="t"/>
              <YAxis domain={[80, 105]} allowDecimals={false}/>
              <ChartTooltip content={<ChartTooltipContent />}/>
              <Line type="monotone" dataKey="value" stroke="var(--color-value)" strokeWidth={2} dot={false} />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
