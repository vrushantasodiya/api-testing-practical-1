const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 5000;
// Middleware
app.use(cors());
app.use(express.json());
// Temporary student data
let students = [
  {
    id: 1,
    name: "Rahul",
    email: "rahul@example.com",
    course: "BCA",
  },
  {
    id: 2,
    name: "Priya",
    email: "priya@example.com",
    course: "B.Tech",
  },
];
// Home API
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Student API is running successfully",
  });
});
// GET all students
app.get("/api/students", (req, res) => {
  res.status(200).json({
    success: true,
    count: students.length,
    data: students,
  });
});
// GET single student
app.get("/api/students/:id", (req, res) => {
  const id = Number(req.params.id);
  const student = students.find((student) => student.id === id);
  if (!student) {
    return res.status(404).json({
      success: false,
      message: "Student not found",
    });
  }
  res.status(200).json({
    success: true,
    data: student,
  });
});
// POST - Add student
app.post("/api/students", (req, res) => {
  const { name, email, course } = req.body;
  if (!name || !email || !course) {
    return res.status(400).json({
      success: false,
      message: "Name, email and course are required",
    });
  }
  const newStudent = {
    id:
      students.length > 0
        ? Math.max(...students.map((student) => student.id)) + 1
        : 1,
    name,
    email,
    course,
  };
  students.push(newStudent);
  res.status(201).json({
    success: true,
    message: "Student created successfully",
    data: newStudent,
  });
});
// PUT - Update student
app.put("/api/students/:id", (req, res) => {
  const id = Number(req.params.id);
  const { name, email, course } = req.body;
  const studentIndex = students.findIndex((student) => student.id === id);
  if (studentIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Student not found",
    });
  }
  if (!name || !email || !course) {
    return res.status(400).json({
      success: false,
      message: "Name, email and course are required",
    });
  }
  students[studentIndex] = {
    id,
    name,
    email,
    course,
  };
  res.status(200).json({
    success: true,
    message: "Student updated successfully",
    data: students[studentIndex],
  });
});
// DELETE - Delete student
app.delete("/api/students/:id", (req, res) => {
  const id = Number(req.params.id);
  const studentExists = students.some((student) => student.id === id);
  if (!studentExists) {
    return res.status(404).json({
      success: false,
      message: "Student not found",
    });
  }
  students = students.filter((student) => student.id !== id);
  res.status(200).json({
    success: true,
    message: "Student deleted successfully",
  });
});
// Start server
app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});

