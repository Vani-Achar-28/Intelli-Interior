import { useState } from "react";
import API from "../../services/api";
import "../../styles/dashboard.css";

function EditProject({ project, onClose, onUpdated }) {
  const [form, setForm] = useState({
    title: project.title,
    budget: project.budget,
    style: project.style,
    roomType: project.roomType,
    status: project.status,
    description: project.description,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.put(`/projects/${project._id}`, form);
    onUpdated();
  };

  return (
    <div className="edit-wrapper">
      <div className="edit-card">
        <h3>Edit Project</h3>

        <form onSubmit={handleSubmit}>
          <div className="edit-grid">
            <div>
              <label>Project Title</label>
              <input name="title" value={form.title} onChange={handleChange} />
            </div>

            <div>
              <label>Budget</label>
              <input name="budget" value={form.budget} onChange={handleChange} />
            </div>

            <div>
              <label>Style</label>
              <input name="style" value={form.style} onChange={handleChange} />
            </div>

            <div>
              <label>Room Type</label>
              <select name="roomType" value={form.roomType} onChange={handleChange}>
                <option>Living Room</option>
                <option>Bedroom</option>
                <option>Kitchen</option>
                <option>Hall</option>
              </select>
            </div>

            <div>
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                <option>Planning</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
            </div>

            <div className="full">
              <label>Description</label>
              <textarea
                name="description"
                rows="3"
                value={form.description}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="edit-actions">
            <button type="submit" className="btn-primary">
              Update
            </button>

            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProject;
