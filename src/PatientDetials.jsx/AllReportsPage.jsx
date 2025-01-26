import React, { useState, useEffect } from "react";
import { db } from "../Firebase/config";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import "./AllReportsPage.css";

const AllReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nameFilter, setNameFilter] = useState("");
  const [formTypeFilter, setFormTypeFilter] = useState("");
  const [addressFilter, setAddressFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 10;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        setError(null);

        const reportsRef = collection(db, "Reports");
        let q = query(reportsRef);

        if (nameFilter) {
          q = query(q, where("name", ">=", nameFilter), where("name", "<=", nameFilter + "\uf8ff"));
        }
        if (formTypeFilter) {
          q = query(q, where("formType", "==", formTypeFilter));
        }
        if (addressFilter) {
          q = query(q, where("address", ">=", addressFilter), where("address", "<=", addressFilter + "\uf8ff"));
        }

        const querySnapshot = await getDocs(q);
        let reportsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (startDate || endDate) {
          const startDateObj = startDate ? new Date(startDate) : null;
          const endDateObj = endDate ? new Date(endDate) : null;
          if (endDateObj) {
            endDateObj.setHours(23, 59, 59, 999);
          }

          reportsData = reportsData.filter((report) => {
            const submittedAtDate = new Date(report.submittedAt);
            if (startDateObj && submittedAtDate < startDateObj) return false;
            if (endDateObj && submittedAtDate > endDateObj) return false;
            return true;
          });
        }

        setReports(reportsData);
      } catch (error) {
        console.error("Error fetching reports: ", error);
        setError("Failed to load reports. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [nameFilter, formTypeFilter, addressFilter, startDate, endDate]);

  const handleBackClick = () => {
    navigate(-1);
  };

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

  // Pagination logic
  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = reports.slice(indexOfFirstReport, indexOfLastReport);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="AllRep-container">
      <button onClick={handleBackClick} className="AllRep-back-button">
        &larr; Back
      </button>
      <h2 className="AllRep-heading">All Reports</h2>

      {/* Filters */}
      <div className="AllRep-filters-container">
        <input
          type="text"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          placeholder="Search by Name"
          className="AllRep-filter-input"
        />
        <select
          value={formTypeFilter}
          onChange={(e) => setFormTypeFilter(e.target.value)}
          className="AllRep-filter-select"
        >
          <option value="">Select Form Type</option>
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
        <input
          type="text"
          value={addressFilter}
          onChange={(e) => setAddressFilter(e.target.value)}
          placeholder="Search by Address"
          className="AllRep-filter-input"
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          placeholder="Start Date"
          className="AllRep-filter-input"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          placeholder="End Date"
          className="AllRep-filter-input"
        />
      </div>

      {loading ? (
        <p className="AllRep-loading">Loading reports...</p>
      ) : error ? (
        <p className="AllRep-error">{error}</p>
      ) : reports.length === 0 ? (
        <p className="AllRep-no-reports">No reports found.</p>
      ) : (
        <>
          <div className="AllRep-reports-list">
            {currentReports.map((report) => (
              <div key={report.id} className="AllRep-report-item">
                <Link
                  to={getReportDetailsRoute(report.formType, report.id)}
                  className="AllRep-report-link"
                >
                  <h3 className="AllRep-report-title">{report.formType || "Report Title"}</h3>
                  <p className="AllRep-report-date">
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
                  <p className="AllRep-report-name">{report.name || "No Name"}</p>
                  <p className="AllRep-report-address">{report.address || "No Address"}</p>
                </Link>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="AllRep-pagination">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="AllRep-pagination-button"
            >
              Previous
            </button>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={indexOfLastReport >= reports.length}
              className="AllRep-pagination-button"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AllReportsPage;