import React, { useState, useEffect } from "react";
import { db } from "../Firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import "./ReportDetailsVHC.css"; // Import the CSS file

const ReportDetailsVHC = () => {
  const { reportId } = useParams(); // Get reportId from URL
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // Use useNavigate

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        setError(null);

        const reportRef = doc(db, "Reports", reportId);
        const reportSnapshot = await getDoc(reportRef);

        if (reportSnapshot.exists()) {
          console.log("Report data:", reportSnapshot.data());
          setReport(reportSnapshot.data());
        } else {
          console.log("No report found with ID:", reportId);
          setError("Report not found.");
        }
      } catch (error) {
        console.error("Error fetching report: ", error);
        setError("Failed to load report. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [reportId]);

  const goBack = () => {
    navigate(-1); // Go back to the previous page
  };

  const goToUpdate = () => {
    navigate(`/main/update-vhc/${reportId}`); // Navigate to the UpdateVHC component
  };

  if (loading) {
    return          <div className="loading-container">
    <img
      src="https://media.giphy.com/media/YMM6g7x45coCKdrDoj/giphy.gif"
      alt="Loading..."
      className="loading-image"
    />
  </div>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!report) {
    return <p>No report found.</p>;
  }

  return (
    <div className="rvhc-container">
      <button className="rvhc-back-button" onClick={goBack}>
        &larr; Back
      </button>
      <h2 className="rvhc-title">VHC Report Details</h2>
      <div className="rvhc-content">
        {/* Personal Details */}
        <h3 className="rvhc-section-title">Personal Details</h3>
        <div className="rvhc-field">
          <label>Patient Name:</label>
          <span>{report.name || "N/A"}</span>
        </div>
        <div className="rvhc-field">
          <label>Age:</label>
          <span>{report.age || "N/A"}</span>
        </div>
        <div className="rvhc-field">
          <label>Gender:</label>
          <span>{report.gender || "N/A"}</span>
        </div>
        <div className="rvhc-field">
          <label>Date of Birth:</label>
          <span>{report.dob || "N/A"}</span>
        </div>
        <div className="rvhc-field">
          <label>Address:</label>
          <span>{report.address || "N/A"}</span>
        </div>
        <div className="rvhc-field">
          <label>Email:</label>
          <span>{report.email || "N/A"}</span>
        </div>
        <div className="rvhc-field">
          <label>Patient ID:</label>
          <span>{report.patientId || "N/A"}</span>
        </div>

        {/* Team Details */}
        <h3 className="rvhc-section-title">Team Details</h3>
        <div className="rvhc-field">
          <label>Team 1:</label>
          <span>{report.team1 || "N/A"}</span>
        </div>
        <div className="rvhc-field">
          <label>Team 2:</label>
          <span>{report.team2 || "N/A"}</span>
        </div>
        <div className="rvhc-field">
          <label>Team 3:</label>
          <span>{report.team3 || "N/A"}</span>
        </div>
        <div className="rvhc-field">
          <label>Team 4:</label>
          <span>{report.team4 || "N/A"}</span>
        </div>
        <div className="rvhc-field">
          <label>Other Team Members:</label>
          <span>{report.otherTeamMembers || "N/A"}</span>
        </div>

        {/* Disease Information */}
        <h3 className="rvhc-section-title">Disease Information</h3>
        <div className="rvhc-field">
          <label>Disease Information:</label>
          <span>{report.diseaseInformation || "N/A"}</span>
        </div>

        {/* Patient Condition */}
        <h3 className="rvhc-section-title">Patient Condition</h3>
        <div className="rvhc-field">
          <label>Patient Condition:</label>
          <span>{report.patientCondition || "N/A"}</span>
        </div>

        {/* Financial Situation */}
        <h3 className="rvhc-section-title">Financial Situation</h3>
        {Object.keys(report.financialSituation || {}).map((field) => (
          <div className="rvhc-field" key={field}>
            <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
            <span>{report.financialSituation[field] ? "Yes" : "No"}</span>
          </div>
        ))}

        {/* Welfare Schemes */}
        <h3 className="rvhc-section-title">Welfare Schemes</h3>
        <div className="rvhc-field">
          <label>Ration Card Number:</label>
          <span>{report.welfareSchemes?.rationCardNumber || "N/A"}</span>
        </div>
        <div className="rvhc-field">
          <label>Ration Card Type:</label>
          <span>{report.welfareSchemes?.rationCardType || "N/A"}</span>
        </div>
        <div className="rvhc-field">
          <label>Financial Status:</label>
          <span>{report.welfareSchemes?.financialStatus || "N/A"}</span>
        </div>

        {/* Government Welfare Schemes */}
        <h4 className="rvhc-subsection-title">Government</h4>
        {Object.keys(report.welfareSchemes?.government || {}).map((field) => (
          <div className="rvhc-field" key={field}>
            <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
            <span>{report.welfareSchemes.government[field] ? "Yes" : "No"}</span>
          </div>
        ))}

        {/* Non-Government Welfare Schemes */}
        <h4 className="rvhc-subsection-title">Non-Government</h4>
        {Object.keys(report.welfareSchemes?.nonGovernment || {}).map((field) => (
          <div className="rvhc-field" key={field}>
            <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
            <span>{report.welfareSchemes.nonGovernment[field] ? "Yes" : "No"}</span>
          </div>
        ))}

        {/* Other Agencies */}
        <h4 className="rvhc-subsection-title">Other Agencies</h4>
        {Object.keys(report.welfareSchemes?.otherAgencies || {}).map((field) => (
          <div className="rvhc-field" key={field}>
            <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
            <span>{report.welfareSchemes.otherAgencies[field] ? "Yes" : "No"}</span>
          </div>
        ))}

        {/* Welfare Benefits */}
        <h3 className="rvhc-section-title">Welfare Benefits</h3>
        {report.welfareBenefits?.map((benefit, index) => (
          <div key={index} className="rvhc-field">
            <label>Full Name:</label>
            <span>{benefit.fullName || "N/A"}</span>
            <label>Phone No:</label>
            <span>{benefit.phoneNo || "N/A"}</span>
            <label>Relation:</label>
            <span>{benefit.relation || "N/A"}</span>
            <label>Ways to Help:</label>
            <span>{benefit.waysToHelp || "N/A"}</span>
          </div>
        ))}

        {/* Physical Condition */}
        <h3 className="rvhc-section-title">Physical Condition</h3>
        {Object.keys(report.physicalCondition || {}).map((field) => (
          <div className="rvhc-field" key={field}>
            <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
            <span>{report.physicalCondition[field] ? "Yes" : "No"}</span>
          </div>
        ))}

        {/* Home Care Conditions */}
        <h3 className="rvhc-section-title">Home Care Conditions</h3>
        {Object.keys(report.homeCareConditions || {}).map((field) => (
          <div className="rvhc-field" key={field}>
            <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
            <span>{report.homeCareConditions[field] ? "Yes" : "No"}</span>
          </div>
        ))}

        {/* Mental Difficulties */}
        <h3 className="rvhc-section-title">Mental Difficulties</h3>
        <div className="rvhc-field">
          <label>Mental Difficulties:</label>
          <span>{report.mentalDifficulties || "N/A"}</span>
        </div>

        {/* Learned from Family */}
        <h3 className="rvhc-section-title">Learned from Family</h3>
        <div className="rvhc-field">
          <label>Learned from Family:</label>
          <span>{report.learnedFromFamily || "N/A"}</span>
        </div>

        {/* Volunteer Suggestions */}
        <h3 className="rvhc-section-title">Volunteer Suggestions</h3>
        <div className="rvhc-field">
          <label>Volunteer Suggestions:</label>
          <span>{report.volunteerSuggestions || "N/A"}</span>
        </div>

        {/* Care Summary */}
        <h3 className="rvhc-section-title">Care Summary</h3>
        <div className="rvhc-field">
          <label>Home Care:</label>
          <span>{report.careSummary?.homeCare || "N/A"}</span>
        </div>
        <div className="rvhc-field">
          <label>Activity Items:</label>
          <span>{report.careSummary?.activityItems || "N/A"}</span>
        </div>
        <div className="rvhc-field">
          <label>Remarks:</label>
          <span>{report.careSummary?.remarks || "N/A"}</span>
        </div>

        {/* Volunteer Details */}
        <h3 className="rvhc-section-title">Volunteer Details</h3>
        <div className="rvhc-field">
          <label>Volunteer Name:</label>
          <span>{report.volunteerName || "N/A"}</span>
        </div>
        <div className="rvhc-field">
          <label>Volunteer Phone:</label>
          <span>{report.volunteerPhone || "N/A"}</span>
        </div>
        <div className="rvhc-field">
          <label>Visit Date:</label>
          <span>{report.visitDate || "N/A"}</span>
        </div>
        <div className="rvhc-field">
          <label>Visit Time:</label>
          <span>{report.visitTime || "N/A"}</span>
        </div>

        {/* Volunteer Plan */}
        <h3 className="rvhc-section-title">Volunteer Plan</h3>
        {Object.keys(report.volunteerPlan || {}).map((field) => (
          <div className="rvhc-field" key={field}>
            <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
            <span>{report.volunteerPlan[field] ? "Yes" : "No"}</span>
          </div>
        ))}
      </div>
      <button className="rvhc-update-button" onClick={goToUpdate}>
        Update Report
      </button>
    </div>
  );
};

export default ReportDetailsVHC;