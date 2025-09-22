import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { PHQ9Assessment } from "./PHQ9Assessment";
import { GAD7Assessment } from "./GAD7Assessment";
import { GHQAssessment } from "./GHQAssessment";
import { AssessmentResults } from "./AssessmentResults";
import { ClipboardList, Brain, Heart, CheckCircle } from "lucide-react";

export interface AssessmentScore {
  phq9: number;
  gad7: number;
  ghq: number;
}

interface AssessmentFlowProps {
  onComplete: (scores: AssessmentScore) => void;
}

export function AssessmentFlow({ onComplete }: AssessmentFlowProps) {
  const [currentStep, setCurrentStep] = useState<'intro' | 'phq9' | 'gad7' | 'ghq' | 'results'>('intro');
  const [scores, setScores] = useState<Partial<AssessmentScore>>({});

  const handlePHQ9Complete = (score: number) => {
    setScores(prev => ({ ...prev, phq9: score }));
    setCurrentStep('gad7');
  };

  const handleGAD7Complete = (score: number) => {
    setScores(prev => ({ ...prev, gad7: score }));
    setCurrentStep('ghq');
  };

  const handleGHQComplete = (score: number) => {
    const finalScores = { ...scores, ghq: score } as AssessmentScore;
    setScores(finalScores);
    setCurrentStep('results');
  };

  const handleResultsComplete = () => {
    onComplete(scores as AssessmentScore);
  };

  const getProgress = () => {
    switch (currentStep) {
      case 'intro': return 0;
      case 'phq9': return 25;
      case 'gad7': return 50;
      case 'ghq': return 75;
      case 'results': return 100;
      default: return 0;
    }
  };

  if (currentStep === 'intro') {
    return (
      <div className="container py-8 max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 grid place-items-center mb-4">
              <ClipboardList className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Mental Health Assessment</CardTitle>
            <p className="text-muted-foreground">
              Before we begin our conversation, let's complete a brief assessment to better understand how you're feeling. This will help me provide more personalized support.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <Brain className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="font-medium">PHQ-9 (Depression)</div>
                  <div className="text-sm text-muted-foreground">9 questions about mood and interest</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <Heart className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-medium">GAD-7 (Anxiety)</div>
                  <div className="text-sm text-muted-foreground">7 questions about worry and anxiety</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <CheckCircle className="h-5 w-5 text-purple-600" />
                <div>
                  <div className="font-medium">GHQ-12 (General Health)</div>
                  <div className="text-sm text-muted-foreground">12 questions about overall wellbeing</div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="text-sm">
                <div className="font-medium mb-2">Important Notes:</div>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• This assessment takes about 5-7 minutes</li>
                  <li>• Your responses are completely confidential</li>
                  <li>• This is not a medical diagnosis</li>
                  <li>• Results help personalize our conversation</li>
                </ul>
              </div>
            </div>

            <Button onClick={() => setCurrentStep('phq9')} className="w-full">
              Begin Assessment
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">Mental Health Assessment</h2>
          <Badge variant="outline">{getProgress()}% Complete</Badge>
        </div>
        <Progress value={getProgress()} className="h-2" />
      </div>

      {currentStep === 'phq9' && <PHQ9Assessment onComplete={handlePHQ9Complete} />}
      {currentStep === 'gad7' && <GAD7Assessment onComplete={handleGAD7Complete} />}
      {currentStep === 'ghq' && <GHQAssessment onComplete={handleGHQComplete} />}
      {currentStep === 'results' && (
        <AssessmentResults 
          scores={scores as AssessmentScore} 
          onComplete={handleResultsComplete} 
        />
      )}
    </div>
  );
}