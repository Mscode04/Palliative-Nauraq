import React, { useState, useEffect } from "react";
import { db } from "../Firebase/config"; // Your Firebase config file
import { collection, getDocs } from "firebase/firestore";
import "./Home.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom";

function Home() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLogout = () => {
    navigate("/logout");
  };

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const reportsRef = collection(db, "Reports");
        const currentDate = new Date();
        const startOfToday = new Date(currentDate.setHours(0, 0, 0, 0));
        const endOfToday = new Date(currentDate.setHours(23, 59, 59, 999));

        const reportsSnapshot = await getDocs(reportsRef);
        const reportsData = reportsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const filteredReports = reportsData.filter((report) => {
          const reportDate = new Date(report.submittedAt);
          return reportDate >= startOfToday && reportDate <= endOfToday;
        });

        setReports(filteredReports);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const getReportDetailsRoute = (formType, reportId) => {
    switch (formType) {
      case "NHC":
        return `/main/reportsdetailnhc/${reportId}`;
      case "NHC(E)":
        return `/main/reportsdetailnhce/${reportId}`;
      case "DHC":
        return `/main/report-details-dhc/${reportId}`;
      case "PROGRESSION REPORT":
        return `/main/report-details-progression/${reportId}`;
      case "SOCIAL REPORT":
        return `/main/report-details-social/${reportId}`;
      case "VHC":
        return `/main/report-details-vhc/${reportId}`;
      case "GVHC":
        return `/main/report-details-vhc/${reportId}`;
      case "INVESTIGATION":
        return `/main/report-details-investigation/${reportId}`;
      case "DEATH":
        return `/main/report-details-death/${reportId}`;
      default:
        return `/main/report-details-default/${reportId}`;
    }
  };

  return (
    <div className="HomeApp">
      {/* Topbar */}
      <header className="HomeTopbar">
        <button className="btn btn-transparent" onClick={toggleDrawer}>
          <i className="bi bi-list"></i>
        </button>
      </header>

      {/* Drawer */}
      <div className={`HomeDrawer ${drawerOpen ? "open" : ""}`}>
        <button className="HomeDrawerCloseButton" onClick={toggleDrawer}>
          <i className="bi bi-arrow-left"></i>
        </button>
        <div className="drawer-content">
          <button className="HomeDrawerButton">Contact Us</button>
          <button className="HomeDrawerButton btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Banner Section */}
      <div className="HomeBanner">
        <h1>NURSES</h1>
        <div className="HomeBannerButtons">
          <Link to="/main/addpt" className="HomeBannerButton">
            Register New Patients
          </Link>
          <Link to="/main/allrepots" className="HomeBannerButton">
            Patients Reports
          </Link>
        </div>
      </div>

      {/* Reports Section */}
      <div className="HomeReports">
        <h4 className="HomeReportsTitle">Reports From Today</h4>
        {loading ? (
          <p>Loading reports...</p>
        ) : reports.length === 0 ? (
          <p>No reports found for today.</p>
        ) : (
          <div className="HomeReportsCards">
            {reports.map((report) => (
              <Link
                to={getReportDetailsRoute(report.formType, report.id)}
                className="HomeReportCardLink"
                key={report.id}
              >
                <div className="HomeReportCard">
                  <i className="bi bi-person-circle HomeReportIcon"></i>
                  <div className="HomeReportInfo">
                    <h5>{report.formType} : {report.name} </h5>
                    <p></p>
                    <small>{new Date(report.submittedAt).toLocaleString()}</small>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;