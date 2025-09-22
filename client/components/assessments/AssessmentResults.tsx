import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { AssessmentScore } from "./AssessmentFlow";
import { Brain, Heart, CheckCircle, AlertTriangle, MessageCircle } from "lucide-react";

interface AssessmentResultsProps {
  scores: AssessmentScore;
  onComplete: () => void;
}

export function AssessmentResults({ scores, onComplete }: AssessmentResultsProps) {
  const getPHQ9Severity = (score: number) => {
    if (score <= 4) return { level: "Minimal", color: "bg-green-500", description: "Little to no depression" };
    if (score <= 9) return { level: "Mild", color: "bg-yellow-500", description: "Mild depression symptoms" };
    if (score <= 14) return { level: "Moderate", color: "bg-orange-500", description: "Moderate depression symptoms" };
    if (score <= 19) return { level: "Moderately Severe", color: "bg-red-500", description: "Moderately severe depression" };
    return { level: "Severe", color: "bg-red-700", description: "Severe depression symptoms" };
  };

  const getGAD7Severity = (score: number) => {
    if (score <= 4) return { level: "Minimal", color: "bg-green-500", description: "Little to no anxiety" };
    if (score <= 9) return { level: "Mild", color: "bg-yellow-500", description: "Mild anxiety symptoms" };
    if (score <= 14) return { level: "Moderate", color: "bg-orange-500", description: "Moderate anxiety symptoms" };
    return { level: "Severe", color: "bg-red-500", description: "Severe anxiety symptoms" };
  };

  const getGHQSeverity = (score: number) => {
    if (score <= 11) return { level: "Good", color: "bg-green-500", description: "Good general mental health" };
    if (score <= 15) return { level: "Mild distress", color: "bg-yellow-500", description: "Mild psychological distress" };
    if (score <= 20) return { level: "Moderate distress", color: "bg-orange-500", description: "Moderate psychological distress" };
    return { level: "Severe distress", color: "bg-red-500", description: "Severe psychological distress" };
  };

  const phq9Result = getPHQ9Severity(scores.phq9);
  const gad7Result = getGAD7Severity(scores.gad7);
  const ghqResult = getGHQSeverity(scores.ghq);

  const hasHighRisk = scores.phq9 >= 15 || scores.gad7 >= 15 || scores.ghq >= 20;
  const hasModerateRisk = scores.phq9 >= 10 || scores.gad7 >= 10 || scores.ghq >= 15;

  const getCounselorPersonality = () => {
    if (hasHighRisk) {
      return {
        approach: "supportive and crisis-aware",
        tone: "gentle, validating, and focused on safety",
        priority: "immediate support and professional referral guidance"
      };
    } else if (hasModerateRisk) {
      return {
        approach: "empathetic and solution-focused",
        tone: "warm, understanding, and encouraging",
        priority: "coping strategies and emotional support"
      };
    } else {
      return {
        approach: "positive and preventive",
        tone: "friendly, optimistic, and educational",
        priority: "wellness maintenance and growth"
      };
    }
  };

  const counselorStyle = getCounselorPersonality();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Assessment Complete
          </CardTitle>
          <p className="text-muted-foreground">
            Here are your results. Remember, this is not a medical diagnosis but helps personalize our conversation.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* PHQ-9 Results */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Brain className="h-5 w-5 text-blue-600" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">PHQ-9 Depression Scale</span>
                  <Badge variant="outline">{scores.phq9}/27</Badge>
                </div>
                <Progress value={(scores.phq9 / 27) * 100} className="h-2 mt-2" />
              </div>
            </div>
            <div className="ml-8">
              <div className="flex items-center gap-2 mb-1">
                <div className={`h-3 w-3 rounded-full ${phq9Result.color}`} />
                <span className="font-medium">{phq9Result.level}</span>
              </div>
              <p className="text-sm text-muted-foreground">{phq9Result.description}</p>
            </div>
          </div>

          {/* GAD-7 Results */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Heart className="h-5 w-5 text-green-600" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">GAD-7 Anxiety Scale</span>
                  <Badge variant="outline">{scores.gad7}/21</Badge>
                </div>
                <Progress value={(scores.gad7 / 21) * 100} className="h-2 mt-2" />
              </div>
            </div>
            <div className="ml-8">
              <div className="flex items-center gap-2 mb-1">
                <div className={`h-3 w-3 rounded-full ${gad7Result.color}`} />
                <span className="font-medium">{gad7Result.level}</span>
              </div>
              <p className="text-sm text-muted-foreground">{gad7Result.description}</p>
            </div>
          </div>

          {/* GHQ Results */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-purple-600" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">GHQ-12 General Health</span>
                  <Badge variant="outline">{scores.ghq}/36</Badge>
                </div>
                <Progress value={(scores.ghq / 36) * 100} className="h-2 mt-2" />
              </div>
            </div>
            <div className="ml-8">
              <div className="flex items-center gap-2 mb-1">
                <div className={`h-3 w-3 rounded-full ${ghqResult.color}`} />
                <span className="font-medium">{ghqResult.level}</span>
              </div>
              <p className="text-sm text-muted-foreground">{ghqResult.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Alerts */}
      {hasHighRisk && (
        <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription>
            <div className="font-medium mb-2">Higher Support Recommended</div>
            <p className="text-sm mb-3">
              Your responses suggest you may benefit from additional professional support. 
              Please consider speaking with a counselor or mental health professional.
            </p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" asChild>
                <a href="/booking">Book Counseling</a>
              </Button>
              <Button size="sm" variant="outline" asChild>
                <a href="tel:988">Crisis Helpline: 988</a>
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {hasModerateRisk && !hasHighRisk && (
        <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription>
            <div className="font-medium mb-2">Additional Support Available</div>
            <p className="text-sm">
              Your responses suggest you might benefit from talking to someone. 
              Consider booking a session with one of our counselors.
            </p>
          </AlertDescription>
        </Alert>
      )}

      {/* Counselor Approach */}
      <Card className="bg-blue-50 dark:bg-blue-900/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <MessageCircle className="h-5 w-5 text-blue-600" />
            <span className="font-medium">Your Personalized AI Counselor</span>
          </div>
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium">Approach:</span> I'll be {counselorStyle.approach} in our conversation.
            </p>
            <p>
              <span className="font-medium">Tone:</span> My responses will be {counselorStyle.tone}.
            </p>
            <p>
              <span className="font-medium">Focus:</span> I'll prioritize {counselorStyle.priority}.
            </p>
          </div>
        </CardContent>
      </Card>

      <Button onClick={onComplete} className="w-full" size="lg">
        <MessageCircle className="h-4 w-4 mr-2" />
        Start Counseling Chat
      </Button>
    </div>
  );
}