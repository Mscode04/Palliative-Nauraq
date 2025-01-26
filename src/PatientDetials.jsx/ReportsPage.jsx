import React, { useState, useEffect } from "react";
import { db } from "../Firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useParams, Link, useNavigate } from "react-router-dom";
import "./ReportsPage.css";

const ReportsPage = () => {
  const { patientId } = useParams(); // Get patientId from URL
  const navigate = useNavigate(); // Use useNavigate for navigation in react-router-dom v6
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [typeFilter, setTypeFilter] = useState(""); // Form type filter
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 10;

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        setError(null);

        // Reference to the Reports collection in Firestore
        const reportsRef = collection(db, "Reports");
        let q = query(reportsRef, where("patientId", "==", patientId));

        // Apply filters if present
        if (startDate) {
          q = query(q, where("submittedAt", ">=", new Date(startDate)));
        }
        if (endDate) {
          q = query(q, where("submittedAt", "<=", new Date(endDate)));
        }
        if (typeFilter) {
          q = query(q, where("formType", "==", typeFilter)); // Apply formType filter
        }

        const querySnapshot = await getDocs(q);
        const reportsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setReports(reportsData);
      } catch (error) {
        console.error("Error fetching reports: ", error);
        setError("Failed to load reports. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [patientId, startDate, endDate, typeFilter, currentPage]);

  // Handle pagination logic
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(reports.length / reportsPerPage);
  const currentReports = reports.slice(
    (currentPage - 1) * reportsPerPage,
    currentPage * reportsPerPage
  );

  // Function to determine the route based on formType
  const getReportDetailsRoute = (formType, reportId) => {
    switch (formType) {
      case "NHC":
      case "NHC(E)":
        return `/main/reportsdetailnhc/${reportId}`;
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
    <div className="reports-page-container">
      <div className="back-button-container">
        <button onClick={() => navigate(-1)} className="back-button">
          Back
        </button>
      </div>
      <h2>Reports for Patient ID: {patientId}</h2>

      {/* Filters */}
      <div className="filters-container">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          placeholder="Start Date"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          placeholder="End Date"
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="">Select Type</option>
          <option value="NHC">NHC</option>
          <option value="NHC(E)">NHC(E)</option>
          <option value="DHC">DHC</option>
          <option value="PROGRESSION REPORT">Progression Report</option>
          <option value="SOCIAL REPORT">Social Report</option>
          <option value="VHC">VHC</option>
          <option value="GVHC">GVHC</option>
          <option value="INVESTIGATION">Investigation</option>
          <option value="DEATH">Death</option>
        </select>
      </div>

      {loading ? (
        <p>Loading reports...</p>
      ) : error ? (
        <p>{error}</p>
      ) : currentReports.length === 0 ? (
        <p>No reports found for this patient.</p>
      ) : (
        <div className="reports-list">
          {currentReports.map((report) => (
            <div key={report.id} className="report-item">
              <Link
                to={getReportDetailsRoute(report.formType, report.id)}
                className="report-link"
              >
                <h3>{report.formType || "Report Title"}</h3>
                <p>
                  {report.submittedAt
                    ? new Date(report.submittedAt).toLocaleString("en-US", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        second: "numeric",
                        hour12: true,
                      })
                    : "No date available"}
                </p>
                <p>{report.name || "No Name"}</p>
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="pagination">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>{currentPage}</span>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ReportsPage;