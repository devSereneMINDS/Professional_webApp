// Define the interface for question data
interface QuestionData {
  id: number;
  question: string;
  options: string[];
  inputType: 'radio' | 'checkbox';
}

// Export the assessmentQuesData2 array
export const assessmentQuesData2: QuestionData[] = [
  {
    id: 1,
    question: 'What do you hope to achieve from therapy? (Select all that apply)',
    options: [
      'Reduce stress/anxiety',
      'Improve mood',
      'Coping strategies',
      'Improve relationships',
      'Personal growth',
      'Other',
    ],
    inputType: 'checkbox',
  },
  {
    id: 2,
    question: 'What type of therapy approach do you prefer?',
    options: [
      'Structured (CBT, goal-based therapy)',
      'Open-ended (talk therapy, exploration)',
      'Not sure, I’m open to different approaches',
    ],
    inputType: 'radio',
  },
  {
    id: 3,
    question: 'Would you prefer:',
    options: ['In-person sessions', 'Online/video call sessions', 'No preference'],
    inputType: 'radio',
  },
  {
    id: 4,
    question: 'How frequently would you like to attend therapy?',
    options: ['Weekly', 'Bi-weekly', 'Monthly', 'As needed'],
    inputType: 'radio',
  },
  {
    id: 5,
    question: 'How often do you engage in physical activity/exercise?',
    options: ['Daily', 'A few times a week', 'Occasionally', 'Rarely or never'],
    inputType: 'radio',
  },
  {
    id: 6,
    question: 'How do you usually cope with stress? (Select all that apply)',
    options: [
      'Talking to friends/family',
      'Exercising',
      'Hobbies',
      'Meditation',
      'Avoiding problem',
      'Substance use',
      'Other',
    ],
    inputType: 'checkbox',
  },
  {
    id: 7,
    question: 'How would you rate your current work-life balance?',
    options: ['Very balanced', 'Somewhat balanced', 'Unbalanced but manageable', 'Very unbalanced'],
    inputType: 'radio',
  },
  {
    id: 8,
    question: 'What brings you to therapy? (Select all that apply)',
    options: [
      'Anxiety/Stress',
      'Depression/Low mood',
      'Relationship issues',
      'Work/School stress',
      'Grief/Loss',
      'Trauma/PTSD',
      'Self-esteem issues',
      'Anger management',
      'Substance use concerns',
      'Other',
    ],
    inputType: 'checkbox',
  },
  {
    id: 9,
    question: 'Have you previously attended therapy or counseling?',
    options: ['Yes, currently in therapy', 'Yes, but not currently in therapy', 'No, this is my first time'],
    inputType: 'radio',
  },
  {
    id: 10,
    question: 'How would you describe your current emotional state?',
    options: [
      'Generally happy and stable',
      'Occasionally stressed but manageable',
      'Often anxious or down',
      'Struggling significantly with emotions',
    ],
    inputType: 'radio',
  },
  {
    id: 11,
    question: 'Do you experience any of the following frequently? (Select all that apply)',
    options: [
      'Difficulty sleeping',
      'Changes in appetite',
      'Panic attacks',
      'Difficulty concentrating',
      'Mood swings',
      'Thoughts of self-harm',
    ],
    inputType: 'checkbox',
  },
  {
    id: 12,
    question: 'How comfortable are you discussing personal problems with others?',
    options: ['Very comfortable', 'Somewhat comfortable', 'Neutral', 'Uncomfortable', 'Very uncomfortable'],
    inputType: 'radio',
  },
  {
    id: 13,
    question: 'Do you have a strong support system? (Friends, family, community, etc.)',
    options: [
      'Yes, I have a reliable support system',
      'Somewhat, but it’s limited',
      'No, I often feel alone',
    ],
    inputType: 'radio',
  },
];
