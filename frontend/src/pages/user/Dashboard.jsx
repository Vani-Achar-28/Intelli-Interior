import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import AddProject from "./AddProject";
import EditProject from "./EditProject";
import ProjectCharts from "../../components/ProjectCharts";
import toast from "react-hot-toast";
import "../../styles/dashboard.css";

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: "", newPass: "", confirm: "" });
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const userName = user?.name || "User";

  const fetchProjects = async () => {
    const res = await API.get("/projects");
    setProjects(res.data);
    setFiltered(res.data);
  };

  useEffect(() => { fetchProjects(); }, []);

  useEffect(() => {
    let result = [...projects];
    if (search) result = result.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()));
    if (filterStatus !== "All") result = result.filter((p) => p.status === filterStatus);
    if (sortBy === "newest") result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    else if (sortBy === "oldest") result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    else if (sortBy === "highbudget") result.sort((a, b) => b.budget - a.budget);
    else if (sortBy === "lowbudget") result.sort((a, b) => a.budget - b.budget);
    setFiltered(result);
  }, [search, projects, filterStatus, sortBy]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    await API.delete(`/projects/${id}`);
    setProjects(projects.filter((p) => p._id !== id));
    toast.success("Project deleted! 🗑️");
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.newPass !== passwordForm.confirm) {
      toast.error("New passwords don't match!");
      return;
    }
    toast.success("Password updated successfully! ✅");
    setShowPasswordForm(false);
    setPasswordForm({ current: "", newPass: "", confirm: "" });
  };

  const total = projects.length;
  const planning = projects.filter((p) => p.status === "Planning").length;
  const progress = projects.filter((p) => p.status === "In Progress").length;
  const completed = projects.filter((p) => p.status === "Completed").length;
  const budget = projects.reduce((s, p) => s + Number(p.budget || 0), 0);

  const SIDEBAR_ITEMS = [
    { id: "overview", icon: "📊", label: "Overview" },
    { id: "add", icon: "➕", label: "Add Project" },
    { id: "projects", icon: "🏠", label: "Projects" },
    { id: "profile", icon: "👤", label: "Profile" },
  ];

  return (
    <div className="dashboard-layout">

      {/* SIDEBAR */}
      <div className="sidebar">
        <div className="sidebar-user">
          <div className="sidebar-avatar">
            {userName?.charAt(0).toUpperCase()}
          </div>
          <p className="sidebar-name">{userName}</p>
          <p className="sidebar-role">User</p>
        </div>

        <nav className="sidebar-nav">
          {SIDEBAR_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`sidebar-item ${activeTab === item.id ? "sidebar-active" : ""}`}
              onClick={() => {
                setActiveTab(item.id);
                setEditingProject(null);
              }}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* MAIN CONTENT */}
      <div className="dashboard-main">
        <div className="dashboard-header">
          <h3 className="welcome">👋 Welcome, {userName}</h3>
        </div>

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <>
            <div className="stats">
              <div className="stat-card" style={{ background: "white" }}>
                <h4>Total Projects</h4><p>{total}</p>
              </div>
              <div className="stat-card" style={{ background: "white" }}>
                <h4>Planning</h4><p>{planning}</p>
              </div>
              <div className="stat-card" style={{ background: "white" }}>
                <h4>In Progress</h4><p>{progress}</p>
              </div>
              <div className="stat-card" style={{ background: "white" }}>
                <h4>Completed</h4><p>{completed}</p>
              </div>
              <div className="stat-card" style={{ background: "white" }}>
                <h4>Total Budget</h4><p>₹ {budget}</p>
              </div>
            </div>
            <div className="chart-box" style={{ background: "white" }}>
              <ProjectCharts projects={projects} />
            </div>
          </>
        )}

        {/* ADD PROJECT */}
        {activeTab === "add" && (
          <div className="section-box">
            <AddProject onAdd={fetchProjects} />
          </div>
        )}

        {/* PROJECTS */}
        {activeTab === "projects" && (
          <>
            <div className="dashboard-controls">
              <input
                placeholder="Search projects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="filter-btns">
                {["All", "Planning", "In Progress", "Completed"].map((s) => (
                  <button
                    key={s}
                    className={filterStatus === s ? "filter-active" : "filter-btn"}
                    onClick={() => setFilterStatus(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highbudget">Budget: High to Low</option>
                <option value="lowbudget">Budget: Low to High</option>
              </select>
            </div>

            {editingProject && (
              <div className="edit-inline-wrapper">
                <EditProject
                  project={editingProject}
                  onClose={() => setEditingProject(null)}
                  onUpdated={() => {
                    fetchProjects();
                    setEditingProject(null);
                    toast.success("Project updated! ✅");
                  }}
                />
              </div>
            )}

            <p style={{ color: "#8fad9f", fontSize: "13px", marginBottom: "10px" }}>
              Showing {filtered.length} of {total} projects
            </p>

            <div className="project-grid">
              {filtered.length === 0 ? (
                <p style={{ color: "#8fad9f" }}>No projects found.</p>
              ) : (
                filtered.map((p) => (
                  <div className="project-card" key={p._id}>
                    {p.image ? (
                      <img
                        src={`http://localhost:5000/uploads/${p.image}`}
                        alt={p.title}
                        style={{ width: "100%", height: "160px", objectFit: "cover", borderRadius: "12px", marginBottom: "12px", cursor: "pointer" }}
                        onClick={() => navigate(`/user/project/${p._id}`)}
                      />
                    ) : (
                      <div
                        onClick={() => navigate(`/user/project/${p._id}`)}
                        style={{ width: "100%", height: "160px", borderRadius: "12px", marginBottom: "12px", background: "linear-gradient(135deg, #f5ede0, #ede0cc)", display: "flex", alignItems: "center", justifyContent: "center", color: "#8fad9f", fontSize: "14px", cursor: "pointer" }}
                      >
                        🏠 No Image
                      </div>
                    )}
                    <h4 style={{ cursor: "pointer" }} onClick={() => navigate(`/user/project/${p._id}`)}>
                      {p.title}
                    </h4>
                    <p className="project-desc">{p.description}</p>
                    <div className="project-meta">
                      <span>₹ {p.budget}</span>
                      <span className={`status ${p.status.replace(" ", "").toLowerCase()}`}>{p.status}</span>
                    </div>
                    <div className="actions">
                      <button className="edit-btn" onClick={() => { setEditingProject(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Edit</button>
                      <button className="danger" onClick={() => handleDelete(p._id)}>Delete</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* PROFILE */}
        {activeTab === "profile" && (
          <div style={{ maxWidth: "100%" }}>
            {/* PROFILE CARD */}
            <div style={{
              background: "white",
              border: "1px solid rgba(143,173,159,0.2)",
              borderTop: "3px solid #7a3b1e",
              borderRadius: "20px",
              padding: "36px 30px",
              textAlign: "center",
              marginBottom: "20px",
              boxShadow: "0 4px 20px rgba(45,74,62,0.08)",
            }}>
              <div style={{
                width: "72px", height: "72px", background: "#7a3b1e",
                borderRadius: "50%", display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: "28px", margin: "0 auto 14px",
                color: "white", fontWeight: "bold", fontFamily: "'Playfair Display', serif",
              }}>
                {userName?.charAt(0).toUpperCase()}
              </div>
              <h2 style={{ color: "#2d4a3e", margin: "0 0 6px", fontFamily: "'Playfair Display', serif", fontSize: "22px" }}>
                {user?.name}
              </h2>
              <p style={{ color: "#8fad9f", margin: "0 0 4px", fontSize: "14px" }}>{user?.email}</p>
              <span style={{
                display: "inline-block", marginTop: "10px",
                background: "#2d4a3e", color: "white",
                padding: "4px 16px", borderRadius: "30px",
                fontSize: "11px", fontWeight: "600", letterSpacing: "1px",
              }}>
                {user?.role === "admin" ? "👑 Admin" : "👤 User"}
              </span>
            </div>

            {/* STATS */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "20px" }}>
              {[
                { label: "Total Projects", value: total },
                { label: "Completed", value: completed },
                { label: "Ongoing", value: progress },
                { label: "Total Budget", value: `₹ ${budget}` },
              ].map((s) => (
                <div key={s.label} style={{
                  background: "white",
                  border: "1px solid rgba(143,173,159,0.2)",
                  borderLeft: "3px solid #7a3b1e",
                  borderRadius: "14px",
                  padding: "20px",
                  textAlign: "center",
                  boxShadow: "0 4px 15px rgba(45,74,62,0.06)",
                  transition: "all 0.3s ease",
                }}>
                  <p style={{ color: "#8fad9f", margin: "0 0 8px", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1.5px", fontFamily: "'Jost', sans-serif" }}>
                    {s.label}
                  </p>
                  <p style={{ color: "#7a3b1e", fontWeight: "bold", fontSize: "22px", margin: 0, fontFamily: "'Playfair Display', serif" }}>
                    {s.value}
                  </p>
                </div>
              ))}
            </div>

            {/* CHANGE PASSWORD */}
            <div style={{
              background: "white",
              border: "1px solid rgba(143,173,159,0.2)",
              borderRadius: "16px",
              padding: "22px",
              boxShadow: "0 4px 15px rgba(45,74,62,0.06)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h4 style={{ margin: 0, color: "#2d4a3e", fontFamily: "'Playfair Display', serif" }}>🔒 Change Password</h4>
                <button
                  onClick={() => setShowPasswordForm(!showPasswordForm)}
                  style={{ background: "transparent", border: "1.5px solid #2d4a3e", color: "#2d4a3e", padding: "6px 14px", borderRadius: "20px", cursor: "pointer", fontSize: "12px", fontFamily: "'Jost', sans-serif" }}
                >
                  {showPasswordForm ? "Cancel" : "Change"}
                </button>
              </div>
              {showPasswordForm && (
                <form onSubmit={handlePasswordChange} style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
                  {["Current Password", "New Password", "Confirm New Password"].map((label, i) => (
                    <input
                      key={i} type="password" placeholder={label}
                      value={Object.values(passwordForm)[i]}
                      onChange={(e) => {
                        const keys = ["current", "newPass", "confirm"];
                        setPasswordForm({ ...passwordForm, [keys[i]]: e.target.value });
                      }}
                      required
                      style={{ background: "#faf6f0", border: "1.5px solid #ede0cc", borderRadius: "10px", padding: "10px 14px", color: "#1e2d27", fontSize: "13px", outline: "none", fontFamily: "'Jost', sans-serif" }}
                    />
                  ))}
                  <button type="submit" style={{ background: "linear-gradient(135deg, #7a3b1e, #9a4f2a)", border: "none", borderRadius: "10px", padding: "11px", fontWeight: "bold", cursor: "pointer", color: "white", fontFamily: "'Jost', sans-serif", fontSize: "13px" }}>
                    Update Password
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;