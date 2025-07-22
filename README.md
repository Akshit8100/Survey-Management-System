🗳️ Survey Management System
A full-stack web application for managing surveys with user authentication, question management, and response tracking.

🚀 Features
👤 User authentication and authorization (JWT)

📋 Create, edit, and delete surveys

❓ Add and manage questions for each survey

📊 Submit responses to surveys

🛡️ Middleware-protected routes


🛠️ Tech Stack
🧠 Frontend
React.js

JavaScript

HTML5, CSS3

⚙️ Backend
Node.js

Express.js

🗃️ Database
MongoDB (Mongoose ODM)

📋 Prerequisites
Before you begin, ensure you have the following installed:

Node.js >= 14.x

MongoDB (local or cloud e.g., MongoDB Atlas)

Vercel CLI (for deployment, optional)

🚀 Installation
bash
Copy
Edit
# Clone the repository
git clone https://github.com/your-username/survey-management-system.git

# Navigate to client and install dependencies
cd client
npm install

# Navigate to server and install dependencies
cd ../server
npm install
🏃‍♂️ Running the Application
bash
Copy
Edit
# In client/
npm start        # Runs React frontend on http://localhost:3000

# In server/
node server.js   # Runs backend on http://localhost:5000
📁 Project Structure
pgsql
Copy
Edit
Survey-Management-System/
│
├── client/
│   ├── public/
│   ├── src/
│   ├── package.json
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── questionModel.js
│   │   ├── surveyModel.js
│   │   └── userModel.js
│   ├── routes/
│   ├── server.js
│   └── vercel.json
│
└── README.md
🔧 API Endpoints
Auth
POST /api/auth/register – Register new user

POST /api/auth/login – Login and receive JWT

Surveys
GET /api/surveys – Get all surveys

POST /api/surveys – Create a new survey

GET /api/surveys/:id – Get specific survey

PUT /api/surveys/:id – Update survey

DELETE /api/surveys/:id – Delete survey

Questions
POST /api/questions/:surveyId – Add question to a survey

DELETE /api/questions/:id – Delete a question

🔒 Security Features
JWT-based route protection

Password hashing using bcrypt

Input validation and error handling

Protected survey and question modification endpoints

🎯 Future Enhancements
📈 Add response analytics and charts

📮 Enable email invites to participate in surveys

🧑‍💻 Admin dashboard for managing users and surveys

📱 Make the frontend fully responsive
