import React, { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/firebase'; // Import Firebase configuration
import { generateStudyPlan } from './services/aiServices'; // Import AI service

interface Resource {
  title: string;
  link: string;
}

interface QuizResult {
  userId: string;
  course: string;
  score: number;
  totalQuestions: number;
  topics: string[];
  timestamp: string;
}

interface StudyPlanPageProps {
  course: string; // Current course for which the study plan is generated
}

const StudyPlanPage: React.FC<StudyPlanPageProps> = ({ course }) => {
  const { userId } = useAuth(); // Get the current user's ID
  const [studyPlan, setStudyPlan] = useState<string[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [noQuizData, setNoQuizData] = useState(false); // State to track if no quiz data exists

  // Fetch quiz results and generate study plan
  useEffect(() => {
    const fetchQuizResults = async () => {
      if (!userId) return;

      try {
        // Fetch quiz results from Firebase
        const quizResultsRef = collection(db, 'quizResults');
        const q = query(quizResultsRef, where('userId', '==', userId), where('course', '==', course));
        const quizResultsSnapshot = await getDocs(q);

        // Log Firebase data
        console.log('Quiz Results:', quizResultsSnapshot.docs.map((doc) => doc.data()));

        // Check if quiz data exists
        if (quizResultsSnapshot.empty) {
          setNoQuizData(true); // No quiz data found
          setStudyPlan([]);
          setResources([]);
          setLoading(false);
          return;
        }

        const quizResults: QuizResult[] = quizResultsSnapshot.docs.map((doc) => doc.data() as QuizResult);

        // Prepare data for AI model
        const topics = quizResults.flatMap((result) => result.topics);
        const weakAreas = quizResults
          .filter((result) => result.score < 70) // Assuming 70 is the passing score
          .flatMap((result) => result.topics);

        const promptData = {
          topics: [...new Set(topics)], // Remove duplicates
          weakAreas: [...new Set(weakAreas)],
          previousScores: quizResults.map((result) => ({
            topic: result.topics.join(', '),
            score: result.score,
          })),
        };

        // Call AI model to generate study plan and resources
        try {
          const { studyPlan, resources } = await generateStudyPlan(promptData);
          console.log('Study Plan:', studyPlan);
          console.log('Resources:', resources);
          setStudyPlan(studyPlan);
          setResources(resources);
        } catch (error) {
          console.error('Error generating study plan:', error);
        }
      } catch (error) {
        console.error('Error fetching quiz results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizResults();
  }, [userId, course]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 bg-background text-foreground min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Your Study Plan for {course}</h1>

      {/* Display message if no quiz data exists */}
      {noQuizData ? (
        <div className="mb-8">
          <p className="text-lg text-muted-foreground">
            No quiz data found. Take a quiz to generate a personalized study plan.
          </p>
        </div>
      ) : (
        <>
          {/* Display Study Plan */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Study Plan</h2>
            <ul className="list-disc list-inside">
              {studyPlan.map((item, index) => (
                <li key={index} className="mb-2">{item}</li>
              ))}
            </ul>
          </div>

          {/* Display Resources */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Resources</h2>
            <ul className="list-disc list-inside">
              {resources.map((resource, index) => (
                <li key={index} className="mb-2">
                  <a
                    href={resource.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {resource.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default StudyPlanPage;