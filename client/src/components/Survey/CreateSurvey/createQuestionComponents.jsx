import { Form, Button, Card } from "react-bootstrap";
import { useState } from "react";
import './survey.css';

// ----------------------------Short Response----------------------------
export function ShortResponse({ question, index, onChange, removeQuestion }) {
  return (
    <div className="mcq-container">
      <Card className="mcq-card">
        <div className="mcq-header">
          <div className="question-number">Q{index + 1}</div>
          <div className="question-type-badge">📝 Short Response</div>
          <Form.Control
            className="question-input"
            type="text"
            placeholder="Add Your Question"
            id={question._id}
            answer="no"
            onChange={onChange}
            name="short response"
            value={question.question}
          />
          <div className="mq-footer">
            <Button className="remove-question-btn" onClick={(e) => removeQuestion(e, question.id)}>
              🗑️ Remove Question
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ----------------------------True/False----------------------------
export function TrueFalse({ question, index, onChange, removeQuestion }) {
  return (
    <div className="mcq-container">
      <Card className="mcq-card">
        <div className="mcq-header">
          <div className="question-number">Q{index + 1}</div>
          <div className="question-type-badge">✅ True/False</div>
          <Form.Control
            className="question-input"
            type="text"
            placeholder="Add Your Question"
            id={question._id}
            answer="no"
            onChange={onChange}
            name="true/false"
            value={question.question}
          />
        </div>
        <div className="true-false-body">
          {question.answer_choices.map((ans, idx) => (
            <Form.Control
              key={idx}
              value={ans}
              disabled
              className="option-input"
              placeholder="True / False"
            />
          ))}
        </div>
        <div className="mcq-footer">
          <Button className="remove-question-btn" onClick={(e) => removeQuestion(e, question.id)}>
            🗑️ Remove Question
          </Button>
        </div>
      </Card>
    </div>
  );
}

// ----------------------------Paragraph----------------------------
export function Paragraph({ question, index, onChange, removeQuestion }) {
  return (
    <div className="mcq-container">
      <Card className="mcq-card">
        <div className="mcq-header">
          <div className="question-number">Q{index + 1}</div>
          <div className="question-type-badge">📄 Paragraph</div>
          <Form.Control
            className="question-input"
            type="text"
            placeholder="Add Your Question"
            id={question._id}
            answer="no"
            onChange={onChange}
            name="paragraph"
            value={question.question}
          />
          <div className="mq-footer">
            <Button className="remove-question-btn" onClick={(e) => removeQuestion(e, question.id)}>
              🗑️ Remove Question
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ----------------------------New Section----------------------------
export function NewSection({ question, onChange, removeQuestion }) {
  return (
    <div className="mcq-container">
      <Card className="mcq-card">
        <div className="mcq-header">
          <div className="question-type-badge">📂 New Section</div>
          <Form.Control
            className="question-input"
            type="text"
            placeholder="Section Title"
            id={question._id}
            answer="no"
            onChange={onChange}
            name="section"
            value={question.question}
          />
          <div className="mq-footer">
            <Button className="remove-question-btn" onClick={(e) => removeQuestion(e, question.id)}>
              🗑️ Remove Question
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ----------------------------Survey Title----------------------------
export function SurveyTitle({ title, description, onChange }) {
  return (
    <div className="mcq-container">
      <Card className="mcq-card">
        <div className="mcq-header">
          <div className="survey-badge">📋 Survey Info</div>
          <Form.Control
            className="question-input"
            type="text"
            placeholder="Survey Title"
            name="title"
            value={title}
            onChange={onChange}
          />
          <br />
          <Form.Control
            className="question-input"
            type="text"
            placeholder="Survey Description"
            name="description"
            value={description}
            onChange={onChange}
          />
        </div>
      </Card>
    </div>
  );
}

// ----------------------------Multiple Choice----------------------------
export const MultipleChoice = ({ question, onChange, onOptionsChange, removeQuestion, index, id }) => {
  const [options, setOptions] = useState(question.answer_choices || ['Option 1', 'Option 2']);

  const handleOptionChange = (optionIndex, value) => {
    const newOptions = [...options];
    newOptions[optionIndex] = value;
    setOptions(newOptions);
    onOptionsChange(newOptions);
  };

  const addOption = () => {
    const newOptions = [...options, `Option ${options.length + 1}`];
    setOptions(newOptions);
    onOptionsChange(newOptions);
  };

  const removeOption = (optionIndex) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, index) => index !== optionIndex);
      setOptions(newOptions);
      onOptionsChange(newOptions);
    }
  };

  return (
    <>
      <div className="mcq-container">
        <Card className="mcq-card">
          <div className="mcq-header">
            <div className="question-number">Q{index + 1}</div>
            <div className="question-type-badge">🔘 Multiple Choice</div>
            <Form.Control
              className="question-input"
              type="text"
              placeholder="Enter your multiple choice question here..."
              value={question.question}
              onChange={onChange}
              name="question"
            />
          </div>

          <div className="mcq-body">
            {options.map((option, optionIndex) => (
              <div key={optionIndex} className="option-item">
                <div className="option-radio"></div>
                <Form.Control
                  className="option-input"
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(optionIndex, e.target.value)}
                  placeholder="Enter option text"
                />
                {options.length > 2 && (
                  <Button
                    className="remove-option-btn"
                    onClick={() => removeOption(optionIndex)}
                    size="sm"
                  >
                    ✕
                  </Button>
                )}
              </div>
            ))}
          <div className="mq-footer">
            <Button className="add-option-btn" onClick={addOption}>
              ➕ Add Option
            </Button>
            <Button className="remove-question-btn" onClick={removeQuestion}>
              🗑️ Remove Question
            </Button>
          </div>
          </div>
        </Card>
      </div>
    </>
  );
};

// ----------------------------Conditional Question----------------------------
export function ConditionalQuestion(props) {
  return (
    <div className="mcq-container">
      <Card className="mcq-card">
        <div className="mcq-header">
          <div className="question-number">Q{props.index + 1}</div>
          <div className="question-type-badge">🔄 Conditional</div>
          <Form.Control
            className="question-input"
            type="text"
            placeholder="Add Conditional Question"
            id={props.question._id}
            answer="no"
            onChange={(e) => props.onChange(e)}
            name="conditional"
            value={props.question.question}
          />  
        </div>

        <div className="mcq-footer">
          <Button
            className="remove-question-btn"
            onClick={(e) => props.removeQuestion(e, props.question.id)}
            size="sm"
          >
            🗑️ Remove Question
          </Button>
        </div>
      </Card>
    </div>
  );
}
