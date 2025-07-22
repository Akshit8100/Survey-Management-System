import { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import uniqid from "uniqid";

// -------------------------Short Response Component--------------------------
export function ShortResponse(props) {
  // form validation
  const [isValid, setIsValid] = useState(false); // Track validity of the input
  const [isTouched, setIsTouched] = useState(false); // Track if the input field has been touched

  const handleBlur = () => {
    setIsTouched(true);
    setIsValid(props.question.response.response.trim() !== "");
  };

  const handleChange = (e) => {
    props.onChange(e, props.responseId);
  };

  useEffect(() => {
    setIsValid(props.question.response.response.trim() !== "");
  }, [props.question.response.response]);

  // get user location
  const [currLocation, setCurrLocation] = useState("click the button to get location");

  // Get location without button
  const getLocation = () => {
    setIsValid(true);
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setCurrLocation({ latitude, longitude });
      console.log(currLocation);

      if (props.question.question.includes("location")) {
        props.onChange(
          { target: { value: `${latitude}, ${longitude}` } },
          props.responseId,
          "short response"
        );
      }
    });
  };

  useEffect(() => {
    // Derive the values of the required variables
    const getLocationButton = props.question.question.includes("location");

    // Update the state variables
    if (getLocationButton && currLocation === "Click the location button") {
      getLocation();
    }
  }, []);

  return (
    <div style={{
            marginTop: 30,
            backgroundColor: "#edf4f5",
            borderRadius: 15,
            border: "3px dashed rgba(122, 192, 215, .6)",
            color: "#0c66a9",
            fontSize: 1.4 + "rem",
            position: "relative",
          }}>
      <div
        style={{
          background: "linear-gradient(135deg, #0c66a9, #42a4c4)",
          color: "white",
          padding: "20px 25px",
          position: "relative",
          borderRadius: "15px 15px 0 0",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "5px",
          }}
        >
          <div
            style={{
              background: "rgba(255, 255, 255, 0.2)",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "700",
              fontSize: "0.9rem",
              marginRight: "10px",
            }}
          >
            Q{props.index + 1}
          </div>
          {props.question.question || "Question text here..."}
        </div>
      </div>
    
      <Form noValidate validated={isValid} onSubmit={props.submitSurvey}>
        <Form.Group
          className="mb-3"
          style={{
            margin: 30,
            backgroundColor: "#edf4f5",
          }}
        >
          <Form.Control
            id={props.question._id}
            onClick={(e) => e.target.select()}
            onChange={handleChange}
            onBlur={handleBlur}
            name="short response"
            value={props.question.response.response}
            type="text"
            placeholder="Your answer"
            className={isTouched && !isValid ? "is-invalid" : ""}
            style={{
              borderRadius: 7,
              padding: "15px 15px",
              color: "#42a4c4",
              fontSize: 1.1 + "rem",
            }}
            disabled={props.question.question.includes("location")}
          />
          {isTouched && isValid && (
            <Form.Control.Feedback type="valid">Look Good</Form.Control.Feedback>
          )}
        </Form.Group>
      </Form>
    </div>
  );
}

// -------------------------Multiple Choice Component--------------------------
export function MultipleChoice(props) {
  console.log(props);
  const [selectedOption, setSelectedOption] = useState(null);
  const options = props.question.answer_choices || ['Option 1', 'Option 2'];

  const handleOptionSelect = (optionIndex) => {
    setSelectedOption(optionIndex);
    if (props.onOptionChange) {
      props.onOptionChange(options[optionIndex], props.question._id);
    }
  };

  return (
    <div
      style={{
        marginTop: 30,
        backgroundColor: "#edf4f5",
        borderRadius: 15,
        border: "3px dashed rgba(122, 192, 215, .6)",
        color: "#0c66a9",
        fontSize: "1.4rem",
        overflow: "hidden",
        boxShadow: "0 8px 25px rgba(12, 102, 169, 0.1)",
        position: "relative",
      }}
    >
      {/* Header Section */}
      <div
        style={{
          background: "linear-gradient(135deg, #0c66a9, #42a4c4)",
          color: "white",
          padding: "20px 25px",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "5px",
          }}
        >
          <div
            style={{
              background: "rgba(255, 255, 255, 0.2)",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "700",
              fontSize: "0.9rem",
              marginRight: "10px",
            }}
          >
            Q{props.index + 1}
          </div>
          {props.question.question || "Question text here..."}
        </div>
      </div>

      {/* Options Section */}
      <div style={{ padding: "25px" }}>
        {options.map((option, optionIndex) => (
          <div
            key={optionIndex}
            style={{
              background: selectedOption === optionIndex ? "#e6f3ff" : "#f8fafc",
              border: `2px solid ${selectedOption === optionIndex ? "#42a4c4" : "#e2e8f0"}`,
              borderRadius: "12px",
              marginBottom: "15px",
              padding: "15px 20px",
              display: "flex",
              alignItems: "center",
              gap: "15px",
              transition: "all 0.3s ease",
              position: "relative",
              cursor: "pointer",
            }}
            onClick={() => handleOptionSelect(optionIndex)}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#42a4c4";
              e.currentTarget.style.backgroundColor = "#f0f8ff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = selectedOption === optionIndex ? "#42a4c4" : "#e2e8f0";
              e.currentTarget.style.backgroundColor = selectedOption === optionIndex ? "#e6f3ff" : "#f8fafc";
            }}
          >
            {/* Radio Button Visual */}
            <div
              style={{
                width: "20px",
                height: "20px",
                border: `2px solid ${selectedOption === optionIndex ? "#42a4c4" : "#cbd5e0"}`,
                borderRadius: "50%",
                background: "white",
                position: "relative",
                flexShrink: 0,
              }}
            >
              {selectedOption === optionIndex && (
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "8px",
                    height: "8px",
                    background: "#42a4c4",
                    borderRadius: "50%",
                  }}
                />
              )}
            </div>

            {/* Option Content */}
            <div
              style={{
                fontSize: "1rem",
                color: "#2d3748",
                flex: 1,
                padding: "5px 0",
                fontWeight: selectedOption === optionIndex ? "600" : "500",
              }}
            >
              {option}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// -------------------------ConditionQuestion Component--------------------------
export function ConditionalQuestion(props) {
  const [selectedOption, setSelectedOption] = useState("");
  const [inputValue, setInputValue] = useState(""); // Store the input field value

  const handleRadioChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  if (selectedOption === "True") {
    return (
      <>
        <Form.Check
          inline
          type="radio"
          label="True"
          value="True"
          checked={selectedOption === "True"}
          onChange={handleRadioChange}
        />
        <Form.Check
          inline
          type="radio"
          label="False"
          value="False"
          checked={selectedOption === "False"}
          onChange={handleRadioChange}
        />
        {props.question && (
          <div>
            <h4>{props.question.question}</h4>
            <Form.Control
              id={props.question._id}
              onChange={handleInputChange} // Use the separate handleInputChange
              value={inputValue} // Use the inputValue state to control the input value
              type="text"
              placeholder="Your answer"
            />
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <Form.Check
        inline
        type="radio"
        label="True"
        value="True"
        checked={selectedOption === "True"}
        onChange={handleRadioChange}
      />
      <Form.Check
        inline
        type="radio"
        label="False"
        value="False"
        checked={selectedOption === "False"}
        onChange={handleRadioChange}
      />
    </>
  );
}

// -------------------------True False Component--------------------------
export function TrueFalse(props) {
  const [isChecked, setIsChecked] = useState(() =>
    props.question.answer_choices
      ? props.question.answer_choices.map((answer) => ({
          answer_choice: answer,
          value: false,
        }))
      : []
  );

  const onChangeChecked = (e, index) => {
    let updatedIsChecked = [...isChecked];

    for (let i = 0; i < updatedIsChecked.length; i++) {
      if (i === index) {
        updatedIsChecked[i].value = true;
      } else {
        updatedIsChecked[i].value = false;
      }
    }
    setIsChecked(updatedIsChecked);
  };

  const answerChoices = props.question.answer_choices
    ? props.question.answer_choices.map((answer, index) => (
        <Form.Group
          style={{
            display: "flex",
            alignItems: "center",
            padding: 5,
            backgroundColor: isChecked[index]?.value
              ? "#D6E6F2"
              : "transparent",
          }}
        >
          <Form.Check
            key={uniqid()}
            id={`radio-${index}`}
            value={answer}
            name={props.question._id}
            type="radio"
            checked={isChecked[index]?.value}
            onChange={(e) => {
              onChangeChecked(e, index);
              props.onChange(e, props.responseId, "true/false");
            }}
          />
          <Form.Label
            htmlFor={`radio-${index}`}
            style={{
              cursor: "pointer",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            {answer}
          </Form.Label>
        </Form.Group>
      ))
    : null;

  return (
    <div 
      style={{
        marginTop: 30,
        backgroundColor: "#edf4f5",
        borderRadius: 15,
        border: "3px dashed rgba(122, 192, 215, .6)",
        color: "#0c66a9",
        fontSize: 1.4 + "rem",
        position: "relative",
      }}>
      <div
        style={{
          background: "linear-gradient(135deg, #0c66a9, #42a4c4)",
          color: "white",
          padding: "20px 25px",
          position: "relative",
          borderRadius: "15px 15px 0 0",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "5px",
          }}
        >
          <div
            style={{
              background: "rgba(255, 255, 255, 0.2)",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "700",
              fontSize: "0.9rem",
              marginRight: "10px",
            }}
          >
            Q{props.index + 1}
          </div>
          {props.question.question || "Question text here..."}
        </div>
      </div>
      <Form.Group
        style={{
          backgroundColor: "#edf4f5",
          paddingLeft: 20,
          borderRadius: 15,
        }}
      >
        {answerChoices}
      </Form.Group>
    </div>
  );
}

// -------------------------Paragraph Component--------------------------
export function Paragraph(props) {
  const [isTouched, setIsTouched] = useState(false); // Track if the input field has been touched
  const [isValid, setIsValid] = useState(true); // Track validity of the input

  const handleBlur = () => {
    setIsTouched(true);
    setIsValid(props.question.response.response.trim() !== "");
  };

  const handleChange = (e) => {
    props.onChange(e, props.responseId);
  };

  useEffect(() => {
    setIsValid(props.question.response.response.trim() !== "");
  }, [props.question.response.response]);

  return (
    <div style={{
            marginTop: 30,
            backgroundColor: "#edf4f5",
            borderRadius: 15,
            border: "3px dashed rgba(122, 192, 215, .6)",
            color: "#0c66a9",
            fontSize: 1.4 + "rem",
            position: "relative",
          }}>
      <div
        style={{
          background: "linear-gradient(135deg, #0c66a9, #42a4c4)",
          color: "white",
          padding: "20px 25px",
          position: "relative",
          borderRadius: "15px 15px 0 0",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "5px",
          }}
        >
          <div
            style={{
              background: "rgba(255, 255, 255, 0.2)",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "700",
              fontSize: "0.9rem",
              marginRight: "10px",
            }}
          >
            Q{props.index + 1}
          </div>
          {props.question.question || "Question text here..."}
        </div>
      </div>
    
      <Form noValidate validated={isValid} onSubmit={props.submitSurvey}>
        <Form.Group
          className="mb-3"
          style={{
            margin: 30,
            backgroundColor: "#edf4f5",

          }}
        >
          <Form.Control
            id={props.question._id}
            onChange={handleChange}
            onBlur={handleBlur}
            name="paragraph"
            value={props.question.response.response}
            type="text"
            as="textarea"
            rows={3}
            className={isTouched && !isValid ? "is-invalid" : ""}
            placeholder="Your answer"
            style={{
              borderRadius: 7,
              color: "#42a4c4",
              fontSize: "1.1rem",
              padding: "15px 15px",
            }}
          />
          {isTouched && !isValid && (
            <Form.Control.Feedback type="invalid">
              Please input the response.
            </Form.Control.Feedback>
          )}
        </Form.Group>
      </Form>
    </div>
  );
}

// -------------------------New Section Component--------------------------
export function NewSection(props) {
  return (
    <Form.Group
      className="mb-3"
      style={{
        marginTop: 30,
        backgroundColor: "#1193be",
        padding: 50,
        borderRadius: 7,
        border: "3px none rgba(122, 192, 215, .6)",
        color: "#fff",
        fontSize: 1.4 + "rem",
      }}
    >
      <h4
        style={{
          textAlign: "center",
          fontSize: 1.5 + "em",
        }}
      >
        {props.question.question}
      </h4>
    </Form.Group>
  );
}

// ------------------- SurveyTitle Component -------------------
export function SurveyTitle(props) {
  return (
    <div
      style={{
          background: "linear-gradient(135deg, #0c66a9 0%, #008cba 100%)",
          color: "#fff",
          paddingTop: 30,
          paddingBottom: 30,
          paddingLeft: 50,
          paddingRight: 50,
          borderRadius: 20,
          position: "relative",
          boxShadow: "0 15px 35px rgba(12, 102, 169, 0.3)",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          overflow: "hidden",
          marginBottom: 30,
          marginTop: 20,
        }}
        className="container"
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-5px)";
          e.currentTarget.style.boxShadow = "0 25px 50px rgba(12, 102, 169, 0.4)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 15px 35px rgba(12, 102, 169, 0.3)";
        }}
    >
      {/* Background decorative elements */}
        <div
          style={{
            position: "absolute",
            top: "-50px",
            right: "-50px",
            width: "150px",
            height: "150px",
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "50%",
            transition: "all 0.6s ease",
          }}
        ></div>
        <div
          style={{
            position: "absolute",
            bottom: "-30px",
            left: "-30px",
            width: "100px",
            height: "100px",
            background: "rgba(255, 255, 255, 0.05)",
            borderRadius: "50%",
            transition: "all 0.8s ease",
          }}
        ></div>
      <h1 style={{
        textAlign: "center",
        fontWeight: "900",
        letterSpacing: "0.02em",
        textShadow: "0 3px 18px #08335755"
      }}>Title: {props.survey.title}</h1>
      <h4
        style={{
          textAlign: "center",
          paddingTop: 24,
          color: "#fff",
          opacity: "0.81",
          fontWeight: 500,
          fontSize: "1.38em",
          letterSpacing: "0.01em",
          textShadow: "0 1px 6px #10b4f133",
        }}
      >
        Description: {props.survey.description}
      </h4>
    </div>
  );
}