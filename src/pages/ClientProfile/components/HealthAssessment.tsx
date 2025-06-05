import { useState } from 'react';
import { Box, Card, CardContent, Typography, IconButton, Modal, ModalDialog, Radio, RadioGroup, Checkbox, Textarea, Divider } from '@mui/joy';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import { assessmentQuesData2 } from './data';

// Define types for the question data
interface QuestionData {
  id: number;
  question: string;
  options?: string[];
  inputType: 'radio' | 'checkbox' | 'textarea';
}

// Define type for the q_and_a object
interface QandA {
  [key: string]: string | string[] | undefined;
}

// Define props for the component
interface HealthAssessmentListProps {
  data: {
    q_and_a?: QandA;
  } | null;
}

export default function HealthAssessmentList({ data }: HealthAssessmentListProps) {
  const [open, setOpen] = useState(false);

  if (!data || !data.q_and_a) {
    return (
      <Card
        variant="outlined"
        sx={{
          '&:hover': {
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            cursor: 'pointer',
          },
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography level="h4" fontWeight="500">
              Mental Health Assessment
            </Typography>
            <Typography level="body-sm" color="neutral">
              No data available
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  // Filter q_and_a keys to only those that start with "q"
  const filteredQandA: (QuestionData & { id: number; answer: string | string[] })[] = Object.entries(data.q_and Grown-ups-and-downs/data.q_and_a)
    .filter(([key]) => key.startsWith('q'))
    .map(([key, value]) => {
      const questionId = parseInt(key.substring(1)); // Extract numeric part (e.g., "q2" -> 2)
      const questionData = assessmentQuesData2.find((q) => q.id === questionId);
      return { id: questionId, answer: value, ...questionData };
    })
    .filter((q): q is QuestionData & { id: number; answer: string | string[] } => !!q.question); // Ensure only valid questions are included

  // Function to render each question
  const renderQuestion = ({ question, options, inputType, answer }: QuestionData & { id: number; answer: string | string[] }) => {
    if (!question) return null; // Skip if question is missing

    const selectedValues = Array.isArray(answer) ? answer : [answer]; // Ensure array for checkboxes

    switch (inputType) {
      case 'radio':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography level="body-md" fontWeight="500">
              {question}
            </Typography>
            <RadioGroup value={String(selectedValues[0])} disabled>
              {options?.map((option, idx) => (
                <Radio
                  key={idx}
                  value={String(idx)}
                  label={option}
                  checked={String(selectedValues[0]) === String(idx)}
                  sx={{ color: '#000000' }}
                />
              ))}
            </RadioGroup>
          </Box>
        );

      case 'checkbox':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography level="body-md" fontWeight="500">
              {question}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              {options?.map((option, idx) => (
                <Checkbox
                  key={idx}
                  value={String(idx)}
                  label={option}
                  checked={selectedValues.includes(String(idx))}
                  disabled
                  sx={{ color: '#000000' }}
                />
              ))}
            </Box>
          </Box>
        );

      case 'textarea':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography level="body-md" fontWeight="500">
              {question}
            </Typography>
            <Textarea value={selectedValues[0] || ''} disabled readOnly />
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Card
      variant="outlined"
      sx={{
        '&:hover': {
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          cursor: 'pointer',
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography level="h4" fontWeight="500">
            Mental Health Assessment
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography level="body-sm" fontSize={10}>
              Onboarding
            </Typography>
            <IconButton variant="plain" onClick={() => setOpen(true)}>
              <FullscreenIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Modal to show filtered questions and answers */}
        <Modal open={open} onClose={() => setOpen(false)}>
          <ModalDialog
            aria-labelledby="health-assessment-modal"
            size="lg"
            sx={{ width: '100%', maxWidth: 800, p: 2 }}
          >
            <Typography id="health-assessment-modal" level="h2" sx={{ mb: 2 }}>
              Health Assessment Questions
            </Typography>
            <Divider />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2, maxHeight: '70vh', overflow: 'auto' }}>
              {filteredQandA.map((q) => (
                <Box key={q.id}>
                  {renderQuestion(q)}
                </Box>
              ))}
            </Box>
          </ModalDialog>
        </Modal>
      </CardContent>
    </Card>
  );
}
