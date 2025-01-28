import React, { useState, useEffect } from "react";
import { db } from "../Firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import "./ReportDetailsNHC.css"; // Import the CSS file

const ReportDetailsNHCE = () => {
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
    navigate(`/main/update-nhce/${reportId}`); // Navigate to the UpdateNHC component
  };

  if (loading) {
    return <p>Loading report details...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!report) {
    return <p>No report found.</p>;
  }

  return (
    <div className="rnhc-container">
      <button className="rnhc-back-button" onClick={goBack}>
        &larr; Back
      </button>
      <h2 className="rnhc-title">NHC (E) Report </h2>
      <div className="rnhc-content">
        {/* Personal Details */}
        <h3 className="rnhc-section-title">Personal Details</h3>
        <div className="rnhc-field">
          <label>Patient Name:</label>
          <span>{report.name || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>Age:</label>
          <span>{report.age || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>Gender:</label>
          <span>{report.gender || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>Date of Birth:</label>
          <span>{report.dob || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>Address:</label>
          <span>{report.address || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>Email:</label>
          <span>{report.email || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>Patient ID:</label>
          <span>{report.patientId || "N/A"}</span>
        </div>

        {/* Medical Details */}
        <h3 className="rnhc-section-title">Medical Details</h3>
        <div className="rnhc-field">
          <label>Main Diagnosis:</label>
          <span>{report.mainDiagnosis || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>Medical History:</label>
          <span>{report.medicalHistory || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>General Status:</label>
          <span>{report.generalStatus || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>Response Status:</label>
          <span>{report.responseStatus || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>Current Difficulties:</label>
          <span>{report.currentDifficulties || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>Medicine Changes:</label>
          <span>{report.medicineChanges || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>Complimentary Rx:</label>
          <span>{report.complimentaryRx || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>Home Care Plan:</label>
          <span>{report.homeCarePlan || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>Home Care Type:</label>
          <span>{report.homeCareType || "N/A"}</span>
        </div>

        {/* Additional Details */}
        <h3 className="rnhc-section-title">Additional Details</h3>
        <div className="rnhc-field">
          <label>Activity Score:</label>
          <span>{report.activityScore || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>Bad Habit:</label>
          <span>{report.badHabit || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>Exercise:</label>
          <span>{report.exercise || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>Exercise Frequency:</label>
          <span>{report.exerciseFrequency || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>Exercise Location:</label>
          <span>{report.exerciseLocation || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>Exercise Time:</label>
          <span>{report.exerciseTime || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>Entertainment Time:</label>
          <span>{report.entertainmentTime || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>Other Activities:</label>
          <span>{report.otherActivities || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>Special Care Areas:</label>
          <span>{report.specialCareAreas || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>Summary Discussion:</label>
          <span>{report.summaryDiscussion || "N/A"}</span>
        </div>

        {/* Cleanliness and Hygiene */}
        <h3 className="rnhc-section-title">Cleanliness and Hygiene</h3>
        <div className="rnhc-field">
          <label>House Cleanliness:</label>
          <span>{report.houseCleanliness || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>Bedroom Cleanliness:</label>
          <span>{report.bedroomCleanliness || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>Bed Cleanliness:</label>
          <span>{report.bedCleanliness || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>Surroundings Cleanliness:</label>
          <span>{report.surroundingsCleanliness || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>Dress Cleanliness:</label>
          <span>{report.dressCleanliness || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>Self Hygiene:</label>
          <span>{report.selfHygiene || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>Hair:</label>
          <span>{report.hair || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>Skin:</label>
          <span>{report.skin || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>Nails:</label>
          <span>{report.nails || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>Mouth:</label>
          <span>{report.mouth || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>Perineum:</label>
          <span>{report.perineum || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>Pressure Spaces:</label>
          <span>{report.pressureSpaces || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>Hidden Spaces:</label>
          <span>{report.hiddenSpaces || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>Scalp:</label>
          <span>{report.scalp || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>Joints:</label>
          <span>{report.joints || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>POP:</label>
          <span>{report.pop || "N/A"}</span>
        </div>

        {/* Vital Signs */}
        <h3 className="rnhc-section-title">Vital Signs</h3>
        <div className="rnhc-field">
          <label>BP :</label>
          <span>{report.bp || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>BP UL OR LL:</label>
          <span>{report.ulLl || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>BP Position:</label>
          <span>{report.position   || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>Pulse:</label>
          <span>{report.pulse || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>Pulse Type:</label>
          <span>{report.pulseType || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>Respiratory Rate (RR):</label>
          <span>{report.rr || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>RR Type:</label>
          <span>{report.rrType || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>Temperature:</label>
          <span>{report.temperature || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>Temperature Type:</label>
          <span>{report.temperatureType || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>SPO2:</label>
          <span>{report.spo2 || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>GRBS:</label>
          <span>{report.grbs || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>GCS:</label>
          <span>{report.gcs || "N/A"}</span>
        </div>

        {/* Miscellaneous */}
        <h3 className="rnhc-section-title">Miscellaneous</h3>
        <div className="rnhc-field">
          <label>Form Type:</label>
          <span>{report.formType || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>Registration Date:</label>
          <span>{report.registrationDate || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>Register Time:</label>
          <span>{report.registerTime || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>Submitted At:</label>
          <span>{report.submittedAt || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>Team 1:</label>
          <span>{report.team1 || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>Team 2:</label>
          <span>{report.team2 || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>Team 3:</label>
          <span>{report.team3 || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>Team 4:</label>
          <span>{report.team4 || "N/A"}</span>
        </div>
        <div className="rnhc-field">
          <label>Team 4:</label>
          <span>{report.consultation || "N/A"}</span>
        </div>
      </div>
      <button className="rnhc-update-button" onClick={goToUpdate}>
        Update Report
      </button>
    </div>
  );
};

export default ReportDetailsNHCE;