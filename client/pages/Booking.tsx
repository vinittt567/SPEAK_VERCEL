import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { CalendarDays, HelpCircle, Lock, Video, MapPin, CheckCircle2, Star, Users, Clock, Phone } from "lucide-react";
import { format, isBefore, isToday, parse, addDays } from "date-fns";
import { cn } from "@/lib/utils";
import { useCounselors } from "@/hooks/useCounselors";

interface Counselor {
  id: string;
  name: string;
  specialty: string[];
  languages: string[];
  mode: string;
  status: string;
  platform: string;
  meetLink: string;
  avatar?: string;
  bio?: string;
  rating?: number;
  totalSessions?: number;
}

const SPECIALTIES = ["Stress", "Anxiety", "Career"] as const;
const LANGS = ["English", "Hindi", "Kashmiri"] as const;
const MODES = ["Online", "In-person", "Both"] as const;

const DEFAULT_SLOTS = [
  "09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM",
];

function initials(name: string) {
  return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
}

function makePseudonym() {
  const key = "calmcampus_pseudo";
  const saved = typeof window !== "undefined" ? localStorage.getItem(key) : null;
  if (saved) return saved;
  const pseudo = `Student${String(new Date().getDate())}`;
  try { localStorage.setItem(key, pseudo); } catch { }
  return pseudo;
}

function generateAnonName() {
  return "Anonymous_User_" + Math.floor(Math.random() * 10000);
}

export default function Booking() {
  // Load counselors from MongoDB
  const { counselors, loading: counselorsLoading, error: counselorsError } = useCounselors();
  
  // Booking states
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [specialty, setSpecialty] = useState<string>("All");
  const [language, setLanguage] = useState<string>("All");
  const [mode, setMode] = useState<string>("All");
  const [counselor, setCounselor] = useState<any>(null);
  const [slot, setSlot] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [prefFormat, setPrefFormat] = useState<string>("Video");
  const [openConfirm, setOpenConfirm] = useState(false);
  const [remEmail, setRemEmail] = useState(true);
  const [remSms, setRemSms] = useState(false);
  const [remPush, setRemPush] = useState(false);

  useEffect(() => { 
    if (counselor && counselor.status === "Full") setCounselor(null); 
  }, [specialty, language, mode]);

  const filtered = useMemo(() => {
    if (!counselors.length) return [];
    
    let filteredCounselors = counselors.filter(c =>
      (specialty === "All" || c.specialty.includes(specialty)) &&
      (language === "All" || c.languages.includes(language)) &&
      (mode === "All" || c.mode === mode || (mode === "Online" && c.mode === "Both") || (mode === "In-person" && c.mode === "Both"))
    );

    // Sort by rating and availability
    filteredCounselors = filteredCounselors.sort((a, b) => {
      if (a.status === "Available" && b.status !== "Available") return -1;
      if (b.status === "Available" && a.status !== "Available") return 1;
      return (b.rating || 0) - (a.rating || 0);
    });

    return filteredCounselors;
  }, [counselors, specialty, language, mode]);

  const pseudo = makePseudonym();

  const slotDisabled = (s: string) => {
    if (!selectedDate) return true;
    const booked: Record<string, string[]> = {
      counsellor_1: ["10:00 AM"],
      counsellor_2: ["01:00 PM", "03:00 PM"],
      counsellor_3: ["11:00 AM"],
      counsellor_4: ["02:00 PM"],
    };
    const parsed = parse(s, "hh:mm a", new Date());
    const dt = new Date(selectedDate);
    dt.setHours(parsed.getHours(), parsed.getMinutes(), 0, 0);
    if (isToday(selectedDate) && isBefore(dt, new Date())) return true;
    if (counselor && booked[counselor.id]?.includes(s)) return true;
    if (counselor?.status === "Full") return true;
    return false;
  };

  const canConfirm = Boolean(selectedDate && counselor && slot);
  const availableDates = Array.from({ length: 14 }, (_, i) => addDays(new Date(), i));

  const handleCallCounselor = (counselor: Counselor) => {
    if (!counselor.meetLink) {
      alert("This counselor doesn't have video calling available.");
      return;
    }
    
    const nickname = generateAnonName();
    localStorage.setItem("anonNickname", nickname);
    
    console.log("Anonymous call initiated:", {
      counselorId: counselor.id,
      counselorName: counselor.name,
      nickname: nickname,
      timestamp: new Date().toISOString()
    });
    
    window.open(counselor.meetLink, '_blank');
  };

  if (counselorsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading counselors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Book Your Counseling Session
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connect with experienced counselors for confidential support. Choose your preferred time and counselor.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-4">
            {[
              { step: 1, title: "Choose Date", icon: CalendarDays },
              { step: 2, title: "Select Counselor", icon: Users },
              { step: 3, title: "Pick Time", icon: Clock },
              { step: 4, title: "Confirm", icon: CheckCircle2 }
            ].map(({ step, title, icon: Icon }) => {
              const isActive = step === 1 ? !selectedDate : 
                              step === 2 ? selectedDate && !counselor :
                              step === 3 ? counselor && !slot :
                              step === 4 ? slot : false;
              const isCompleted = step === 1 ? selectedDate :
                                 step === 2 ? counselor :
                                 step === 3 ? slot :
                                 step === 4 ? canConfirm : false;
              
              return (
                <div key={step} className="flex items-center">
                  <div className={cn(
                    "flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all",
                    isCompleted ? "bg-green-500 border-green-500 text-white" :
                    isActive ? "bg-blue-500 border-blue-500 text-white" :
                    "bg-gray-100 border-gray-300 text-gray-400"
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="ml-3 hidden sm:block">
                    <p className={cn("text-sm font-medium", isCompleted || isActive ? "text-gray-900" : "text-gray-400")}>
                      {title}
                    </p>
                  </div>
                  {step < 4 && <div className="w-8 h-0.5 bg-gray-300 mx-4" />}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Date Selection */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <CalendarDays className="w-5 h-5 text-blue-600" />
                Choose Your Date
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {availableDates.map((date) => {
                  const isSelected = selectedDate && format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
                  const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
                  
                  return (
                    <button
                      key={date.toISOString()}
                      onClick={() => setSelectedDate(date)}
                      className={cn(
                        "p-4 rounded-xl border-2 transition-all hover:scale-105 text-center",
                        isSelected 
                          ? "border-blue-500 bg-blue-500 text-white shadow-lg" 
                          : "border-gray-200 hover:border-blue-300 bg-white"
                      )}
                    >
                      <div className="text-xs font-medium text-gray-500 mb-1">
                        {format(date, 'EEE')}
                      </div>
                      <div className={cn("text-lg font-bold", isSelected ? "text-white" : "text-gray-900")}>
                        {format(date, 'd')}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {format(date, 'MMM')}
                      </div>
                      {isToday && (
                        <div className="text-xs bg-green-100 text-green-600 rounded-full px-2 py-0.5 mt-1">
                          Today
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Counselor Selection */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Users className="w-5 h-5 text-blue-600" />
                  Choose Your Counselor
                </CardTitle>
                {/* Filters */}
                <div className="flex gap-2">
                  <Select value={specialty} onValueChange={setSpecialty}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All</SelectItem>
                      {SPECIALTIES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={mode} onValueChange={setMode}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All</SelectItem>
                      {MODES.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filtered.map((c) => {
                  const isSelected = counselor?.id === c.id;
                  
                  return (
                    <div
                      key={c.id}
                      className={cn(
                        "relative p-6 rounded-xl border-2 transition-all cursor-pointer hover:scale-[1.02]",
                        isSelected 
                          ? "border-blue-500 bg-blue-50 shadow-lg" 
                          : "border-gray-200 hover:border-blue-300 bg-white"
                      )}
                      onClick={() => setCounselor(c)}
                    >
                      {/* Status Badge */}
                      <div className="absolute top-4 right-4">
                        <Badge 
                          variant={c.status === "Available" ? "default" : c.status === "Full" ? "destructive" : "secondary"}
                          className="text-xs"
                        >
                          {c.status}
                        </Badge>
                      </div>

                      {/* Avatar */}
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                          {initials(c.name)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-900">{c.name}</h3>
                          <div className="flex items-center gap-1 mb-2">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{c.rating || 4.8}</span>
                            <span className="text-xs text-gray-500">({c.totalSessions || 0} sessions)</span>
                          </div>
                        </div>
                      </div>

                      {/* Specialties */}
                      <div className="mb-3">
                        <div className="flex flex-wrap gap-1">
                          {c.specialty.map((spec) => (
                            <Badge key={spec} variant="outline" className="text-xs">
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Languages & Mode */}
                      <div className="text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">Languages:</span>
                          <span>{c.languages.join(", ")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {c.mode !== "In-person" ? <Video className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                          <span>{c.mode}</span>
                        </div>
                      </div>

                      {/* Bio */}
                      {c.bio && (
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{c.bio}</p>
                      )}

                      {/* Call Now Button */}
                      {c.meetLink && c.status !== "Full" && (
                        <Button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCallCounselor(c);
                          }}
                          variant="outline" 
                          size="sm" 
                          className="w-full mt-2"
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          Call Now (Anonymous)
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {filtered.length === 0 && (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No counselors match your filters.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Time Slot Selection & Summary */}
          <div className="space-y-6">
            {/* Time Slot Selection */}
            {counselor && (
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Clock className="w-5 h-5 text-blue-600" />
                    Select Time Slot
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {DEFAULT_SLOTS.map((s) => {
                      const disabled = slotDisabled(s) || !counselor || !selectedDate;
                      const isSelected = slot === s;
                      
                      return (
                        <button
                          key={s}
                          disabled={disabled}
                          onClick={() => setSlot(s)}
                          className={cn(
                            "p-3 rounded-lg border-2 transition-all text-sm font-medium",
                            disabled 
                              ? "opacity-50 cursor-not-allowed border-gray-200 bg-gray-50" 
                              : isSelected 
                                ? "border-blue-500 bg-blue-500 text-white shadow-lg" 
                                : "border-gray-200 hover:border-blue-300 bg-white hover:bg-blue-50"
                          )}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                  {!selectedDate && (
                    <p className="text-sm text-gray-500 mt-4 text-center">Please select a date first.</p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Summary Card */}
            {(selectedDate || counselor || slot) && (
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">
                      {selectedDate ? format(selectedDate, "EEE, MMM d") : "--"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium">{slot || "--"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Counselor:</span>
                    <span className="font-medium">{counselor?.name || "--"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Mode:</span>
                    <span className="font-medium">{prefFormat}</span>
                  </div>
                  
                  {canConfirm && (
                    <div className="pt-4 border-t">
                      <Button 
                        onClick={() => setOpenConfirm(true)} 
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        size="lg"
                      >
                        <CheckCircle2 className="w-5 h-5 mr-2" />
                        Confirm Booking
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Privacy Notice */}
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
              <CardContent className="p-4 text-center">
                <Lock className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold text-green-800 mb-1">100% Confidential</h3>
                <p className="text-sm text-green-700">
                  Your booking is completely private. Only you and your counselor can see it.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Confirmation Dialog */}
        <Dialog open={openConfirm} onOpenChange={setOpenConfirm}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl">Confirm Your Appointment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Counselor:</span>
                    <span className="font-semibold">{counselor?.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-semibold">
                      {selectedDate ? format(selectedDate, "EEE, MMM d, yyyy") : "--"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-semibold">{slot}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Mode:</span>
                    <span className="font-semibold">{prefFormat}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Notification Preferences:</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Email reminders</span>
                    <Switch checked={remEmail} onCheckedChange={setRemEmail} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">SMS reminders</span>
                    <Switch checked={remSms} onCheckedChange={setRemSms} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Push notifications</span>
                    <Switch checked={remPush} onCheckedChange={setRemPush} />
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={() => setOpenConfirm(false)} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button 
                onClick={() => { 
                  setOpenConfirm(false); 
                  setTimeout(() => alert("Appointment booked successfully! 🎉"), 100); 
                }}
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" /> 
                Confirm Booking
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}