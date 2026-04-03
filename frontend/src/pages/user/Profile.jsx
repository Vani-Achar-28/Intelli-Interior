import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import toast from "react-hot-toast";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [passwordForm, setPasswordForm] = useState({ current: "", newPass: "", confirm: "" });
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    setUser(u);
    const fetchProjects = async () => {
      const res = await API.get("/projects");
      setProjects(res.data);
    };
    fetchProjects();
  }, []);

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

  if (!user) return <p style={{ color: "#2d4a3e", padding: "40px" }}>Loading...</p>;

  const joined = new Date(user.createdAt || Date.now()).toLocaleDateString("en-IN", {
    year: "numeric", month: "long", day: "numeric"
  });

  const total = projects.length;
  const completed = projects.filter((p) => p.status === "Completed").length;
  const ongoing = projects.filter((p) => p.status === "In Progress").length;
  const budget = projects.reduce((s, p) => s + Number(p.budget || 0), 0);

  return (
    <div style={{ maxWidth: "700px", margin: "40px auto", padding: "20px", fontFamily: "'Jost', sans-serif" }}>

      {/* BACK BUTTON */}
      <button
        onClick={() => navigate("/user/dashboard")}
        style={{
          background: "transparent",
          border: "1.5px solid #2d4a3e",
          color: "#2d4a3e",
          padding: "8px 20px",
          borderRadius: "30px",
          cursor: "pointer",
          marginBottom: "28px",
          fontSize: "13px",
          letterSpacing: "0.5px",
          fontFamily: "'Jost', sans-serif",
        }}
      >
        ← Back to Dashboard
      </button>

      {/* PROFILE CARD */}
      <div style={{
        background: "white",
        border: "1px solid rgba(143,173,159,0.2)",
        borderRadius: "20px",
        padding: "36px 30px",
        textAlign: "center",
        marginBottom: "20px",
        boxShadow: "0 4px 20px rgba(45,74,62,0.08)",
      }}>
        <div style={{
          width: "80px", height: "80px",
          background: "#7a3b1e",
          borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "32px", margin: "0 auto 16px",
          color: "white", fontWeight: "bold",
          fontFamily: "'Playfair Display', serif",
          boxShadow: "0 4px 15px rgba(122,59,30,0.3)",
        }}>
          {user.name?.charAt(0).toUpperCase()}
        </div>
        <h2 style={{ color: "#2d4a3e", margin: "0 0 8px", fontFamily: "'Playfair Display', serif", fontSize: "24px" }}>
          {user.name}
        </h2>
        <p style={{ color: "#8fad9f", margin: "0 0 4px", fontSize: "14px" }}>{user.email}</p>
        <p style={{ color: "#aaa", fontSize: "13px", margin: "4px 0 12px" }}>
          🗓️ Member since {joined}
        </p>
        <span style={{
          display: "inline-block",
          background: user.role === "admin" ? "#7a3b1e" : "#2d4a3e",
          color: "white",
          padding: "5px 18px",
          borderRadius: "30px",
          fontSize: "12px",
          fontWeight: "600",
          letterSpacing: "1px",
        }}>
          {user.role === "admin" ? "👑 Admin" : "👤 User"}
        </span>
      </div>

      {/* STATS */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
        {[
          { label: "Total Projects", value: total },
          { label: "Completed", value: completed },
          { label: "Ongoing", value: ongoing },
          { label: "Total Budget", value: `₹ ${budget}` },
        ].map((s) => (
          <div key={s.label} style={{
            background: "white",
            border: "1px solid rgba(143,173,159,0.2)",
            borderRadius: "16px",
            padding: "20px",
            textAlign: "center",
            boxShadow: "0 4px 15px rgba(45,74,62,0.06)",
          }}>
            <p style={{ color: "#8fad9f", margin: "0 0 8px", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>
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
        padding: "24px",
        boxShadow: "0 4px 15px rgba(45,74,62,0.06)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h4 style={{ margin: 0, color: "#2d4a3e", fontFamily: "'Playfair Display', serif", fontSize: "18px" }}>
            🔒 Change Password
          </h4>
          <button
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            style={{
              background: "transparent",
              border: "1.5px solid #2d4a3e",
              color: "#2d4a3e",
              padding: "6px 16px",
              borderRadius: "20px",
              cursor: "pointer",
              fontSize: "13px",
              fontFamily: "'Jost', sans-serif",
            }}
          >
            {showPasswordForm ? "Cancel" : "Change"}
          </button>
        </div>

        {showPasswordForm && (
          <form onSubmit={handlePasswordChange} style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
            {["Current Password", "New Password", "Confirm New Password"].map((label, i) => (
              <input
                key={i}
                type="password"
                placeholder={label}
                value={Object.values(passwordForm)[i]}
                onChange={(e) => {
                  const keys = ["current", "newPass", "confirm"];
                  setPasswordForm({ ...passwordForm, [keys[i]]: e.target.value });
                }}
                required
                style={{
                  background: "#faf6f0",
                  border: "1.5px solid #ede0cc",
                  borderRadius: "10px",
                  padding: "11px 14px",
                  color: "#1e2d27",
                  fontSize: "14px",
                  outline: "none",
                  fontFamily: "'Jost', sans-serif",
                }}
              />
            ))}
            <button type="submit" style={{
              background: "linear-gradient(135deg, #7a3b1e, #9a4f2a)",
              border: "none",
              borderRadius: "10px",
              padding: "12px",
              fontWeight: "bold",
              cursor: "pointer",
              color: "white",
              fontFamily: "'Jost', sans-serif",
              fontSize: "14px",
              letterSpacing: "0.5px",
            }}>
              Update Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Profile;