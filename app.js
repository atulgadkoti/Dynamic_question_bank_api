const express = require("express");
const questionRoutes = require("./routes/questionRoutes");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api", questionRoutes);

app.get("/", (req, res)=>{
    res.send("Question bank api is running");
});

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
});

// https://dynamic-question-bank-api.onrender.com/api/questions?skill=reading&sub_skill=inference&level=A&student_id=demo123&count=2

// https://dynamic-question-bank-api.onrender.com/api/questions/submit-answer



// https://dynamic-question-bank-api.onrender.com/api/student/question-stats?student_id=demo123

