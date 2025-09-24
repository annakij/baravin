import "./Dashboard.css";

const DashboardCard = ({ title, value, color, icon }) => {
    return (
      <div className={`dashboard-card ${color}`}>
        <div className="dashboard-card-content">
          <div className="dashboard-card-icon">{icon}</div>
          <div className="dashboard-card-info">
            <h3>{title}</h3>
            <p>{value}</p>
          </div>
        </div>
      </div>
    );
  };

export default DashboardCard;
