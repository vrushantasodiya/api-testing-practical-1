import { useEffect, useState } from "react";
import "./index.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    course: "",
  });
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);

  const loadStudents = async () => {
    try {
      const response = await fetch(`${API_URL}/students`);
      const result = await response.json();
      if (result.success) {
        setStudents(result.data);
      }
    } catch (error) {
      setMessage("Unable to connect to backend API");
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editingId) {
        const response = await fetch(`${API_URL}/students/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        });
        const result = await response.json();
        if (response.ok) {
          setMessage(result.message);
          setForm({ name: "", email: "", course: "" });
          setEditingId(null);
          loadStudents();
        } else {
          setMessage(result.message);
        }
      } else {
        const response = await fetch(`${API_URL}/students`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        });
        const result = await response.json();
        if (response.ok) {
          setMessage(result.message);
          setForm({ name: "", email: "", course: "" });
          loadStudents();
        } else {
          setMessage(result.message);
        }
      }
    } catch (error) {
      setMessage("Unable to connect to backend API");
    }
  };

  const editStudent = (student) => {
    setEditingId(student.id);
    setForm({
      name: student.name,
      email: student.email,
      course: student.course,
    });
    setMessage("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ name: "", email: "", course: "" });
    setMessage("");
  };

  const deleteStudent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) {
      return;
    }
    try {
      const response = await fetch(`${API_URL}/students/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (response.ok) {
        setMessage(result.message);
        if (editingId === id) {
          cancelEdit();
        }
        loadStudents();
      } else {
        setMessage(result.message);
      }
    } catch (error) {
      setMessage("Unable to connect to backend API");
    }
  };

  return (
    <div className="container">
      <h1>Student Registration</h1>
      <form onSubmit={handleSubmit} className="student-form">
        <input
          type="text"
          name="name"
          placeholder="Student Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="course"
          placeholder="Course"
          value={form.course}
          onChange={handleChange}
          required
        />
        <div className="form-actions">
          <button type="submit">
            {editingId ? "Update Student" : "Add Student"}
          </button>
          {editingId && (
            <button type="button" className="btn-cancel" onClick={cancelEdit}>
              Cancel
            </button>
          )}
        </div>
      </form>
      {message && <p className="message">{message}</p>}
      <h2>Student List</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Course</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.id}</td>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>{student.course}</td>
              <td className="actions">
                <button
                  className="btn-edit"
                  onClick={() => editStudent(student)}
                >
                  Update
                </button>
                <button
                  className="btn-delete"
                  onClick={() => deleteStudent(student.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
