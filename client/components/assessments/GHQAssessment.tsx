import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle } from "lucide-react";

const GHQ_QUESTIONS = [
  "Been able to concentrate on whatever you're doing",
  "Lost much sleep over worry",
  "Felt that you were playing a useful part in things",
  "Felt capable of making decisions about things",
  "Felt constantly under strain",
  "Felt you couldn't overcome your difficulties",
  "Been able to enjoy your normal day-to-day activities",
  "Been able to face up to your problems",
  "Been feeling unhappy and depressed",
  "Been losing confidence in yourself",
  "Been thinking of yourself as a worthless person",
  "Been feeling reasonably happy, all things considered"
];

// GHQ uses different scoring - positive items (1,3,4,7,8,12) are reverse scored
const POSITIVE_ITEMS = [0, 2, 3, 6, 7, 11]; // 0-indexed

const RESPONSE_OPTIONS = [
  { value: "0", label: "Better than usual", score: 0 },
  { value: "1", label: "Same as usual", score: 1 },
  { value: "2", label: "Less than usual", score: 2 },
  { value: "3", label: "Much less than usual", score: 3 }
];

const NEGATIVE_RESPONSE_OPTIONS = [
  { value: "0", label: "Not at all", score: 0 },
  { value: "1", label: "No more than usual", score: 1 },
  { value: "2", label: "Rather more than usual", score: 2 },
  { value: "3", label: "Much more than usual", score: 3 }
];

interface GHQAssessmentProps {
  onComplete: (score: number) => void;
}

export function GHQAssessment({ onComplete }: GHQAssessmentProps) {
  const [responses, setResponses] = useState<Record<number, number>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const handleResponse = (questionIndex: number, score: number) => {
    setResponses(prev => ({ ...prev, [questionIndex]: score }));
  };

  const canProceed = responses[currentQuestion] !== undefined;
  const isLastQuestion = currentQuestion === GHQ_QUESTIONS.length - 1;
  const isPositiveItem = POSITIVE_ITEMS.includes(currentQuestion);

  const handleNext = () => {
    if (isLastQuestion) {
      // Calculate GHQ score with reverse scoring for positive items
      const totalScore = Object.entries(responses).reduce((sum, [index, score]) => {
        const questionIndex = parseInt(index);
        const adjustedScore = POSITIVE_ITEMS.includes(questionIndex) 
          ? Math.max(0, 3 - score) // Reverse score for positive items
          : score;
        return sum + adjustedScore;
      }, 0);
      onComplete(totalScore);
    } else {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const currentOptions = isPositiveItem ? RESPONSE_OPTIONS : NEGATIVE_RESPONSE_OPTIONS;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 grid place-items-center">
            <CheckCircle className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <CardTitle>GHQ-12 General Health Assessment</CardTitle>
            <p className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {GHQ_QUESTIONS.length}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-medium mb-4">
            Have you recently:
          </h3>
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="font-medium">{GHQ_QUESTIONS[currentQuestion]}</p>
          </div>
        </div>

        <RadioGroup
          value={responses[currentQuestion]?.toString() || ""}
          onValueChange={(value) => handleResponse(currentQuestion, parseInt(value))}
        >
          {currentOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted/50">
              <RadioGroupItem value={option.value} id={`ghq-${currentQuestion}-${option.value}`} />
              <Label 
                htmlFor={`ghq-${currentQuestion}-${option.value}`} 
                className="flex-1 cursor-pointer"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>

        <div className="flex justify-between pt-4">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          <Button 
            onClick={handleNext}
            disabled={!canProceed}
          >
            {isLastQuestion ? 'Complete GHQ-12' : 'Next Question'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}