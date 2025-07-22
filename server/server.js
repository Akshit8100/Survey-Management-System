require("dotenv").config(); // to use process something
// dependencies
const express = require("express");
const mongoose = require("mongoose");

// Routes folder
const questionRoutes = require("./routes/questions");
const surveyRoutes = require("./routes/surveys");
const userRoutes = require("./routes/users");

const app = express();
const cors = require("cors");

app.use(cors());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

// Connect with database
const DB = "mongodb+srv://akshitkumar:0169@cluster0gla.8bbxq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0Gla";
mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("connected db")).catch((err) => console.log("Database Error", err))

// Middleware
app.use((req, res, next) => {
  console.log(req.path, req.method);
  console.log("----------------------------------");
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/api/questions", questionRoutes);
app.use("/api/surveys", surveyRoutes);
app.use("/user", userRoutes);

// mongoose.connection.on(
//   "error",
//   console.error.bind(console, "MongoDB connectiom Error :(")
// );
// mongoose.connection.once("open", function () {
//   console.log("Database Connected Successfully");
// });

app.listen(5000, () => {
  console.log(`Server Listeing on PORT 5000`);
});
