import { useEffect, useState } from "react";
import {
  getAdminDashboard,
  deleteUserByAdmin,
  deleteProjectByAdmin,
  updateProjectStatus,
} from "../../services/api";
import "../../styles/adminDashboard.css";
import AdminCharts from "../../components/AdminCharts";

function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const adminUser = JSON.parse(localStorage.getItem("user"));
  const adminName = adminUser?.name || "Admin";

  const fetchDashboard = async () => {
    try {
      const res = await getAdminDashboard();
      setData(res.data);
    } catch (err) {
      console.error("Admin dashboard error:", err);
      alert("Failed to load admin dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDashboard(); }, []);

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh", background: "#faf6f0" }}>
      <p style={{ fontFamily: "Jost, sans-serif", color: "#7a3b1e", fontSize: "16px", letterSpacing: "0.1em" }}>Loading...</p>
    </div>
  );
  if (!data) return <p style={{ color: "red" }}>No data</p>;

  const SIDEBAR_ITEMS = [
    { id: "overview", icon: "📊", label: "Overview" },
    { id: "users", icon: "👥", label: "Users" },
    { id: "projects", icon: "🏠", label: "Projects" },
    { id: "profile", icon: "👑", label: "Profile" },
  ];

  return (
    <div className="dashboard-layout">

      {/* SIDEBAR */}
      <div className="sidebar">
        <div className="sidebar-user">
          <div className="sidebar-avatar">
            {adminName?.charAt(0).toUpperCase()}
          </div>
          <p className="sidebar-name">{adminName}</p>
          <p className="sidebar-role">Admin</p>
        </div>
        <nav className="sidebar-nav">
          {SIDEBAR_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`sidebar-item ${activeTab === item.id ? "sidebar-active" : ""}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* MAIN CONTENT */}
      <div className="dashboard-main">

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <>
            <h3 className="welcome">Admin Dashboard</h3>
            <div className="stats">
              <div className="stat-card" style={{ background: "white" }}>
                <h4>Total Users</h4><p>{data.totalUsers}</p>
              </div>
              <div className="stat-card" style={{ background: "white" }}>
                <h4>Total Projects</h4><p>{data.totalProjects}</p>
              </div>
              <div className="stat-card" style={{ background: "white" }}>
                <h4>Total Budget</h4><p>₹ {data.totalBudget?.toLocaleString()}</p>
              </div>
              <div className="stat-card" style={{ background: "white" }}>
                <h4>Completed</h4><p>{data.completedProjects}</p>
              </div>
              <div className="stat-card" style={{ background: "white" }}>
                <h4>Ongoing</h4><p>{data.ongoingProjects}</p>
              </div>
            </div>

            {/* NO wrapper div — charts render directly */}
            <AdminCharts
              stats={{
                users: data.totalUsers,
                projects: data.totalProjects,
                completed: data.completedProjects,
                ongoing: data.ongoingProjects,
                planning: data.totalProjects - data.completedProjects - data.ongoingProjects,
              }}
            />
          </>
        )}

        {/* USERS */}
        {activeTab === "users" && (
          <>
            <h3 className="welcome">👥 All Users</h3>
            <div className="admin-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.users.length === 0 && (
                    <tr><td colSpan="4">No users found</td></tr>
                  )}
                  {data.users.map((u) => (
                    <tr key={u._id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td style={{ textTransform: "capitalize" }}>{u.role}</td>
                      <td>
                        {u.role !== "admin" && (
                          <button
                            className="admin-danger-btn"
                            onClick={async () => {
                              if (window.confirm("Delete user?")) {
                                await deleteUserByAdmin(u._id);
                                fetchDashboard();
                              }
                            }}
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* PROJECTS */}
        {activeTab === "projects" && (
          <>
            <h3 className="welcome">🏠 All Projects</h3>
            <div className="admin-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Owner</th>
                    <th>Budget</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.projects.length === 0 && (
                    <tr><td colSpan="5">No projects found</td></tr>
                  )}
                  {data.projects.map((p) => (
                    <tr key={p._id}>
                      <td>{p.title}</td>
                      <td>{p.user?.name || "N/A"}</td>
                      <td>₹ {p.budget?.toLocaleString()}</td>
                      <td>
                        <select
                          value={p.status}
                          onChange={async (e) => {
                            await updateProjectStatus(p._id, { status: e.target.value });
                            fetchDashboard();
                          }}
                        >
                          <option value="Planning">Planning</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </td>
                      <td>
                        <button
                          className="admin-danger-btn"
                          onClick={async () => {
                            if (window.confirm("Delete project?")) {
                              await deleteProjectByAdmin(p._id);
                              fetchDashboard();
                            }
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* PROFILE */}
        {activeTab === "profile" && (
          <>
            <h3 className="welcome"> Admin Profile</h3>
            <div style={{ maxWidth: "100%" }}>
              <div style={{
                background: "white",
                border:  "1px solid rgba(143,173,159,0.2)", background: "white",
                borderLeft: "3px solid #7a3b1e",
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
                  {adminName?.charAt(0).toUpperCase()}
                </div>
                <h2 style={{ color: "#2d4a3e", margin: "0 0 6px", fontFamily: "'Playfair Display', serif", fontSize: "22px" }}>
                  {adminUser?.name}
                </h2>
                <p style={{ color: "#8fad9f", margin: "0 0 4px", fontSize: "14px" }}>{adminUser?.email}</p>
                <span style={{
                  display: "inline-block", marginTop: "10px",
                  background: "#2d4a3e", color: "white",
                  padding: "4px 16px", borderRadius: "30px",
                  fontSize: "11px", fontWeight: "600", letterSpacing: "1px",
                }}>
                  👑 Admin
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                {[
                  { label: "Total Users", value: data.totalUsers },
                  { label: "Total Projects", value: data.totalProjects },
                  { label: "Completed", value: data.completedProjects },
                  { label: "Total Budget", value: `₹ ${data.totalBudget?.toLocaleString()}` },
                ].map((s) => (
                  <div key={s.label} style={{
                    background: "white",
                    border: "1px solid rgba(143,173,159,0.2)",
                    borderLeft: "3px solid #7a3b1e",
                    borderRadius: "14px",
                    padding: "20px",
                    textAlign: "center",
                    boxShadow: "0 4px 15px rgba(45,74,62,0.06)",
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
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default AdminDashboard;