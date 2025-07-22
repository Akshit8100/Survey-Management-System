import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
} from "@mui/material";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";
import { Container, Form } from "react-bootstrap";
import { useState } from "react";

export function ShortResponseResult(props) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  
  const responses = props.question.responses.map((response, index) => {
    return (
      <TableRow 
        key={index}
        onMouseEnter={() => setHoveredIndex(index)}
        onMouseLeave={() => setHoveredIndex(null)}
        style={{
          backgroundColor: hoveredIndex === index ? '#b3e5fc' : 'transparent',
          transform: hoveredIndex === index ? 'translateX(5px)' : 'translateX(0)',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          borderLeft: hoveredIndex === index ? '4px solid #0288d1' : '4px solid transparent'
        }}
      >
        <TableCell style={{ 
          fontWeight: "normal",
          transition: 'all 0.3s ease'
        }}>
          <span style={{
            display: 'inline-block',
            marginRight: '8px',
            padding: '2px 8px',
            backgroundColor: hoveredIndex === index ? '#0288d1' : '#008cba',
            color: 'white',
            borderRadius: '12px',
            fontSize: '0.8em',
            transition: 'all 0.3s ease',
            transform: hoveredIndex === index ? 'scale(1.1)' : 'scale(1)'
          }}>
            {index + 1}
          </span>
          {response.response}
        </TableCell>
      </TableRow>
    );
  });

  return (
    <TableContainer
      component={Paper}
      style={{
        backgroundColor: "#edf4f5",
        paddingTop: 20,
        marginTop: 30,
        color: "#008cba",
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0, 140, 186, 0.1)',
        transition: 'all 0.3s ease',
        border: '1px solid rgba(0, 140, 186, 0.2)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 140, 186, 0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 140, 186, 0.1)';
      }}
    >
      <div>
        <h4
          style={{
            textAlign: "left",
            fontWeight: 500,
            fontFamily: "Nokora",
            margin: "10px",
            background: 'linear-gradient(135deg, #008cba, #0288d1)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          Question {props.index}: {props.question.question}
        </h4>
      </div>
      <div style={{ overflowY: "scroll", height: 300 }}>
        <Table striped bordered hover style={{ fontFamily: "Nokora" }}>
          <TableHead>
            <TableRow>
              <TableCell style={{ 
                color: "#008cba", 
                fontFamily: "Nokora",
                background: 'linear-gradient(135deg, #008cba, #0288d1)',
                color: 'white'
              }}>
                Response
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody style={{ color: "#008cba" }}>{responses}</TableBody>
        </Table>
      </div>
    </TableContainer>
  );
}

// --------------------------------- True or False ---------------------------------
const COLORS = ["#0088FE", "#00C49F"];

export function TrueOrFalseResult(props) {
  const [isHovered, setIsHovered] = useState(false);
  const { responses } = props.question;
  let trueCount = 0;
  let falseCount = 0;

  responses.forEach((response) => {
    if (response.response === "True") {
      trueCount++;
    } else {
      falseCount++;
    }
  });

  const data = [
    { name: "True", value: trueCount },
    { name: "False", value: falseCount },
  ];

  return (
    <Form.Group
      className="mb-3"
      style={{
        marginTop: 30,
        backgroundColor: "#edf4f5",
        padding: 20,
        borderRadius: 12,
        boxShadow: isHovered ? '0 8px 30px rgba(0, 140, 186, 0.2)' : '0 4px 20px rgba(0, 140, 186, 0.1)',
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'all 0.3s ease',
        border: '1px solid rgba(0, 140, 186, 0.2)',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: isHovered ? '100%' : '-100%',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
          transition: 'left 0.6s ease',
          pointerEvents: 'none'
        }}
      />
      
      <h4
        style={{
          textAlign: "left",
          fontWeight: 500,
          fontFamily: "Nokora",
          color: "#008cba",
          background: 'linear-gradient(135deg, #008cba, #0288d1)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}
      >
        Question {props.index}: {props.question.question}
      </h4>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <ResponsiveContainer width="100%" height={300}>
          <PieChart width={500} height={500}>
            <Pie
              dataKey="value"
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={isHovered ? 85 : 80}
              fill="#8884d8"
              label
              animationDuration={800}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  style={{
                    filter: isHovered ? 'brightness(1.1)' : 'none',
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
            </Pie>
            <Legend verticalAlign="bottom" height={40} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Form.Group>
  );
}

export function NewSection(props) {
  const [isClicked, setIsClicked] = useState(false);
  
  return (
    <Form.Group
      className="mb-3"
      style={{
        marginTop: 30,
        background: 'linear-gradient(135deg, #1193be, #0c66a9)',
        padding: 50,
        color: "#fff",
        fontSize: 1.4 + "rem",
        boxShadow: isClicked 
          ? "5px 5px #0c66a9" 
          : "10px 10px #0c66a9",
        borderRadius: '15px',
        cursor: 'pointer',
        transform: isClicked ? 'translate(5px, 5px)' : 'translate(0, 0)',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={(e) => {
        if (!isClicked) {
          e.currentTarget.style.transform = 'translate(-2px, -2px)';
          e.currentTarget.style.boxShadow = '12px 12px #0c66a9';
        }
      }}
      onMouseLeave={(e) => {
        if (!isClicked) {
          e.currentTarget.style.transform = 'translate(0, 0)';
          e.currentTarget.style.boxShadow = '10px 10px #0c66a9';
        }
      }}
      onMouseDown={() => setIsClicked(true)}
      onMouseUp={() => setIsClicked(false)}
    >
      <h4
        style={{
          textAlign: "center",
          fontSize: 1.5 + "em",
          fontFamily: "Nokora",
          margin: 0,
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)'
        }}
      >
        {props.question.question}
      </h4>
    </Form.Group>
  );
}

export function SurveyTitle(props) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Container
      style={{
        textAlign: 'center',
        padding: '20px',
        borderRadius: '15px',
        boxShadow: isHovered 
          ? '0 10px 30px rgba(0, 140, 186, 0.2)' 
          : '0 5px 15px rgba(0, 140, 186, 0.1)',
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'all 0.3s ease',
        background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h2 style={{
        background: 'linear-gradient(135deg, #1193be, #0c66a9)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        fontWeight: 'bold',
        transform: isHovered ? 'scale(1.02)' : 'scale(1)',
        transition: 'transform 0.3s ease'
      }}>
        {props.survey.title}
      </h2>
      <br />
    </Container>
  );
}

const COLOR = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA66CC", "#FF6666"]
export function MultipleChoiceResult(props) {
  const [isHovered, setIsHovered] = useState(false);
  const { responses, answer_choices = [] } = props.question;

  // Count responses per option
  const responseCount = answer_choices.reduce((acc, option) => {
    acc[option] = 0;
    return acc;
  }, {});

  responses.forEach((res) => {
    if (res.response in responseCount) {
      responseCount[res.response]++;
    }
  });

  const data = Object.entries(responseCount).map(([name, value]) => ({ name, value }));

  return (
    <Form.Group
      className="mb-3"
      style={{
        marginTop: 30,
        backgroundColor: "#edf4f5",
        padding: 20,
        borderRadius: 12,
        boxShadow: isHovered ? '0 8px 30px rgba(0, 140, 186, 0.2)' : '0 4px 20px rgba(0, 140, 186, 0.1)',
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'all 0.3s ease',
        border: '1px solid rgba(0, 140, 186, 0.2)',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: isHovered ? '100%' : '-100%',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
          transition: 'left 0.6s ease',
          pointerEvents: 'none'
        }}
      />

      <h4
        style={{
          textAlign: "left",
          fontWeight: 500,
          fontFamily: "Nokora",
          color: "#008cba",
          background: 'linear-gradient(135deg, #008cba, #0288d1)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}
      >
        Question {props.index}: {props.question.question}
      </h4>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={isHovered ? 90 : 80}
            label
            animationDuration={800}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLOR[index % COLOR.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </Form.Group>
  );
}