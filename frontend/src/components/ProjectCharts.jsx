function ProjectCharts({ projects }) {
  const planning = projects.filter(p => p.status === "Planning").length;
  const progress = projects.filter(p => p.status === "In Progress").length;
  const completed = projects.filter(p => p.status === "Completed").length;

  const max = Math.max(planning, progress, completed, 1);

  // Category count
  const categories = ["Living Room", "Bedroom", "Kitchen", "Office", "Commercial"];
  const categoryData = categories.map(cat => ({
    name: cat,
    count: projects.filter(p => p.category === cat).length
  }));

  const totalCategoryCount =
    categoryData.reduce((sum, c) => sum + c.count, 0) || 1;

  return (
    <div className="charts-container two-col">
      {/* LEFT: STATUS BARS */}
      <div className="chart-card">
        <h3>Project Status Overview</h3>

        <div className="bar">
          <span>Planning</span>
          <div className="bar-bg">
            <div
              className="bar-fill planning"
              style={{ width: `${(planning / max) * 100}%` }}
            />
          </div>
          <span>{planning}</span>
        </div>

        <div className="bar">
          <span>In Progress</span>
          <div className="bar-bg">
            <div
              className="bar-fill inprogress"
              style={{ width: `${(progress / max) * 100}%` }}
            />
          </div>
          <span>{progress}</span>
        </div>

        <div className="bar">
          <span>Completed</span>
          <div className="bar-bg">
            <div
              className="bar-fill completed"
              style={{ width: `${(completed / max) * 100}%` }}
            />
          </div>
          <span>{completed}</span>
        </div>
      </div>

      {/* RIGHT: CATEGORY DISTRIBUTION */}
      <div className="chart-card">
        <h3>Project Categories</h3>

        <div className="category-list">
          {categoryData.map((cat, i) => (
            <div key={i} className="category-row">
              <span>{cat.name}</span>
              <div className="category-bar-bg">
                <div
                  className="category-bar-fill"
                  style={{
                    width: `${(cat.count / totalCategoryCount) * 100}%`
                  }}
                />
              </div>
              <span>{cat.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProjectCharts;
