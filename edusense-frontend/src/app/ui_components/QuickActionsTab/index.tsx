import React, { useState } from 'react';
import './QuickActionsTab.scss';

interface QuickAction {
  id: string;
  name: string;
  description: string;
  formFields: { label: string; stateKey: string; type: string }[];
  promptTemplate: (data: any) => string;
}

const quickActions: QuickAction[] = [
  {
    id: 'checkin-assignment',
    name: 'Check-in Assignment',
    description: 'Create a check-in assignment for a given topic.',
    formFields: [
      { label: 'Topic', stateKey: 'topic', type: 'text' },
      { label: 'Number of Questions', stateKey: 'numQuestions', type: 'number' },
    ],
    promptTemplate: (data) =>
      `Create a check-in assignment about ${data.topic} with ${data.numQuestions} questions.`,
  },
  {
    id: 'assignment-rubric',
    name: 'Assignment Rubric',
    description: 'Generate a rubric for an assignment.',
    formFields: [{ label: 'Assignment Name', stateKey: 'assignmentName', type: 'text' }],
    promptTemplate: (data) => `Generate a rubric for the assignment: ${data.assignmentName}.`,
  },
  {
    id: 'lesson-notes',
    name: 'Lesson Notes',
    description: 'Generate lesson notes for a topic.',
    formFields: [{ label: 'Topic', stateKey: 'topic', type: 'text' }],
    promptTemplate: (data) => `Generate lesson notes for the topic: ${data.topic}.`,
  },
  {
    id: 'study-guide',
    name: 'Study Guide',
    description: 'Create a study guide for a specific subject.',
    formFields: [
      { label: 'Subject', stateKey: 'subject', type: 'text' },
      { label: 'Key Concepts', stateKey: 'keyConcepts', type: 'text' },
    ],
    promptTemplate: (data) =>
      `Create a study guide for ${data.subject} covering these key concepts: ${data.keyConcepts}.`,
  },
];

const QuickActionsTab: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<QuickAction | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [chatPrompt, setChatPrompt] = useState<string>('');

  const handleActionClick = (action: QuickAction) => {
    setSelectedAction(action);
    setFormData({}); // Reset form data
    setIsModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAction) {
      const prompt = selectedAction.promptTemplate(formData);
      setChatPrompt(prompt);
      setIsModalOpen(false);
      // Simulate opening chatbot with pre-filled prompt
      alert(`Simulating chatbot with prompt:\n${prompt}`);
      console.log('Chatbot Prompt:', prompt);
      // In a real application, you would dispatch an action here to open the chat and fill the prompt
    }
  };

  return (
    <div className="quick-actions-tab">
      <h2>Quick Actions</h2>
      <div className="quick-actions-list">
        {quickActions.map((action) => (
          <div key={action.id} className="quick-action-card" onClick={() => handleActionClick(action)}>
            <h3>{action.name}</h3>
            <p>{action.description}</p>
          </div>
        ))}
      </div>

      {isModalOpen && selectedAction && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{selectedAction.name} Details</h3>
            <form onSubmit={handleSubmit}>
              {selectedAction.formFields.map((field) => (
                <div className="form-field" key={field.stateKey}>
                  <label>{field.label}:</label>
                  <input
                    type={field.type}
                    name={field.stateKey}
                    value={formData[field.stateKey] || ''}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              ))}
              <div className="modal-actions">
                <button type="submit">Submit</button>
                <button type="button" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickActionsTab;
