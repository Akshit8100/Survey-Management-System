import { useState, useEffect, React } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Dropdown from "react-bootstrap/Dropdown";
import { useAuthContext } from "../../hooks/useAuthContext";

function DataGridComponent() {
  const { user } = useAuthContext();
  const [tableData, setTableData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [surveys, setSurveys] = useState(null);
  const [selectedSurvey, setSelectedSurvey] = useState("");
  const [isDropdownHovered, setIsDropdownHovered] = useState(false);

  useEffect(() => {
    fetchAllSurveyData();
  }, [user]);

  // Fetch all the survey

  const fetchAllSurveyData = async (fetchOptions) => {
    try {
      const response = await fetch("/api/surveys", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        ...fetchOptions,
      });
      const responseData = await response.json();
      setSurveys(responseData);

      // Check if a default survey is not selected yet
      if (!selectedSurvey && responseData.length > 0) {
        setSelectedSurvey(responseData[0]); // Set the first survey as default
      }
    } catch (e) {
      console.log(e.error);
    }
  };

  // Fetch the survey data by ID
  const fetchSurveyDataById = async (surveyId) => {
    try {
      const response = await fetch(
        `/api/surveys/${surveyId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const responseData = await response.json();
      setSelectedSurvey(responseData);
    } catch (e) {
      console.log(e.error);
    }
  };

  const handleSurveyChange = async (surveyId) => {
    // Call fetchSurveyDataById with the selected survey ID
    fetchSurveyDataById(surveyId);
  };

  console.log(selectedSurvey);
  useEffect(() => {
    // Update DataGrid columns and rows when a survey is selected
    if (selectedSurvey) {
      const firstQuestionResponses = selectedSurvey.questions[0].responses;
      const firstQuestionLength = firstQuestionResponses.length;

      selectedSurvey.questions.forEach((question) => {
        const questionResponses = question.responses;
        const padding = firstQuestionLength - questionResponses.length;
        if (padding > 0) {
          // Pad the responses with empty strings
          const paddedResponses = Array(padding)
            .fill("")
            .concat(questionResponses);
          question.responses = paddedResponses;
        }
      });

      const surveyColumns = [
        { field: "submission_date", headerName: "Submission Date", width: 350 },
        ...selectedSurvey.questions.map((question, index) => ({
          field: `question_${index + 1}`,
          headerName: question.question,
          headerClassName:
            question.type === "new section" ? "super-app-theme--header" : "",
          width: 300,
        })),
      ];

      const dataRows = firstQuestionResponses.map((response, index) => {
        const rowData = {
          id: index + 1,
          submission_date: new Date(response.time).toLocaleDateString(),
        };

        selectedSurvey.questions.forEach((question, questionIndex) => {
          // Pad the responses for each question to match the maxResponseLength
          const questionResponses = question.responses;
          rowData[`question_${questionIndex + 1}`] =
            questionResponses[index]?.response || "";
        });

        return rowData;
      });
      setTableData(dataRows);
      setColumns(surveyColumns);
    }
  }, [selectedSurvey]);

  return (
    <div style={{ minHeight: "100vh"}}>
      {user && user.role === "admin" ? (
        <div
          style={{
            height: "100%",
            marginLeft: 50,
            marginRight: 50,
            padding: '20px',
            background: 'linear-gradient(135deg, #f8f9fa, #ffffff)',
            borderRadius: '20px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease'
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 30,
              zIndex: 100,
              position: "relative",
            }}
          >
            <Dropdown 
              as={ButtonGroup}
              onMouseEnter={() => setIsDropdownHovered(true)}
              onMouseLeave={() => setIsDropdownHovered(false)}
              style={{
                transform: isDropdownHovered ? 'translateY(-2px)' : 'translateY(0)',
                transition: 'all 0.3s ease'
              }}
            >
              <Button
                style={{
                  paddingLeft: 20,
                  border: "3px solid #0c66a9",
                  backgroundColor: isDropdownHovered ? "#f0f8ff" : "#ffffff",
                  color: "#0c66a9",
                  fontSize: 1.3 + "rem",
                  borderRadius: '15px 0 0 15px',
                  fontWeight: 'bold',
                  letterSpacing: '0.5px',
                  transition: 'all 0.3s ease',
                  background: isDropdownHovered 
                    ? 'linear-gradient(135deg, #ffffff, #f0f8ff)' 
                    : '#ffffff'
                }}
              >
                Survey Data: {selectedSurvey.title || "Select Survey"}
              </Button>
              <Dropdown.Toggle
                split
                id="dropdown-split-basic"
                style={{
                  padding: 15,
                  paddingRight: 20,
                  paddingLeft: 20,
                  backgroundColor: isDropdownHovered ? "#1a75a3" : "#0c66a9",
                  borderColor: "#0c66a9",
                  color: "#ffffff",
                  borderRadius: '0 15px 15px 0',
                  transition: 'all 0.3s ease'
                }}
              />

              <Dropdown.Menu
                style={{
                  borderRadius: '15px',
                  border: 'none',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
                  padding: '10px 0',
                  background: 'linear-gradient(135deg, #ffffff, #f8f9fa)',
                }}
              >
                {surveys &&
                  surveys.map((survey) => (
                    <Dropdown.Item
                      key={survey._id}
                      value={survey._id}
                      onClick={() => handleSurveyChange(survey._id)}
                      style={{
                        padding: '12px 20px',
                        fontSize: '1.1rem',
                        color: '#0c66a9',
                        fontWeight: '500',
                        transition: 'all 0.3s ease',
                        borderRadius: '10px',
                        margin: '5px 10px',
                      }}
                    >
                      {survey.title}
                    </Dropdown.Item>
                  ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>

          <div
            style={{
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
              background: 'linear-gradient(135deg, #ffffff, #f8f9fa)',
              border: '2px solid rgba(12, 102, 169, 0.1)',
              transition: 'all 0.3s ease'
            }}
          >
            <DataGrid
              rows={tableData}
              columns={columns}
              disableColumnSelector
              disableDensitySelector
              style={{
                borderRadius: 20,
                fontFamily: "Nokora",
                fontSize: "1.1rem",
                padding: 20,
                border: 'none',
                background: 'transparent'
              }}
              slots={{ toolbar: GridToolbar }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                  isableToolbarButton: true,
                  printOptions: { disableToolbarButton: true },
                },
              }}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 5, page: 0 },
                },
              }}
              pageSizeOptions={[5, 10, 25]}
              sx={{
                '& .MuiDataGrid-root': {
                  border: 'none',
                },
                '& .MuiDataGrid-cell': {
                  borderBottom: '1px solid rgba(12, 102, 169, 0.1)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(12, 102, 169, 0.05)',
                    transform: 'scale(1.01)',
                  }
                },
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: '#0c66a9',
                  color: 'white',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  borderRadius: '15px 15px 0 0',
                  '& .MuiDataGrid-columnHeader': {
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      transform: 'translateY(-1px)'
                    }
                  }
                },
                '& .MuiDataGrid-row': {
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(12, 102, 169, 0.08)',
                    transform: 'translateX(3px)',
                    boxShadow: '3px 0 10px rgba(12, 102, 169, 0.1)'
                  },
                  '&:nth-of-type(even)': {
                    backgroundColor: 'rgba(12, 102, 169, 0.02)'
                  }
                },
                '& .MuiDataGrid-footerContainer': {
                  backgroundColor: 'rgba(12, 102, 169, 0.05)',
                  borderRadius: '0 0 15px 15px',
                  borderTop: '2px solid rgba(12, 102, 169, 0.1)'
                },
                '& .MuiToolbar-root': {
                  padding: '15px 20px',
                  background: 'linear-gradient(135deg, #f8f9fa, #ffffff)',
                  borderBottom: '2px solid rgba(12, 102, 169, 0.1)',
                  '& .MuiButton-root': {
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0 3px 10px rgba(12, 102, 169, 0.2)'
                    }
                  }
                },
                '& .MuiInputBase-root': {
                  borderRadius: '25px',
                  backgroundColor: 'rgba(12, 102, 169, 0.05)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(12, 102, 169, 0.1)',
                    transform: 'scale(1.02)'
                  },
                  '&.Mui-focused': {
                    backgroundColor: 'rgba(12, 102, 169, 0.1)',
                    boxShadow: '0 0 10px rgba(12, 102, 169, 0.3)'
                  }
                }
              }}
            />
          </div>
        </div>
      ) : (
        <h1
          style={{
            textAlign: "center",
            background: 'linear-gradient(135deg, #ff6b6b, #ee5a52)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontSize: '3rem',
            fontWeight: 'bold',
            textShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            padding: '50px',
            borderRadius: '20px',
            boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
            margin: '50px',
            backgroundColor: '#ffffff',
            animation: 'pulse 2s infinite'
          }}
        >
          You are not authorized to view this page
        </h1>
      )}
      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.02); }
            100% { transform: scale(1); }
          }
        `}
      </style>
    </div>
  );
}

export default DataGridComponent;