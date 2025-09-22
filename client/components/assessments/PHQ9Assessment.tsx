import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Brain } from "lucide-react";

const PHQ9_QUESTIONS = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless",
  "Trouble falling or staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself or that you are a failure or have let yourself or your family down",
  "Trouble concentrating on things, such as reading the newspaper or watching television",
  "Moving or speaking so slowly that other people could have noticed. Or the opposite being so fidgety or restless that you have been moving around a lot more than usual",
  "Thoughts that you would be better off dead, or of hurting yourself"
];

const RESPONSE_OPTIONS = [
  { value: "0", label: "Not at all", score: 0 },
  { value: "1", label: "Several days", score: 1 },
  { value: "2", label: "More than half the days", score: 2 },
  { value: "3", label: "Nearly every day", score: 3 }
];

interface PHQ9AssessmentProps {
  onComplete: (score: number) => void;
}

export function PHQ9Assessment({ onComplete }: PHQ9AssessmentProps) {
  const [responses, setResponses] = useState<Record<number, number>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const handleResponse = (questionIndex: number, score: number) => {
    setResponses(prev => ({ ...prev, [questionIndex]: score }));
  };

  const canProceed = responses[currentQuestion] !== undefined;
  const isLastQuestion = currentQuestion === PHQ9_QUESTIONS.length - 1;

  const handleNext = () => {
    if (isLastQuestion) {
      const totalScore = Object.values(responses).reduce((sum, score) => sum + score, 0);
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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 grid place-items-center">
            <Brain className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <CardTitle>PHQ-9 Depression Assessment</CardTitle>
            <p className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {PHQ9_QUESTIONS.length}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-medium mb-4">
            Over the last 2 weeks, how often have you been bothered by:
          </h3>
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="font-medium">{PHQ9_QUESTIONS[currentQuestion]}</p>
          </div>
        </div>

        <RadioGroup
          value={responses[currentQuestion]?.toString() || ""}
          onValueChange={(value) => handleResponse(currentQuestion, parseInt(value))}
        >
          {RESPONSE_OPTIONS.map((option) => (
            <div key={option.value} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted/50">
              <RadioGroupItem value={option.value} id={`phq9-${currentQuestion}-${option.value}`} />
              <Label 
                htmlFor={`phq9-${currentQuestion}-${option.value}`} 
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
            {isLastQuestion ? 'Complete PHQ-9' : 'Next Question'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}