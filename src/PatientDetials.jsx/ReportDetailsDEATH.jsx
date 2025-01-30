import React, { useState, useEffect } from "react";
import { db } from "../Firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import "./ReportDetailsDEATH.css"; // Import the CSS file

const ReportDetailsDEATH = () => {
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
    navigate(`/main/update-death/${reportId}`); // Navigate to the UpdateDEATH component
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
    <div className="rdeath-container">
      <button className="rdeath-back-button" onClick={goBack}>
        &larr; Back
      </button>
      <h2 className="rdeath-title">DEATH Report Details</h2>
      <div className="rdeath-content">
        {/* Personal Details */}
        <h3 className="rdeath-section-title">Personal Details</h3>
        <div className="rdeath-field">
          <label>Patient Name:</label>
          <span>{report.name || "N/A"}</span>
        </div>
        <div className="rdeath-field">
          <label>Age:</label>
          <span>{report.age || "N/A"}</span>
        </div>
        <div className="rdeath-field">
          <label>Gender:</label>
          <span>{report.gender || "N/A"}</span>
        </div>
        <div className="rdeath-field">
          <label>Date of Birth:</label>
          <span>{report.dob || "N/A"}</span>
        </div>
        <div className="rdeath-field">
          <label>Address:</label>
          <span>{report.address || "N/A"}</span>
        </div>
        <div className="rdeath-field">
          <label>Email:</label>
          <span>{report.email || "N/A"}</span>
        </div>
        <div className="rdeath-field">
          <label>Patient ID:</label>
          <span>{report.patientId || "N/A"}</span>
        </div>

        {/* Death Details */}
        <h3 className="rdeath-section-title">Death Details</h3>
        <div className="rdeath-field">
          <label>Date of Death:</label>
          <span>{report.date || "N/A"}</span>
        </div>
        <div className="rdeath-field">
          <label>Time of Death:</label>
          <span>{report.timeOfDeath || "N/A"}</span>
        </div>
        <div className="rdeath-field">
          <label>Reason for Death:</label>
          <span>{report.deathReason || "N/A"}</span>
        </div>
        <div className="rdeath-field">
          <label>Visited Hospital:</label>
          <span>{report.visitedHospital || "N/A"}</span>
        </div>
        <div className="rdeath-field">
          <label>Place of Death:</label>
          <span>{report.deathPlace || "N/A"}</span>
        </div>

        {/* Additional Details */}
        <h3 className="rdeath-section-title">Additional Details</h3>
        <div className="rdeath-field">
          <label>Main Diagnosis:</label>
          <span>{report.mainDiagnosis || "N/A"}</span>
        </div>
        <div className="rdeath-field">
          <label>Medical History:</label>
          <span>{report.medicalHistory || "N/A"}</span>
        </div>
        <div className="rdeath-field">
          <label>Current Difficulties:</label>
          <span>{report.currentDifficulties || "N/A"}</span>
        </div>
        <div className="rdeath-field">
          <label>Main Caretaker:</label>
          <span>{report.mainCaretaker || "N/A"}</span>
        </div>
        <div className="rdeath-field">
          <label>Main Caretaker Phone:</label>
          <span>{report.mainCaretakerPhone || "N/A"}</span>
        </div>
        <div className="rdeath-field">
          <label>Neighbour Name:</label>
          <span>{report.neighbourName || "N/A"}</span>
        </div>
        <div className="rdeath-field">
          <label>Neighbour Phone:</label>
          <span>{report.neighbourPhone || "N/A"}</span>
        </div>
        <div className="rdeath-field">
          <label>Referral Person:</label>
          <span>{report.referralPerson || "N/A"}</span>
        </div>
        <div className="rdeath-field">
          <label>Referral Phone:</label>
          <span>{report.referralPhone || "N/A"}</span>
        </div>
        <div className="rdeath-field">
          <label>Ward:</label>
          <span>{report.ward || "N/A"}</span>
        </div>
        <div className="rdeath-field">
          <label>Ward Member:</label>
          <span>{report.wardMember || "N/A"}</span>
        </div>
        <div className="rdeath-field">
          <label>Ward Member Phone:</label>
          <span>{report.wardMemberPhone || "N/A"}</span>
        </div>
      </div>
      <button className="rdeath-update-button" onClick={goToUpdate}>
        Update Report
      </button>
    </div>
  );
};

export default ReportDetailsDEATH;