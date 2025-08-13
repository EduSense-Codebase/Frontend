import React from 'react';
import { useState } from 'react';
import './AssignmentBuilder.scss';
import Button from '../Button';
import MultipleChoiceQ from '../MultipleChoiceQ';
import LongAnswerQ from '../LongAnswerQ';
import ShortAnswerQ from '../ShortAnswerQ';

type QuestionType = 'long' | 'multiple' | 'short';
type QuestionMode = 'view' | 'edit' | 'answerKey';

interface Option {
  id: string;
  text: string;
  isCorrect?: boolean;
}

interface CorrectAnswer {
  id: string;
  text: string;
}

interface BaseQuestion {
  id: string;
  type: QuestionType;
  question: string;
  description?: string;
  isRequired: boolean;
  mode: QuestionMode;
}

interface LongAnswerQuestion extends BaseQuestion {
  type: 'long';
}

interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple';
  options: Option[];
  selectedOptionId?: string;
}

interface ShortAnswerQuestion extends BaseQuestion {
  type: 'short';
  answer: string;
  correctAnswers: CorrectAnswer[];
}

interface AssignmentBuilderProps {
  quizQuestions: Question[];
  title: string;
  description: string;
}

export type Question = LongAnswerQuestion | MultipleChoiceQuestion | ShortAnswerQuestion;

const AssignmentBuilder: React.FC<AssignmentBuilderProps> = ({ 
  quizQuestions, 
  title, 
  description 
}) => {
  const [questions, setQuestions] = useState<Question[]>(quizQuestions);
  const [showAddOptions, setShowAddOptions] = useState(false);
  const [quizMode, setQuizMode] = useState("view");
  const [quizTitle, setQuizTitle] = useState(title);
  const [quizDescription, setQuizDescription] = useState(description);

  const ToggleAddOptions = () => {
    setShowAddOptions(!showAddOptions);
  }

  const ToggleQuizMode = () => {
    if (quizMode == "edit") {setQuizMode("view")}
    else {setQuizMode("edit")}
  }

  const handleAddQuestion = (type: QuestionType) => {
    const base: BaseQuestion = {
      id: Date.now().toString(),
      type,
      question: '',
      isRequired: false,
      mode: 'edit',
    };

    let newQ: Question;
    if (type === 'multiple') {
      newQ = { ...base, type: 'multiple', options: [] };
    } else if (type === 'short') {
      newQ = { ...base, type: 'short', answer: '', correctAnswers: [] };
    } else {
      newQ = { ...base, type: 'long' };
    }

    setQuestions(prev => [...prev, newQ]);
  };

  const handleUpdateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(prev =>
      prev.map(q => (q.id === id ? { ...q, ...updates } as Question : q))
    );
  };

  const handleChangeQuestionMode = (id: string, mode: QuestionMode) => {
    setQuestions(prev =>
      prev.map(q => (q.id === id ? { ...q, mode } : q))
    );
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  return (
    <div className="quiz-builder">
      {quizMode === "edit" ? (
        <input
          type="text"
          value={quizTitle}
          onChange={(e) => setQuizTitle(e.target.value)}
          placeholder="Enter quiz title"
          className="quiz-title-input"
        />
      ) : (
        <h1>{quizTitle}</h1>
      )}
      {quizMode === "edit" ? (
        <textarea
          value={quizDescription}
          onChange={(e) => setQuizDescription(e.target.value)}
          placeholder="Enter quiz description"
          className="quiz-description-input"
        />
      ) : (
        <div className="quiz-description">{quizDescription}</div>
      )}

      {questions.map((q) => {
        switch (q.type) {
          case "long":
            return (
              <div className="question">
                {((q.mode == "view") && (quizMode == "edit")) && (
                  <div className='edit-mode-btns'>
                    <Button onClick={() => handleChangeQuestionMode(q.id, "edit")} variant="icon" icon="/edit.svg"></Button>
                    <Button onClick={() => handleDeleteQuestion(q.id)} variant="icon-secondary" icon="/delete.svg"></Button>
                  </div>
                )}
                <LongAnswerQ
                  key={q.id}
                  mode={q.mode}
                  question={q.question}
                  description={q.description}
                  isRequired={q.isRequired}
                  onChangeQuestion={(val) =>
                    handleUpdateQuestion(q.id, { question: val })
                  }
                  onChangeDescription={(val) =>
                    handleUpdateQuestion(q.id, { description: val })
                  }
                  onToggleRequired={() =>
                    handleUpdateQuestion(q.id, { isRequired: !q.isRequired })
                  }
                  onSave={() => handleChangeQuestionMode(q.id, "view")}
                />
              </div>
            );

          case "multiple":
            return (
              <div className="question">
                {(q.mode == "view" && quizMode == "edit") && (
                  <div className='edit-mode-btns'>
                    <Button onClick={() => handleChangeQuestionMode(q.id, "edit")} variant="icon" icon="/edit.svg"></Button>
                    <Button onClick={() => handleDeleteQuestion(q.id)} variant="icon-secondary" icon="/delete.svg"></Button>
                  </div>
                )}
                <MultipleChoiceQ
                  key={q.id}
                  mode={q.mode}
                  question={q.question}
                  options={q.options}
                  selectedOptionId={q.selectedOptionId}
                  onSelectOption={(id) =>
                    handleUpdateQuestion(q.id, { selectedOptionId: id })
                  }
                  onChangeQuestion={(val) =>
                    handleUpdateQuestion(q.id, { question: val })
                  }
                  onChangeOptionText={(optionId, text) =>
                    handleUpdateQuestion(q.id, {
                      options: q.options.map((opt) =>
                        opt.id === optionId ? { ...opt, text } : opt
                      ),
                    })
                  }
                  onAddOption={() =>
                    handleUpdateQuestion(q.id, {
                      options: [...q.options, { id: Date.now().toString(), text: "" }],
                    })
                  }
                  onRemoveOption={(optionId) =>
                    handleUpdateQuestion(q.id, {
                      options: q.options.filter((opt) => opt.id !== optionId),
                    })
                  }
                  onToggleCorrect={(optionId) =>
                    handleUpdateQuestion(q.id, {
                      options: q.options.map((opt) =>
                        opt.id === optionId
                          ? { ...opt, isCorrect: !opt.isCorrect }
                          : opt
                      ),
                    })
                  }
                  isRequired={q.isRequired}
                  onToggleRequired={() =>
                    handleUpdateQuestion(q.id, { isRequired: !q.isRequired })
                  }
                  onAnswerKey={() => handleChangeQuestionMode(q.id, "answerKey")}
                  onCancel={() => handleChangeQuestionMode(q.id, "view")}
                  onSave={() => handleChangeQuestionMode(q.id, "view")}
                />
              </div>
            );

          case "short":
            return (
              <div className="question">
                {((q.mode == "view") && (quizMode == "edit")) && (
                  <div className='edit-mode-btns'>
                    <Button onClick={() => handleChangeQuestionMode(q.id, "edit")} variant="icon" icon="/edit.svg"></Button>
                    <Button onClick={() => handleDeleteQuestion(q.id)} variant="icon-secondary" icon="/delete.svg"></Button>
                  </div>
                )}
                <ShortAnswerQ
                  key={q.id}
                  mode={q.mode}
                  question={q.question}
                  answer={q.answer}
                  correctAnswers={q.correctAnswers}
                  onChangeAnswer={(val) =>
                    handleUpdateQuestion(q.id, { answer: val })
                  }
                  onChangeCorrectAnswerText={(answerId, val) =>
                    handleUpdateQuestion(q.id, {
                      correctAnswers: q.correctAnswers.map((ans) =>
                        ans.id === answerId ? { ...ans, text: val } : ans
                      ),
                    })
                  }
                  onAddCorrectAnswer={() =>
                    handleUpdateQuestion(q.id, {
                      correctAnswers: [
                        ...q.correctAnswers,
                        { id: Date.now().toString(), text: "" },
                      ],
                    })
                  }
                  onRemoveCorrectAnswer={(answerId) =>
                    handleUpdateQuestion(q.id, {
                      correctAnswers: q.correctAnswers.filter(
                        (ans) => ans.id !== answerId
                      ),
                    })
                  }
                  onChangeQuestion={(val) =>
                    handleUpdateQuestion(q.id, { question: val })
                  }
                  isRequired={q.isRequired}
                  onToggleRequired={() =>
                    handleUpdateQuestion(q.id, { isRequired: !q.isRequired })
                  }
                  onAnswerKey={() => handleChangeQuestionMode(q.id, "answerKey")}
                  onSave={() => handleChangeQuestionMode(q.id, "view")}
                />
              </div>
            );
          default:
            return null;
        }
      })}

      { quizMode=="edit" && (<div style={{ marginTop: "20px" }}>
        <button onClick={ToggleAddOptions} className="add-question-btn"> Add Question </button>
      </div>)}
      {showAddOptions && quizMode=="edit" && (
        <div className="add-question-options">
          <Button onClick={() => handleAddQuestion("multiple")} displayName='Multiple Choice' variant='primary'></Button>
          <Button onClick={() => handleAddQuestion("long")} displayName='Long Answer' variant='primary'></Button>
          <Button onClick={() => handleAddQuestion("short")} displayName='Short Answer' variant='primary'></Button>
        </div>
      )}
      <div className="edit-quiz-btn">
        <Button displayName='Edit Quiz' icon="/edit.svg" variant="primary" onClick={ToggleQuizMode}></Button>
      </div>
    </div>
  );
};

export default AssignmentBuilder;