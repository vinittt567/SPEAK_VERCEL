import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";

const demoReferrals = Array.from({ length: 6 }).map((_, i) => ({
  id: `R-${1000 + i}`,
  risk: ["Low","Moderate","High"][Math.floor(Math.random()*3)] as "Low"|"Moderate"|"High",
  concern: ["Anxiety","Stress","Sleep","Exam"][Math.floor(Math.random()*4)],
  submitted: `${(i+1).toString().padStart(2,"0")}/09` ,
}));

const demoSchedule = [
  { time: "09:00", name: "Student A", mode: "Online" },
  { time: "10:30", name: "Student B", mode: "In-person" },
  { time: "13:00", name: "Student C", mode: "Online" },
  { time: "15:00", name: "—available—", mode: "" },
];

function moodSeries(){
  return Array.from({ length: 14 }).map((_, i)=> ({ day: `D${i+1}`, mood: 60 + Math.round(Math.sin(i/2)*15 + Math.random()*6) }));
}

export default function PanelCounselor(){
  const data = useMemo(()=> moodSeries(), []);
  return (
    <div className="container py-8 space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Counselor Panel</h1>

      <div className="grid xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2">
          <CardHeader className="pb-2"><CardTitle className="text-base">Patient Referral Dashboard</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            {demoReferrals.map(r=> (
              <div key={r.id} className="rounded-lg border p-3 flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">Referral {r.id}</div>
                  <div className="text-xs text-muted-foreground">Primary concern: {r.concern} • Submitted {r.submitted}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={r.risk==='High'? 'bg-rose-500': r.risk==='Moderate'? 'bg-amber-500':'bg-emerald-600'}>{r.risk}</Badge>
                  <Button size="sm" className="rounded-full">Review</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Crisis Response</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="rounded-lg border p-3 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300">High-risk alert: 2 students require same-day outreach.</div>
            <div className="flex gap-2">
              <Button size="sm" className="rounded-full">View alerts</Button>
              <Button size="sm" variant="outline" className="rounded-full">Notify team</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2"><CardTitle className="text-base">Student Progress Tracking</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer config={{ mood:{ label:"Mood", color:"#60a5fa" }}} className="h-56">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day"/>
                <YAxis domain={[40,100]} allowDecimals={false}/>
                <ChartTooltip content={<ChartTooltipContent />}/>
                <Line type="monotone" dataKey="mood" stroke="var(--color-mood)" strokeWidth={2} dot={false} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Appointments</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            {demoSchedule.map((s,i)=> (
              <div key={i} className="rounded-lg border p-3 flex items-center justify-between">
                <div>{s.time}</div>
                <div className="text-muted-foreground">{s.name}</div>
                <div className="text-xs">{s.mode}</div>
                <Button size="sm" variant="outline" className="rounded-full">Manage</Button>
              </div>
            ))}
            <Button className="w-full rounded-full">Edit availability</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-base">Resource Management</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="rounded-lg border p-3 flex items-center justify-between"><span>Mindfulness audio (EN)</span><Button size="sm" variant="outline" className="rounded-full">Publish</Button></div>
          <div className="rounded-lg border p-3 flex items-center justify-between"><span>Exam stress guide (HI)</span><Button size="sm" variant="outline" className="rounded-full">Publish</Button></div>
        </CardContent>
      </Card>
    </div>
  );
}
