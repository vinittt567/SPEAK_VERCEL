import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import { Button } from "@/components/ui/button";

const usage = Array.from({ length: 12 }).map((_, i) => ({
  m: `M${i + 1}`,
  sessions: Math.round(200 + Math.sin(i / 2) * 60 + Math.random() * 30),
}));
const capacity = [
  { name: "Counselors", value: 12 },
  { name: "Avg wait (days)", value: 3 },
  { name: "Utilization %", value: 78 },
];

export default function PanelInstitute() {
  return (
    <div className="container py-8 space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Institution Panel</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Campus-wide Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{ sessions: { label: "Sessions", color: "#6366f1" } }}
              className="h-60"
            >
              <LineChart data={usage}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="m" />
                <YAxis allowDecimals={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="sessions"
                  stroke="var(--color-sessions)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Resource Allocation</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{ value: { label: "", color: "#10b981" } }}
              className="h-60"
            >
              <BarChart data={capacity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Bar
                  dataKey="value"
                  fill="var(--color-value)"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Policy Integration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="rounded-lg border p-3">
              Upload or update mental health protocol handbook.
            </div>
            <Button className="rounded-full">Manage policies</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Staff Coordination</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="rounded-lg border p-3">
              Schedule monthly training and assign counselor shifts.
            </div>
            <Button variant="outline" className="rounded-full">
              Open scheduler
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
