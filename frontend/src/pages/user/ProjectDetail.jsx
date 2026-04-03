import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";

function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      const res = await API.get("/projects");
      const found = res.data.find((p) => p._id === id);
      setProject(found);
    };
    fetchProject();
  }, [id]);

  if (!project) return <p style={{ color: "#2d4a3e", padding: "40px", fontFamily: "'Jost', sans-serif" }}>Loading...</p>;

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", padding: "20px", fontFamily: "'Jost', sans-serif" }}>

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

      {/* BIG IMAGE */}
      {project.image ? (
        <img
          src={`http://localhost:5000/uploads/${project.image}`}
          alt={project.title}
          style={{
            width: "100%",
            height: "380px",
            objectFit: "cover",
            borderRadius: "16px",
            marginBottom: "28px",
            border: "1px solid rgba(143,173,159,0.2)",
            boxShadow: "0 8px 30px rgba(45,74,62,0.12)",
          }}
        />
      ) : (
        <div style={{
          width: "100%", height: "380px",
          background: "linear-gradient(135deg, #f5ede0, #ede0cc)",
          borderRadius: "16px",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#8fad9f", fontSize: "16px", marginBottom: "28px",
          border: "1px solid rgba(143,173,159,0.2)",
        }}>
          🏠 No Image Available
        </div>
      )}

      {/* TITLE + STATUS */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h2 style={{
          color: "#2d4a3e", margin: 0,
          fontFamily: "'Playfair Display', serif",
          fontSize: "28px", fontWeight: "700",
        }}>
          {project.title}
        </h2>
        <span style={{
          background: project.status === "Completed" ? "#d4f0e0"
            : project.status === "In Progress" ? "#d1eaf5" : "#fef3cd",
          color: project.status === "Completed" ? "#276b45"
            : project.status === "In Progress" ? "#1e6b8a" : "#b07d2e",
          padding: "6px 16px",
          borderRadius: "30px",
          fontSize: "13px",
          fontWeight: "600",
        }}>
          {project.status}
        </span>
      </div>

      {/* DETAILS GRID */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px",
        background: "white", padding: "24px", borderRadius: "16px",
        border: "1px solid rgba(143,173,159,0.2)",
        boxShadow: "0 4px 15px rgba(45,74,62,0.06)",
        marginBottom: "16px",
      }}>
        {[
          { label: "Category", value: project.category, highlight: false },
          { label: "Budget", value: `₹ ${project.budget}`, highlight: true },
          { label: "Interior Style", value: project.style || "Not specified", highlight: false },
          { label: "Created On", value: new Date(project.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" }), highlight: false },
        ].map((item) => (
          <div key={item.label}>
            <p style={{ color: "#8fad9f", margin: "0 0 6px", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>
              {item.label}
            </p>
            <p style={{
              color: item.highlight ? "#7a3b1e" : "#1e2d27",
              fontWeight: "600", margin: 0, fontSize: "15px",
              fontFamily: item.highlight ? "'Playfair Display', serif" : "'Jost', sans-serif",
            }}>
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* DESCRIPTION */}
      {project.description && (
        <div style={{
          background: "white", padding: "24px", borderRadius: "16px",
          border: "1px solid rgba(143,173,159,0.2)",
          boxShadow: "0 4px 15px rgba(45,74,62,0.06)",
        }}>
          <p style={{ color: "#8fad9f", margin: "0 0 10px", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>
            Description
          </p>
          <p style={{ color: "#1e2d27", lineHeight: "1.7", margin: 0, fontSize: "15px" }}>
            {project.description}
          </p>
        </div>
      )}
    </div>
  );
}

export default ProjectDetail;