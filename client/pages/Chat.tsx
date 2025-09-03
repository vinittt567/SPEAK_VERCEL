import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Bot, ShieldCheck, SendHorizontal } from "lucide-react";

const PHQ9 = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless",
  "Trouble falling or staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself — or that you are a failure or have let yourself or your family down",
  "Trouble concentrating on things, such as reading the newspaper or watching television",
  "Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual",
  "Thoughts that you would be better off dead or of hurting yourself in some way",
];

const scale = [
  { v: 0, label: "Not at all" },
  { v: 1, label: "Several days" },
  { v: 2, label: "More than half the days" },
  { v: 3, label: "Nearly every day" },
];

export default function Chat() {
  const [messages, setMessages] = useState<Array<{ role: "bot" | "user"; text: string }>>([
    { role: "bot", text: "Hi, I'm your AI first-aid assistant. How are you feeling right now?" },
  ]);
  const [input, setInput] = useState("");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(PHQ9.length).fill(-1));
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, step]);

  const progress = useMemo(() => Math.round((answers.filter(a=>a>=0).length / PHQ9.length) * 100), [answers]);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: "user", text }, { role: "bot", text: "Thanks for sharing. Would you like to try a short screening or a calming exercise?" }]);
    setInput("");
  };

  const chooseQuick = (text: string) => send(text);

  const setAnswer = (idx: number, val: number) => {
    const next = [...answers];
    next[idx] = val;
    setAnswers(next);
    if (idx < PHQ9.length - 1) setStep(idx + 1);
  };

  return (
    <div className="container py-6 grid lg:grid-cols-[2fr_1fr] gap-6 min-h-[calc(100vh-56px-56px)]">
      <div className="space-y-4">
        <Alert className="bg-primary/10 border-primary/30">
          <ShieldCheck className="h-4 w-4" />
          <AlertTitle>Talk to a counselor now</AlertTitle>
          <AlertDescription>
            If you prefer human support, you can book a confidential session or call the helpline below.
          </AlertDescription>
        </Alert>

        <Card>
          <CardContent className="p-0">
            <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
              {messages.map((m, i) => (
                <div key={i} className={m.role === "bot" ? "flex gap-3" : "flex gap-3 justify-end"}>
                  {m.role === "bot" && (
                    <div className="h-8 w-8 rounded-full bg-primary/10 text-primary grid place-items-center"><Bot className="h-4 w-4"/></div>
                  )}
                  <div className={m.role === "bot" ? "bg-muted rounded-2xl rounded-tl-md p-3 max-w-[70%]" : "bg-primary text-primary-foreground rounded-2xl rounded-tr-md p-3 max-w-[70%]"}>
                    {m.text}
                  </div>
                </div>
              ))}

              <div className="flex flex-wrap gap-2">
                {[
                  "I'm stressed",
                  "Can't sleep",
                  "Feeling anxious",
                  "I need someone to talk to",
                ].map((q) => (
                  <button key={q} onClick={()=>chooseQuick(q)} className="px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 text-sm">
                    {q}
                  </button>
                ))}
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="text-sm text-muted-foreground">PHQ-9 Screening</div>
                <div className="rounded-xl border p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium">{PHQ9[step]}</span>
                    <span className="text-xs text-muted-foreground">{step + 1} / {PHQ9.length}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {scale.map((s) => (
                      <button
                        key={s.v}
                        onClick={() => setAnswer(step, s.v)}
                        className={`px-3 py-2 rounded-full text-sm border ${answers[step]===s.v ? "bg-primary text-primary-foreground border-primary" : "bg-background hover:bg-muted"}`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                  <div className="mt-4">
                    <Progress value={progress} />
                  </div>
                </div>
              </div>

              <div ref={bottomRef} />
            </div>

            <div className="border-t p-3 flex items-center gap-2">
              <Input value={input} onChange={(e)=>setInput(e.target.value)} placeholder="Type a message" className="rounded-full"/>
              <Button onClick={()=>send(input)} className="rounded-full" size="icon"><SendHorizontal className="h-4 w-4"/></Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <WellnessBreathing />
        <GroundingFive />
        <TipsCard />
      </div>
    </div>
  );
}

function WellnessBreathing(){
  const [count, setCount] = useState(4);
  const [phase, setPhase] = useState<"Inhale"|"Hold"|"Exhale">("Inhale");
  useEffect(()=>{
    const t = setInterval(()=>{
      setCount((c)=> c>1 ? c-1 : 4);
      setPhase((p)=> p === "Inhale" ? "Hold" : p === "Hold" ? "Exhale" : "Inhale");
    }, 1000);
    return ()=> clearInterval(t);
  },[]);
  return (
    <Card className="bg-teal-50/50 dark:bg-teal-900/20">
      <CardContent className="p-4">
        <div className="text-sm text-muted-foreground mb-2">Breathing timer</div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold">{count}</div>
            <div className="text-sm">{phase}</div>
          </div>
          <div className="h-20 w-20 rounded-full bg-primary/10 grid place-items-center animate-pulse">
            <div className="h-12 w-12 rounded-full bg-primary/20" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function GroundingFive(){
  const items = ["5 things you can see","4 things you can feel","3 things you can hear","2 things you can smell","1 thing you can taste"];
  return (
    <Card>
      <CardContent className="p-4 space-y-2">
        <div className="text-sm text-muted-foreground">5-4-3-2-1 Grounding</div>
        {items.map((t, i)=> (
          <div key={i} className="flex items-center gap-2">
            <Badge variant="secondary" className="rounded-full">{5-i}</Badge>
            <span className="text-sm">{t}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function TipsCard(){
  return (
    <Card>
      <CardContent className="p-4 space-y-2">
        <div className="text-sm text-muted-foreground">Quick tips</div>
        <ul className="list-disc pl-5 text-sm space-y-1">
          <li>Try a short walk and hydrate</li>
          <li>Limit caffeine late in the day</li>
          <li>Reach out to a trusted peer</li>
        </ul>
      </CardContent>
    </Card>
  );
}
