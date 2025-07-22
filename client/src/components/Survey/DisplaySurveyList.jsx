import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";

import {
  Container,
  Col,
  Row,
  Button,
  Spinner,
  Card,
  Modal,
} from "react-bootstrap";

import { FaPlus, FaLink, FaDatabase } from "react-icons/fa";

const DisplaySurveyList = (props) => {
  const [userData, setUserData] = useState(null);
  const [responseCount, setResponseCount] = useState(0);
  const [surveyDataCounter, setSurveyDataCounter] = useState(0);
  const [surveyList, setSurveyList] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [surveyIdToDelete, setSurveyIdToDelete] = useState(null);
  const [userRole, setUserRole] = useState("normal");
  const [tableItems, setTableItems] = useState(
    <tr>
      <th>
        <div style={{ textAlign: "center", padding: 20 }}>
          <Spinner animation="border" />
        </div>
      </th>
    </tr>
  );

  // Use to get currnet user information
  const { user } = useAuthContext();
  let navigate = useNavigate();

  useEffect(() => {
    if (user && user.role === "admin") {
      setUserRole("admin");
    }
  }, []);

  // get current user information
  const callApi = useCallback(async (userId) => {
    try {
      const response = await fetch(`/api/surveys/surveys-by-user/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
      const responseData = await response.json();
      if (responseData === "No surveys found") {
        setTableItems(null);
      } else {
        setSurveyList(responseData);
      }
    } catch (err) {
      console.log(err);
    }
  });

  useEffect(() => {
    if (user) {
      setUserData(user);
    }
  });

  useEffect(() => {
    if (userData) {
      if (surveyDataCounter === 0) {
        setSurveyDataCounter(1);
        callApi(user._id);
      }
    }
  }, [userData]);

  let total = 0;
  useEffect(() => {
    if (surveyList) {
      surveyList.map((survey) => {
        total += survey.responseTotal;
      });
    }
    setResponseCount(total);
  }, [surveyList]);

  useEffect(() => {
    if (surveyList) {
      let items = surveyList.map((survey, index) => (
        <Card
          style={{
            fontFamily: "Nokora",
            height: 250,
            borderRadius: 20,
            marginBottom: 40,
            transition: "all 0.3s ease",
            boxShadow: "0 4px 15px rgba(0, 140, 186, 0.1)",
            border: "2px solid transparent",
            position: "relative",
            overflow: "hidden",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-8px)";
            e.currentTarget.style.boxShadow = "0 12px 25px rgba(0, 140, 186, 0.2)";
            e.currentTarget.style.borderColor = "#008cba";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 15px rgba(0, 140, 186, 0.1)";
            e.currentTarget.style.borderColor = "transparent";
          }}
        >
          <Card.Header
            as="h6"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "linear-gradient(135deg, #f8f9fa 0%, #a8c2dbff 100%)",
              borderBottom: "1px solid rgba(0, 140, 186, 0.1)",
            }}
          >
            <div 
              className="text-muted" 
              style={{ 
                padding: 5, 
                marginLeft: 5,
                fontWeight: "600",
                color: "#008cba",
                transition: "color 0.3s ease",
              }}
            >
              Total Received Responses: {survey.responseTotal}
            </div>

            {user && user.role === "admin" && (
              <div style={{ display: "flex", gap: "8px" }}>
                <Button
                  onClick={() => handleDeleteSurvey(survey._id)}
                  style={{
                    backgroundColor: "#d33c64",
                    paddingTop: 7,
                    paddingBottom: 7,
                    paddingLeft: 20,
                    paddingRight: 20,
                    borderRadius: 50,
                    fontSize: 0.9 + "rem",
                    color: "#fff",
                    alignItems: "center",
                    justifyContent: "center",
                    display: "flex",
                    height: 32,
                    width: 80,
                    textDecoration: "none",
                    borderColor: "#d33c64",
                    border: "2px solid #d33c64",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "scale(1.05)";
                    e.target.style.backgroundColor = "#b8305a";
                    e.target.style.boxShadow = "0 6px 20px rgba(211, 60, 100, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "scale(1)";
                    e.target.style.backgroundColor = "#d33c64";
                    e.target.style.boxShadow = "none";
                  }}
                  onMouseDown={(e) => {
                    e.target.style.transform = "scale(0.95)";
                  }}
                  onMouseUp={(e) => {
                    e.target.style.transform = "scale(1.05)";
                  }}
                >
                  Delete
                </Button>
                <Link to={`/create-survey/${survey._id}`} target="_blank">
                  <Button
                    style={{
                      backgroundColor: "#008cba",
                      paddingTop: 7,
                      paddingBottom: 7,
                      paddingLeft: 20,
                      paddingRight: 20,
                      borderRadius: 50,
                      color: "#fff",
                      alignItems: "center",
                      justifyContent: "center",
                      display: "flex",
                      margin: 0,
                      height: 32,
                      width: 60,
                      borderColor: "#008cba",
                      border: "2px solid #008cba",
                      fontSize: 0.9 + "rem",
                      textDecoration: "none",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      position: "relative",
                      overflow: "hidden",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = "scale(1.05)";
                      e.target.style.backgroundColor = "#006d94";
                      e.target.style.boxShadow = "0 6px 20px rgba(0, 140, 186, 0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "scale(1)";
                      e.target.style.backgroundColor = "#008cba";
                      e.target.style.boxShadow = "none";
                    }}
                    onMouseDown={(e) => {
                      e.target.style.transform = "scale(0.95)";
                    }}
                    onMouseUp={(e) => {
                      e.target.style.transform = "scale(1.05)";
                    }}
                  >
                    Edit
                  </Button>
                </Link>
              </div>
            )}
          </Card.Header>
          <Card.Body
            style={{
              textAlign: "left",
              background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
              position: "relative",
            }}
          >
            <div style={{ padding: 10 }}>
              <Card.Title 
                as="h2" 
                style={{
                  transition: "color 0.3s ease",
                  color: "#193c96",
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = "#008cba";
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = "#193c96";
                }}
              >
                Title: {survey.title}
              </Card.Title>
              <Card.Text>
                <hr
                  style={{
                    borderBottom: "none",
                    border: "none",
                    borderTop: "4px dotted #516267ff",
                    width: "25%",
                    transition: "width 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.width = "100%";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.width = "50%";
                  }}
                />
              </Card.Text>
              {user && user.role === "admin" && (
                <Link
                  to={`/display-results/${survey._id}`}
                  target="_blank"
                  style={{ textDecoration: "none" }}
                >
                  <Button
                    style={{
                      display: "flex",
                      alignItems: "center",
                      backgroundColor: "#ffffff",
                      paddingTop: 12,
                      paddingBottom: 12,
                      paddingLeft: 25,
                      paddingRight: 25,
                      borderRadius: 50,
                      color: "#0c66a9",
                      borderColor: "#008cba",
                      borderWidth: 3,
                      marginTop: 40,
                      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                      position: "relative",
                      overflow: "hidden",
                      fontWeight: "600",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "#008cba";
                      e.target.style.color = "#ffffff";
                      e.target.style.transform = "translateX(5px)";
                      e.target.style.boxShadow = "0 8px 25px rgba(0, 140, 186, 0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "#ffffff";
                      e.target.style.color = "#0c66a9";
                      e.target.style.transform = "translateX(0)";
                      e.target.style.boxShadow = "none";
                    }}
                  >
                    See all responses
                  </Button>
                </Link>
              )}
            </div>

            <div>
              <Link
                to={`/display-survey/${survey._id}`}
                target="_blank"
                style={{
                  backgroundColor: "#0c66a9",
                  paddingTop: 12,
                  paddingBottom: 12,
                  paddingLeft: 25,
                  paddingRight: 25,
                  borderRadius: 50,
                  color: "#fff",
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                  margin: 10,
                  textDecoration: "none",
                  position: "absolute",
                  bottom: 15,
                  right: 15,
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  fontWeight: "600",
                  border: "2px solid #0c66a9",
                  minWidth: "150px",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#ffffff";
                  e.target.style.color = "#0c66a9";
                  e.target.style.transform = "translateY(-3px) scale(1.05)";
                  e.target.style.boxShadow = "0 10px 30px rgba(12, 102, 169, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#0c66a9";
                  e.target.style.color = "#fff";
                  e.target.style.transform = "translateY(0) scale(1)";
                  e.target.style.boxShadow = "none";
                }}
              >
                Go to survey{" "}
                &nbsp;
                <FaLink style={{ transition: "transform 0.3s ease" }} />
              </Link>
            </div>
          </Card.Body>
        </Card>
      ));
      setTableItems(items);
    }
  }, [surveyList]);

  // handle the delete survey
  const handleDeleteSurvey = async (surveyId) => {
    setShowConfirmation(true);
    setSurveyIdToDelete(surveyId);
  };

  // Confirm delete survey modal
  const handleConfirmDelete = async () => {
    try {
      const reponse = await fetch(`/api/surveys/delete/${surveyIdToDelete}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (reponse.ok) {
        const updatedSurveyList = surveyList.filter(
          (survey) => survey._id !== surveyIdToDelete
        );
        setSurveyList(updatedSurveyList);
        console.log("A Survey was deleted it's ID is ", surveyIdToDelete);
        setShowConfirmation(false);
      } else {
        console.log("Survey not deleted successfully");
      }
    } catch (e) {
      console.log(e.error);
    }
  };

  // Cancel delete survey modal
  const handleCancelDelete = () => {
    setShowConfirmation(false);
  };

  // Create a new survey
  const onCreateSurveyClick = () => {
    navigate("/create-survey");
  };

  return (
    <>
      {user && user.role === "admin" && (
        <main
          className="container"
          style={{
            borderRadius: 20,
            padding: 50,
            position: "relative",
            background: "linear-gradient(135deg, rgb(237, 244, 245) 0%, rgba(203, 236, 249, 1) 100%)",
            boxShadow: "0 10px 30px rgba(0, 140, 186, 0.1)",
            transition: "all 0.3s ease",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 40,
              right: 100,
              width: 190,
              height: 190,
              background: "linear-gradient(135deg, #008cba 0%, #0c66a9 100%)",
              borderRadius: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              padding: "20px 10px",
              margin: "0 -10px",
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: "0 15px 35px rgba(0, 140, 186, 0.3)",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.1) rotate(5deg)";
              e.currentTarget.style.boxShadow = "0 20px 40px rgba(0, 140, 186, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1) rotate(0deg)";
              e.currentTarget.style.boxShadow = "0 15px 35px rgba(0, 140, 186, 0.3)";
            }}
          >
            <p
              style={{
                fontWeight: "bold",
                fontSize: 4 + "em",
                textAlign: "center",
                margin: 0,
                transition: "all 0.3s ease",
              }}
            >
              {responseCount}
              <br />
              <p
                style={{
                  fontSize: 1.5 + "rem",
                  fontWeight: "normal",
                  margin: 0,
                }}
              >
                Responses
              </p>
            </p>
          </div>

          <Container className="dashboardbg p-0" fluid>
            <Row
              className={tableItems ? "dashboardTitle" : null}
              style={{ paddingTop: 20 }}
            >
              <Col sm={12} lg={12}>
                <h2
                  style={{
                    textAlign: "left",
                    fontWeight: "bold",
                    color: "#193c96",
                    transition: "color 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = "#008cba";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = "#193c96";
                  }}
                >
                  Survey Dashboard
                </h2>
              </Col>
            </Row>
            <Row>
              <Col
                sm={12}
                lg={12}
                style={{ padding: 15, textAlign: "left", marginBottom: 20 }}
              >
                <Button
                  onClick={onCreateSurveyClick}
                  variant="primary"
                  className="createSrvyBtn"
                  style={{
                    borderRadius: 50,
                    borderWidth: 3,
                    backgroundColor: "#1e90ff",
                    paddingTop: 15,
                    paddingBottom: 15,
                    paddingLeft: 45,
                    paddingRight: 45,
                    fontSize: 20,
                    marginRight: 20,
                    borderColor: "#0c66a9",
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    fontWeight: "600",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#ffffff";
                    e.target.style.color = "#0c66a9";
                    e.target.style.transform = "translateY(-3px) scale(1.05)";
                    e.target.style.boxShadow = "0 12px 30px rgba(30, 144, 255, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "#1e90ff";
                    e.target.style.color = "#ffffff";
                    e.target.style.transform = "translateY(0) scale(1)";
                    e.target.style.boxShadow = "none";
                  }}
                  onMouseDown={(e) => {
                    e.target.style.transform = "translateY(-1px) scale(0.98)";
                  }}
                  onMouseUp={(e) => {
                    e.target.style.transform = "translateY(-3px) scale(1.05)";
                  }}
                >
                  <FaPlus style={{ marginRight: "8px", transition: "transform 0.3s ease" }} /> 
                  Create a New Survey
                </Button>

                <Link
                  to={"/display-data-grid/"}
                  target="_blank"
                  style={{ textDecoration: "none" }}
                >
                  <Button
                    variant="primary"
                    className="createSrvyBtn"
                    style={{
                      borderRadius: 50,
                      borderWidth: 3,
                      backgroundColor: "#ffffff",
                      paddingTop: 15,
                      paddingBottom: 15,
                      paddingLeft: 45,
                      paddingRight: 45,
                      fontSize: 20,
                      borderColor: "#0c66a9",
                      color: "#0c66a9",
                      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                      fontWeight: "600",
                      position: "relative",
                      overflow: "hidden",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "#1e90ff";
                      e.target.style.color = "#ffffff";
                      e.target.style.transform = "translateY(-3px) scale(1.05)";
                      e.target.style.boxShadow = "0 12px 30px rgba(12, 102, 169, 0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "#ffffff";
                      e.target.style.color = "#0c66a9";
                      e.target.style.transform = "translateY(0) scale(1)";
                      e.target.style.boxShadow = "none";
                    }}
                    onMouseDown={(e) => {
                      e.target.style.transform = "translateY(-1px) scale(0.98)";
                    }}
                    onMouseUp={(e) => {
                      e.target.style.transform = "translateY(-3px) scale(1.05)";
                    }}
                  >
                    <FaDatabase style={{ marginRight: "8px", transition: "transform 0.3s ease" }} />
                    Survey Data
                  </Button>
                </Link>
              </Col>
            </Row>
          </Container>
        </main>
      )}

      {/* If the user role as a normal user display a welcome message  */}
      {user && user.role === "normal" && (
        <main>
          <Container
            style={{
              background: "linear-gradient(135deg, #0c66a9 0%, #008cba 100%)",
              color: "#fff",
              fontFamily: "Nokora",
              paddingTop: 40,
              paddingLeft: 40,
              paddingBottom: 20,
              borderRadius: 20,
              boxShadow: "0 15px 35px rgba(12, 102, 169, 0.3)",
              transition: "all 0.3s ease",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 25px 50px rgba(12, 102, 169, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 15px 35px rgba(12, 102, 169, 0.3)";
            }}
          >
            <h1 
              style={{ 
                fontSize: 4 + "rem",
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "scale(1)";
              }}
            >
              Welcome to the survey
            </h1>
            <hr 
              className="userLineBreak" 
              style={{
                borderTop: "3px solid rgba(255, 255, 255, 0.3)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.borderTop = "3px solid rgba(255, 255, 255, 0.8)";
                e.target.style.width = "100%";
              }}
              onMouseLeave={(e) => {
                e.target.style.borderTop = "3px solid rgba(255, 255, 255, 0.3)";
                e.target.style.width = "50%";
              }}
            />
          </Container>
        </main>
      )}

      {/* Survey Section */}
      <section>
        <Container className={userRole}>
          <h2
            style={{
              textAlign: "left",
              fontWeight: "600",
              color: "#193c96",
              marginLeft: 15,
              marginBottom: 25,
              fontFamily: "Nokora",
              transition: "all 0.3s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.target.style.color = "#008cba";
              e.target.style.transform = "translateX(10px)";
            }}
            onMouseLeave={(e) => {
              e.target.style.color = "#193c96";
              e.target.style.transform = "translateX(0)";
            }}
          >
            {user && user.role === "admin" ? "Your Surveys" : "Your surveys"}
          </h2>
          {tableItems && <Container>{tableItems}</Container>}

          {/* Confirmation Modal */}
          <Modal
            show={showConfirmation}
            onHide={handleCancelDelete}
            centered
            style={{ border: "none" }}
          >
            <Modal.Header 
              closeButton 
              style={{ 
                color: "#0c66a9",
                background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                borderBottom: "2px solid rgba(0, 140, 186, 0.1)",
              }}
            >
              <Modal.Title style={{ fontWeight: "700" }}>Delete Confirmation</Modal.Title>
            </Modal.Header>
            <Modal.Body 
              style={{ 
                fontFamily: "Nokora", 
                color: "#008cba",
                fontSize: "1.1rem",
                padding: "30px",
                textAlign: "center",
              }}
            >
              <p>Are you sure you want to delete this survey?</p>
            </Modal.Body>
            <Modal.Footer style={{ justifyContent: "center", gap: "15px", padding: "20px" }}>
              <Button
                onClick={handleCancelDelete}
                style={{
                  backgroundColor: "#008cba",
                  borderColor: "#008cba",
                  borderRadius: 50,
                  borderWidth: 2,
                  paddingLeft: 25,
                  paddingRight: 25,
                  paddingTop: 12,
                  paddingBottom: 12,
                  fontWeight: "600",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#006d94";
                  e.target.style.transform = "scale(1.05)";
                  e.target.style.boxShadow = "0 5px 15px rgba(0, 140, 186, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#008cba";
                  e.target.style.transform = "scale(1)";
                  e.target.style.boxShadow = "none";
                }}
              >
                Cancel
              </Button>
              <Button
                style={{
                  backgroundColor: "#d33c64",
                  borderColor: "#d33c64",
                  borderRadius: 50,
                  borderWidth: 2,
                  paddingLeft: 25,
                  paddingRight: 25,
                  paddingTop: 12,
                  paddingBottom: 12,
                  fontWeight: "600",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                onClick={handleConfirmDelete}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#b8305a";
                  e.target.style.transform = "scale(1.05)";
                  e.target.style.boxShadow = "0 5px 15px rgba(211, 60, 100, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#d33c64";
                  e.target.style.transform = "scale(1)";
                  e.target.style.boxShadow = "none";
                }}
              >
                Delete
              </Button>
            </Modal.Footer>
          </Modal>
        </Container>
      </section>
    </>
  );
};

export default DisplaySurveyList;