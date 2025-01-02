import { WeightingResponses, Rankings } from '@/components/assessment/EnneagramAssessment';
import { rankingQuestions } from '@/app/data/assessment/AssessmentQuestions';

export function calculateAssessmentResults(
  weightingResponses: WeightingResponses,
  rankings: Rankings
) {
  console.log('calculateResults function triggered');
    
  const typeScores: { [key: string]: number } = {};
    
  // Initialize scores for all types
  for (let i = 1; i <= 9; i++) {
    typeScores[i.toString()] = 0;
  }

  // Constants for scoring
  const pointsPerQuestion = 8.33; // 100/12 points possible per question
  const secondPlaceMultiplier = 0.5; // Second place gets half points
    
  // Calculate points without initial normalization
  rankingQuestions.forEach((rankingQuestion, questionIndex) => {
    // Get weight from Likert response (0-1)
    const weight = weightingResponses[rankingQuestion.likertId] / 100;
    const questionRankings = rankings[questionIndex] || [];
        
    questionRankings.forEach((optionIndex, rankIndex) => {
      const option = rankingQuestion.options[optionIndex];
      const type = option.type;
            
      if (rankIndex === 0) {
        // First choice gets full points * weight
        typeScores[type] += pointsPerQuestion * weight;
      } else if (rankIndex === 1) {
        // Second choice gets half points * weight
        typeScores[type] += (pointsPerQuestion * secondPlaceMultiplier) * weight;
      }
      // Third choice gets no points
    });
  });

  console.log('Final scores:', typeScores);
  return typeScores;
}