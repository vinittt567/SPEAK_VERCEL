import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Heart } from "lucide-react";

const GAD7_QUESTIONS = [
  "Feeling nervous, anxious, or on edge",
  "Not being able to stop or control worrying",
  "Worrying too much about different things",
  "Trouble relaxing",
  "Being so restless that it is hard to sit still",
  "Becoming easily annoyed or irritable",
  "Feeling afraid, as if something awful might happen"
];

const RESPONSE_OPTIONS = [
  { value: "0", label: "Not at all", score: 0 },
  { value: "1", label: "Several days", score: 1 },
  { value: "2", label: "More than half the days", score: 2 },
  { value: "3", label: "Nearly every day", score: 3 }
];

interface GAD7AssessmentProps {
  onComplete: (score: number) => void;
}

export function GAD7Assessment({ onComplete }: GAD7AssessmentProps) {
  const [responses, setResponses] = useState<Record<number, number>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const handleResponse = (questionIndex: number, score: number) => {
    setResponses(prev => ({ ...prev, [questionIndex]: score }));
  };

  const canProceed = responses[currentQuestion] !== undefined;
  const isLastQuestion = currentQuestion === GAD7_QUESTIONS.length - 1;

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
          <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 grid place-items-center">
            <Heart className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <CardTitle>GAD-7 Anxiety Assessment</CardTitle>
            <p className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {GAD7_QUESTIONS.length}
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
            <p className="font-medium">{GAD7_QUESTIONS[currentQuestion]}</p>
          </div>
        </div>

        <RadioGroup
          value={responses[currentQuestion]?.toString() || ""}
          onValueChange={(value) => handleResponse(currentQuestion, parseInt(value))}
        >
          {RESPONSE_OPTIONS.map((option) => (
            <div key={option.value} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted/50">
              <RadioGroupItem value={option.value} id={`gad7-${currentQuestion}-${option.value}`} />
              <Label 
                htmlFor={`gad7-${currentQuestion}-${option.value}`} 
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
            {isLastQuestion ? 'Complete GAD-7' : 'Next Question'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}