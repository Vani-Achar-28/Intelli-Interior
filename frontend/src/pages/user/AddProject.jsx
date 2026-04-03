import { useState } from "react";
import API from "../../services/api";
import toast from "react-hot-toast"; // ✅ TOAST

function AddProject({ onAdd }) {
  const [form, setForm] = useState({
    title: "",
    budget: "",
    style: "",
    category: "",
    status: "Planning",
    description: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("User not logged in. Please login first.");
      return;
    }

    const data = new FormData();
    data.append("title", form.title);
    data.append("budget", form.budget);
    data.append("style", form.style);
    data.append("category", form.category);
    data.append("status", form.status);
    data.append("description", form.description);
    if (image) data.append("image", image);

    try {
      await API.post("/projects", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Project added successfully! 🎉");

      if (typeof onAdd === "function") onAdd();

      setForm({
        title: "",
        budget: "",
        style: "",
        category: "",
        status: "Planning",
        description: "",
      });
      setImage(null);
      setPreview(null);
    } catch (err) {
      console.error("Project upload failed:", err.response?.data || err);
      toast.error("Project upload failed. Try again!");
    }
  };

  return (
    <div className="add-project-wrapper">
      <form className="add-project-card" onSubmit={handleSubmit}>
        <h2>Add New Project</h2>

        <div className="row">
          <input
            type="text"
            name="title"
            placeholder="Project Title"
            value={form.title}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="budget"
            placeholder="Budget (₹)"
            value={form.budget}
            onChange={handleChange}
            required
          />
        </div>

        <div className="row">
          <input
            type="text"
            name="style"
            placeholder="Interior Style"
            value={form.style}
            onChange={handleChange}
          />
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            <option>Living Room</option>
            <option>Bedroom</option>
            <option>Kitchen</option>
            <option>Office</option>
            <option>Commercial</option>
          </select>
        </div>

        <select name="status" value={form.status} onChange={handleChange}>
          <option>Planning</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>

        <textarea
          name="description"
          placeholder="Project Description"
          value={form.description}
          onChange={handleChange}
        />

        {/* IMAGE UPLOAD */}
        <div style={{ marginTop: "10px" }}>
          <label style={{ color: "#f0c040", fontWeight: "bold" }}>
            Upload Room Image 
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
            style={{ display: "block", marginTop: "6px", color: "white" }}
          />
        </div>

        {/* IMAGE PREVIEW */}
        {preview && (
          <img
            src={preview}
            alt="Preview"
            style={{
              width: "100%",
              height: "180px",
              objectFit: "cover",
              borderRadius: "10px",
              marginTop: "10px",
              border: "2px solid #f0c040",
            }}
          />
        )}

        <button type="submit" className="gold-btn">
          Add Project
        </button>
      </form>
    </div>
  );
}

export default AddProject;