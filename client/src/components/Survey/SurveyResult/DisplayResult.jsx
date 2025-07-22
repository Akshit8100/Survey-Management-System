import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuthContext } from "../../../hooks/useAuthContext";
import {
  ShortResponseResult,
  NewSection,
  TrueOrFalseResult,
  MultipleChoiceResult,
} from "./resultComponents";
import { Container, Spinner, Button } from "react-bootstrap";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function DisplayResult() {
  const { id } = useParams();
  const { user } = useAuthContext();
  const [survey, setSurvey] = useState(null);
  const [result, setResult] = useState(
    <div style={{ textAlign: "center", padding: 20 }}>
      <Spinner 
        animation="border" 
        style={{
          color: "#008cba",
          width: "3rem",
          height: "3rem",
          animation: "spin 1s linear infinite",
        }}
      />
    </div>
  );

  const callApi = async (url, fetchOptions) => {
    try {
      const response = await fetch(`/${url}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        ...fetchOptions,
      });

      const responseData = await response.json();
      setSurvey(responseData);
    } catch (e) {
      console.log(e.error);
    }
  };

  useEffect(() => {
    callApi(`api/surveys/${id}`, {
      method: "GET",
    });
  }, [user, id]);

  useEffect(() => {
    let questionIndex = 0;
    if (survey) {
      const updatedResults = survey.questions.map((question, index) => {
        if (question.type === "new section") {
          return <NewSection key={question._id} question={question} />;
        }
        questionIndex++;

        if (
          question.type === "short response" ||
          question.type === "paragraph"
        ) {
          return (
            <ShortResponseResult
              key={id}
              question={question}
              index={questionIndex}
            />
          );
        } else if (question.type === "true/false") {
          return (
            <TrueOrFalseResult
              key={id}
              question={question}
              index={questionIndex}
            />
          );
        }else if (question.type === "multiple choice") {
          return (
            <MultipleChoiceResult
              key={id}
              question={question}
              index={questionIndex}
            />
          );
        }else {
          return null;
        }
      });
      setResult(updatedResults);
    }
  }, [survey]);

  // Function to export the survey result as an excel file
  const exportAsXLSX = () => {
    const workbook = XLSX.utils.book_new();
    const sheetName = "Survey Result";

    const data = [[...survey.questions.map((q) => q.question)]];

    for (let i = 0; i < survey.questions[0].responses.length; i++) {
      const row = [];
      survey.questions.forEach((question) => {
        row.push(question.responses[i]?.response || "");
      });
      data.push(row);
    }

    const worksheet = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    const fileBuffer = XLSX.write(workbook, {
      type: "array",
      bookType: "xlsx",
    });

    const blob = new Blob([fileBuffer], { type: "application/octet-stream" });
    saveAs(blob, `${survey.title}.xlsx`);
  };

  return (
    <div>
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

        <h2
          style={{
            textAlign: "left",
            fontFamily: "Nokora",
            fontWeight: "bold",
            fontSize: "2.5rem",
            marginBottom: "10px",
            transition: "all 0.3s ease",
            textShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
            position: "relative",
            zIndex: 2,
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateX(10px) scale(1.02)";
            e.target.style.textShadow = "0 4px 20px rgba(0, 0, 0, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateX(0) scale(1)";
            e.target.style.textShadow = "0 2px 10px rgba(0, 0, 0, 0.2)";
          }}
        >
          {survey ? survey.title : "Loading Survey..."}
        </h2>

        <h4 
          style={{ 
            textAlign: "left", 
            fontFamily: "Nokora",
            fontSize: "1.3rem",
            opacity: "0.9",
            fontWeight: "400",
            transition: "all 0.3s ease",
            position: "relative",
            zIndex: 2,
          }}
          onMouseEnter={(e) => {
            e.target.style.opacity = "1";
            e.target.style.transform = "translateX(5px)";
          }}
          onMouseLeave={(e) => {
            e.target.style.opacity = "0.9";
            e.target.style.transform = "translateX(0)";
          }}
        >
          Results from the responses
        </h4>

        {/* Animated divider line */}
        <div
          style={{
            width: "100px",
            height: "4px",
            background: "linear-gradient(90deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.3) 100%)",
            borderRadius: "2px",
            marginTop: "20px",
            transition: "width 0.4s ease",
            position: "relative",
            zIndex: 2,
          }}
          onMouseEnter={(e) => {
            e.target.style.width = "200px";
          }}
          onMouseLeave={(e) => {
            e.target.style.width = "100px";
          }}
        ></div>

        <div>
          <Button
            onClick={exportAsXLSX}
            style={{
              position: "absolute",
              top: 30,
              right: 30,
              alignItems: "center",
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              paddingTop: 15,
              paddingBottom: 15,
              paddingLeft: 30,
              paddingRight: 30,
              borderRadius: 50,
              color: "#fff",
              borderColor: "rgba(255, 255, 255, 0.3)",
              borderWidth: 2,
              fontWeight: "600",
              fontSize: "1rem",
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)",
              zIndex: 3,
              cursor: "pointer",
            }}
            className="export-button"
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#ffffff";
              e.target.style.color = "#0c66a9";
              e.target.style.transform = "translateY(-3px) scale(1.05)";
              e.target.style.boxShadow = "0 15px 35px rgba(255, 255, 255, 0.3)";
              e.target.style.borderColor = "#ffffff";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "rgba(255, 255, 255, 0.15)";
              e.target.style.color = "#fff";
              e.target.style.transform = "translateY(0) scale(1)";
              e.target.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.1)";
              e.target.style.borderColor = "rgba(255, 255, 255, 0.3)";
            }}
            onMouseDown={(e) => {
              e.target.style.transform = "translateY(-1px) scale(0.98)";
            }}
            onMouseUp={(e) => {
              e.target.style.transform = "translateY(-3px) scale(1.05)";
            }}
          >
            📊 Export Excel
          </Button>
        </div>
      </div>

      <Container 
        style={{
          padding: "30px 20px",
          background: "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)",
          borderRadius: "20px",
          boxShadow: "0 10px 30px rgba(0, 140, 186, 0.08)",
          transition: "all 0.3s ease",
          position: "relative",
          overflow: "hidden",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = "0 15px 40px rgba(0, 140, 186, 0.12)";
          e.currentTarget.style.transform = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "0 10px 30px rgba(0, 140, 186, 0.08)";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        {/* Background pattern */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 20% 50%, rgba(0, 140, 186, 0.03) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(12, 102, 169, 0.03) 0%, transparent 50%),
              radial-gradient(circle at 40% 80%, rgba(0, 140, 186, 0.02) 0%, transparent 50%)
            `,
            pointerEvents: "none",
          }}
        ></div>

        <div 
          style={{
            position: "relative",
            zIndex: 2,
            transition: "all 0.3s ease",
          }}
        >
          {result}
        </div>
      </Container>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .container {
          animation: slideIn 0.6s ease-out;
        }

        .export-button {
          position: relative;
          overflow: hidden;
        }

        .export-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }

        .export-button:hover::before {
          left: 100%;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .export-button {
            position: static !important;
            margin-top: 20px !important;
            width: 100% !important;
          }
        }

        /* Custom scrollbar for container */
        .container::-webkit-scrollbar {
          width: 8px;
        }

        .container::-webkit-scrollbar-track {
          background: rgba(0, 140, 186, 0.1);
          border-radius: 4px;
        }

        .container::-webkit-scrollbar-thumb {
          background: rgba(0, 140, 186, 0.3);
          border-radius: 4px;
          transition: background 0.3s ease;
        }

        .container::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 140, 186, 0.5);
        }
      `}</style>
    </div>
  );
}