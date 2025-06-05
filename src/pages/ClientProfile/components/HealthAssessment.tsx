import React, { useState } from 'react';
import { Stack, ActionIcon, Flex, Card, Text, Modal, Radio, Checkbox, Textarea } from '@mantine/core';
import { IconArrowsMaximize } from '@tabler/icons-react'; 
import { assessmentQuesData2 } from './data';

// Define types for the question data (based on usage in the code)
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
  const [opened, setOpened] = useState(false);

  if (!data || !data.q_and_a) {
    return (
      <Card withBorder radius="md" className="hover:shadow-md hover:cursor-pointer">
        <Stack>
          <Text fw={500} fz={20}>
            Mental Health Assessment
          </Text>
          <Text fz={14} color="gray">
            No data available
          </Text>
        </Stack>
      </Card>
    );
  }

  // Filter q_and_a keys to only those that start with "q"
  const filteredQandA: (QuestionData & { id: number; answer: string | string[] })[] = Object.entries(data.q_and_a)
    .filter(([key]) => key.startsWith('q'))
    .map(([key, value]) => {
      const questionId = parseInt(key.substring(1)); // Extract numeric part (e.g., "q2" -> 2)
      const questionData = assessmentQuesData2.find((q) => q.id === questionId);
      return { id: questionId, answer: value, ...questionData };
    })
    .filter((q): q is QuestionData & { id: number; answer: string | string[] } => !!q.question); // Ensure only valid questions are included

  // Function to render each question
  const renderQuestion = ({ question, options, inputType, id, answer }: QuestionData & { id: number; answer: string | string[] }) => {
    if (!question) return null; // Skip if question is missing

    const selectedValues = Array.isArray(answer) ? answer : [answer]; // Ensure array for checkboxes
    const optionStyles = { label: { color: '#000000' } };

    switch (inputType) {
      case 'radio':
        return (
          <Radio.Group label={question} value={String(selectedValues[0])} disabled>
            {options?.map((option, idx) => (
              <Radio
                key={idx}
                value={String(idx)}
                label={option}
                checked={String(selectedValues[0]) === String(idx)}
                styles={optionStyles}
              />
            ))}
          </Radio.Group>
        );

      case 'checkbox':
        return (
          <Checkbox.Group label={question} value={selectedValues.map(String)} disabled>
            {options?.map((option, idx) => (
              <Checkbox
                key={idx}
                value={String(idx)}
                label={option}
                checked={selectedValues.includes(String(idx))}
                styles={optionStyles}
              />
            ))}
          </Checkbox.Group>
        );

      case 'textarea':
        return (
          <Textarea
            label={question}
            value={selectedValues[0] || ''}
            disabled
            styles={{ label: { color: '#000000' } }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Card withBorder radius="md" className="hover:shadow-md hover:cursor-pointer">
      <Stack>
        <Text fw={500} fz={20}>Mental Health Assessment</Text>
        <Flex fz={10} justify="space-between">
          <Text className="text-base font-normal">Onboarding</Text>
          <ActionIcon variant="white" onClick={() => setOpened(true)}>
            <IconArrowsMaximize /> {/* Replaced ExpandContent with a Tabler icon */}
          </ActionIcon>
        </Flex>

        {/* Modal to show filtered questions and answers */}
        <Modal opened={opened} onClose={() => setOpened(false)} title="Health Assessment Questions" size="xl">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '14px' }}>
            {filteredQandA.map((q) => (
              <div key={q.id} style={{ display: 'block' }}>
                {renderQuestion(q)}
              </div>
            ))}
          </div>
        </Modal>
      </Stack>
    </Card>
  );
}
