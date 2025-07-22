import { useState, useEffect, useCallback } from "react";
import { Button, Form } from "react-bootstrap";
import uniqid from "uniqid";
import {
  Paragraph,
  ShortResponse,
  TrueFalse,
  NewSection,
  SurveyTitle,
  MultipleChoice, // Updated import
} from "./createQuestionComponents";

import { useParams, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../../hooks/useAuthContext";

const CreateSurvey = (props) => {
  const [survey, setSurvey] = useState({
    title: "",
    description: "",
    questions: [],
    user_id: "",
  });
  const [showAddQuestionButton, setShowAddQuestionButton] = useState(true);
  const [editingPreviousSurvey, setEditingPreviousSurvey] = useState(false);
  const [questions, setQuestions] = useState([]);
  const { id } = useParams();

  const Navigate = useNavigate();
  const { user } = useAuthContext();

  // Get Survey
  const callApiToGetSurvey = useCallback(async (url, fetchOptions) => {
    if (!user || !user.token) {
      console.log("User not authenticated.");
      return;
    }
    console.log(user.token);
    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        ...fetchOptions,
      });
      const responseData = await response.json();
      setSurvey(responseData);
      setQuestions(responseData.questions);
    } catch (error) {
      console.log("An error occurred while fetching the survey:", error);
    }
  });

  const startSurvey = () => {
    if (id) {
      callApiToGetSurvey(`/api/surveys/${id}`, { method: "GET" });
      setEditingPreviousSurvey(true);
    } else {
      setSurvey({ ...survey, _id: uniqid("survey-"), user_id: user.token });
    }
  };

  useEffect(() => {
    if (user) {
      let updatedSurvey = { ...survey, user_id: user.token };
      setSurvey(updatedSurvey);
    }
  }, [user]);

  useEffect(() => {
    startSurvey();
  }, [user]);

  // Update data based on the user input
  const handleSurveyChange = (e) => {
    setSurvey((prevSurvey) => ({
      ...prevSurvey,
      [e.target.name]: e.target.value,
    }));
  };

  const handleQuestionChange = (e, questionIndex) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[questionIndex] = {
        ...updatedQuestions[questionIndex],
        question: e.target.value,
      };
      return updatedQuestions;
    });
  };

  // Handle multiple choice options change
  const handleMCQOptionsChange = (questionIndex, options) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[questionIndex] = {
        ...updatedQuestions[questionIndex],
        answer_choices: options,
      };
      return updatedQuestions;
    });
  };

  // Add question to survey
  const addQuestion = (e) => {
    setShowAddQuestionButton(true);
    const questionType = e.target.value;

    setQuestions((prevQuestions) => {
      let updatedQuestions = [...prevQuestions];

      if (questionType === "1") {
        updatedQuestions.push({
          type: "short response",
          question: "",
          answer_choices: [],
          _id: uniqid("question-"),
          responses: [],
        });
      } else if (questionType === "2") {
        updatedQuestions.push({
          type: "true/false",
          question: "",
          answer_choices: ["True", "False"],
          _id: uniqid("question-"),
          responses: [],
        });
      } else if (questionType === "3") {
        updatedQuestions.push({
          type: "paragraph",
          question: "",
          answer_choices: [],
          _id: uniqid("question-"),
          responses: [],
        });
      } else if (questionType === "4") {
        updatedQuestions.push({
          type: "new section",
          question: "",
        });
      } else if (questionType === "5") {
        // Updated to multiple choice
        updatedQuestions.push({
          type: "multiple choice",
          question: "",
          answer_choices: ["Option 1", "Option 2"],
          _id: uniqid("question-"),
          responses: [],
        });
      }
      return updatedQuestions;
    });
  };

  // Remove question from survey
  const removeQuestion = (questionIndex) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions.splice(questionIndex, 1);
      return updatedQuestions;
    });
  };

  const onSubmitSurvey = async (e) => {
    e.preventDefault();

    try {
      if (!user) {
        return;
      }
      const response = await fetch("/api/surveys/create-update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          questions: questions,
          title: survey.title,
          description: survey.description,
          user_id: survey.user_id,
          creationTime: new Date(),
          survey_id: survey._id,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        props.sendSurveyId(responseData._id);
        Navigate(`/dashboard`);
        window.open(`/display-survey/${responseData._id}`, "_blank");
      } else {
        console.log("Survey submission failed. Please try again.");
      }
    } catch (error) {
      console.log("An error occurred while submitting the survey:", error);
    }
  };

  const makeSurvey = () => {
    // Question index couting (Start from -1 because when I start from 0 the first question is question number 2)
    let questionIndex = -1;

    const form = questions.map((question, index) => {
      // check if question is a new section skip question index
      if (question.type === "new section") {
        // For section type, render the text without counting
        return (
          <NewSection
            id={question._id}
            key={question._id}
            question={question}
            onChange={(e) => handleQuestionChange(e, index)}
            removeQuestion={() => removeQuestion(index)}
          />
        );
      }
      // For other question types, increment question index and render the corresponding question component
      questionIndex++;

      switch (question.type) {
        case "short response":
          return (
            <ShortResponse
              key={question._id}
              question={question}
              onChange={(e) => handleQuestionChange(e, index)}
              id={question._id}
              removeQuestion={() => removeQuestion(index)}
              index={questionIndex}
            />
          );
        case "paragraph":
          return (
            <Paragraph
              key={question._id}
              question={question}
              onChange={(e) => handleQuestionChange(e, index)}
              id={question._id}
              removeQuestion={() => removeQuestion(index)}
              index={questionIndex}
            />
          );
        case "true/false":
          return (
            <TrueFalse
              key={question._id}
              question={question}
              id={question._id}
              onChange={(e) => handleQuestionChange(e, index)}
              removeQuestion={() => removeQuestion(index)}
              index={questionIndex}
            />
          );
        case "multiple choice":
          return (
            <MultipleChoice
              key={question._id}
              question={question}
              id={question._id}
              onChange={(e) => handleQuestionChange(e, index)}
              onOptionsChange={(options) => handleMCQOptionsChange(index, options)}
              removeQuestion={() => removeQuestion(index)}
              index={questionIndex}
            />
          );
        default:
          return null;
      }
    });

    const chooseQuestionTypeForm = (
      <div className="question-selector-container">
        <div className="question-selector-card">
          <div className="question-selector-header">
            <div className="selector-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Choose Question Type</h3>
            <p>Select the type of question you want to add to your survey</p>
          </div>
          
          <Form.Select
            size="lg"
            aria-label="Select Question Type"
            onChange={addQuestion}
            className="custom-select"
          >
            <option value="">Select a question type...</option>
            <option value="1">📝 Short Response</option>
            <option value="2">✅ True/False</option>
            <option value="3">📄 Paragraph Response</option>
            <option value="4">🏷️ New Section Header</option>
            <option value="5">🔘 Multiple Choice</option>
          </Form.Select>
        </div>
      </div>
    );

    return { form, chooseQuestionTypeForm };
  };

  const { form, chooseQuestionTypeForm } = makeSurvey();

  return (
    <div className="survey-builder-container">
      <style jsx>{`
        .survey-builder-container {
          max-width: 70%;
          margin: 0 auto;
          min-height: 100vh;
        }

        .question-selector-container {
          margin: 40px 0;
          display: flex;
          justify-content: center;
        }

        .question-selector-card {
          background: white;
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          max-width: 500px;
          width: 100%;
          position: relative;
          overflow: hidden;
        }

        .question-selector-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 5px;
          background: linear-gradient(90deg, #667eea, #764ba2, #f093fb, #f5576c);
        }

        .question-selector-header {
          text-align: center;
          margin-bottom: 25px;
        }

        .selector-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #0c66a9 0%, #008cba 100%);
          border-radius: 50%;
          margin: 0 auto 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .selector-icon svg {
          width: 30px;
          height: 30px;
        }

        .question-selector-header h3 {
          color: #2d3748;
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0 0 8px 0;
        }

        .question-selector-header p {
          color: #718096;
          font-size: 0.95rem;
          margin: 0;
        }

        .custom-select {
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          padding: 12px 16px;
          font-size: 1rem;
          font-weight: 500;
          color: #2d3748;
          background-color: #f7fafc;
          transition: all 0.3s ease;
        }

        .custom-select:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
          background-color: white;
        }

        .custom-select option {
          padding: 10px;
          font-weight: 500;
        }

        .action-buttons {
          display: flex;
          gap: 15px;
          justify-content: center;
          margin: 40px 0;
          flex-wrap: wrap;
        }

        .btn-modern {
          background: linear-gradient(135deg, #0c66a9 0%, #008cba 100%);
          border: none;
          border-radius: 50px;
          padding: 12px 30px;
          font-weight: 600;
          font-size: 0.95rem;
          color: white;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
          position: relative;
          overflow: hidden;
        }

        .btn-modern:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }

        .btn-modern:active {
          transform: translateY(0);
        }

        .btn-success-modern {
          background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
          box-shadow: 0 4px 15px rgba(72, 187, 120, 0.3);
        }

        .btn-success-modern:hover {
          box-shadow: 0 6px 20px rgba(72, 187, 120, 0.4);
        }

        .btn-single {
          display: flex;
          justify-content: center;
          margin: 40px 0;
        }

        .survey-divider {
          height: 4px;
          background: linear-gradient(135deg, #0c66a9 0%, #008cba 100%);
          border: none;
          margin: 30px auto;
          width: 60%;
          border-radius: 2px;
        }

        @media (max-width: 768px) {
          .survey-builder-container {
            padding: 15px;
          }
          
          .question-selector-card {
            padding: 20px;
            margin: 0 10px;
          }
          
          .action-buttons {
            flex-direction: column;
            align-items: center;
          }
          
          .btn-modern {
            width: 100%;
            max-width: 250px;
          }
        }
      `}</style>

      <SurveyTitle
        onChange={(e) => handleSurveyChange(e)}
        survey={survey}
        title={survey.title}
        description={survey.description}
      />
      
      <hr className="survey-divider" />
      
      {form}
      
      {showAddQuestionButton === true ? (
        questions.length >= 1 ? (
          <div className="action-buttons">
            <Button
              className="btn-modern btn-success-modern"
              onClick={() => setShowAddQuestionButton(false)}
            >
              &#65291; Add Question
            </Button>

            <Button
              className="btn-modern"
              onClick={onSubmitSurvey}
            >
              💾 Save and Finish Survey
            </Button>
          </div>
        ) : (
          <div className="btn-single">
            <Button
              className="btn-modern"
              onClick={() => setShowAddQuestionButton(false)}
            >
              &#65291; Add First Question
            </Button>
          </div>
        )
      ) : (
        chooseQuestionTypeForm
      )}
    </div>
  );
};

export default CreateSurvey;