import React, { useState, useEffect } from "react";
import { db } from "../Firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./UpdateDHC.css";

const UpdateDHC = () => {
  const { reportId } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        setError(null);

        const reportRef = doc(db, "Reports", reportId);
        const reportSnapshot = await getDoc(reportRef);

        if (reportSnapshot.exists()) {
          setReport(reportSnapshot.data());
        } else {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReport((prevReport) => ({
      ...prevReport,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const reportRef = doc(db, "Reports", reportId);
      await updateDoc(reportRef, report);
      toast.success("Report updated successfully!");
      setTimeout(() => {
        navigate(-1);
      }, 2000);
    } catch (error) {
      console.error("Error updating report: ", error);
      toast.error("Failed to update report. Please try again later.");
    }
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
    <div className="UpdateDHC-container">
      <ToastContainer position="top-center" autoClose={2000} />
      <button className="UpdateDHC-back-button" onClick={() => navigate(-1)}>
        &larr; Back
      </button>
      <h2 className="UpdateDHC-title">Update Patient Report Details</h2>
      <form onSubmit={handleSubmit} className="UpdateDHC-form">
        {/* Personal Details */}
        <h3 className="UpdateDHC-section-title">Personal Details</h3>
        <div className="UpdateDHC-field">
          <label>Patient Name:</label>
          <input
            type="text"
            name="name"
            value={report.name || ""}
            onChange={handleChange}
          />
        </div>
        <div className="udhc-field">
          <label>Age:</label>
          <input
            type="text"
            name="age"
            value={report.age || ""}
            onChange={handleChange}
          />
        </div>
        <div className="udhc-field">
          <label>Gender:</label>
          <input
            type="text"
            name="gender"
            value={report.gender || ""}
            onChange={handleChange}
          />
        </div>
        <div className="udhc-field">
          <label>Date of Birth:</label>
          <input
            type="text"
            name="dob"
            value={report.dob || ""}
            onChange={handleChange}
          />
        </div>
        <div className="udhc-field">
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={report.address || ""}
            onChange={handleChange}
          />
        </div>
        <div className="udhc-field">
          <label>Email:</label>
          <input
            type="text"
            name="email"
            value={report.email || ""}
            onChange={handleChange}
          />
        </div>
        <div className="udhc-field">
          <label>Patient ID:</label>
          <input
            type="text"
            name="patientId"
            value={report.patientId || ""}
            onChange={handleChange}
          />
        </div>

        {/* Medical Details */}
        <h3 className="udhc-section-title">Medical Details</h3>
        <div className="udhc-field">
          <label>Main Diagnosis:</label>
          <input
            type="text"
            name="mainDiagnosis"
            value={report.mainDiagnosis || ""}
            onChange={handleChange}
          />
        </div>
        <div className="udhc-field">
          <label>Medical History:</label>
          <input
            type="text"
            name="medicalHistory"
            value={report.medicalHistory || ""}
            onChange={handleChange}
          />
        </div>
        <div className="udhc-field">
          <label>Medical Examination:</label>
          <input
            type="text"
            name="medicalExamination"
            value={report.medicalExamination || ""}
            onChange={handleChange}
          />
        </div>
        <div className="udhc-field">
          <label>General Status:</label>
          <input
            type="text"
            name="generalStatus"
            value={report.generalStatus || ""}
            onChange={handleChange}
          />
        </div>
        <div className="udhc-field">
          <label>Response Status:</label>
          <input
            type="text"
            name="responseStatus"
            value={report.responseStatus || ""}
            onChange={handleChange}
          />
        </div>
        <div className="udhc-field">
          <label>Current Difficulties:</label>
          <input
            type="text"
            name="currentDifficulties"
            value={report.currentDifficulties || ""}
            onChange={handleChange}
          />
        </div>
        <div className="udhc-field">
          <label>Medicine Changes:</label>
          <input
            type="text"
            name="medicineChanges"
            value={report.medicineChanges || ""}
            onChange={handleChange}
          />
        </div>
        <div className="udhc-field">
          <label>Complimentary Rx:</label>
          <input
            type="text"
            name="complimentaryRx"
            value={report.complimentaryRx || ""}
            onChange={handleChange}
          />
        </div>
        <div className="udhc-field">
          <label>Home Care Plan:</label>
          <input
            type="text"
            name="homeCarePlan"
            value={report.homeCarePlan || ""}
            onChange={handleChange}
          />
        </div>
        <div className="udhc-field">
          <label>Home Care Type:</label>
          <input
            type="text"
            name="homeCareType"
            value={report.homeCareType || ""}
            onChange={handleChange}
          />
        </div>

        {/* Additional Details */}
        <h3 className="udhc-section-title">Additional Details</h3>
        <div className="udhc-field">
          <label>Activity Score:</label>
          <input
            type="text"
            name="activityScore"
            value={report.activityScore || ""}
            onChange={handleChange}
          />
        </div>
        <div className="udhc-field">
          <label>Bad Habit:</label>
          <input
            type="text"
            name="badHabit"
            value={report.badHabit || ""}
            onChange={handleChange}
          />
        </div>
        <div className="udhc-field">
          <label>Exercise:</label>
          <input
            type="text"
            name="exercise"
            value={report.exercise || ""}
            onChange={handleChange}
          />
        </div>
        <div className="udhc-field">
          <label>Exercise Frequency:</label>
          <input
            type="text"
            name="exerciseFrequency"
            value={report.exerciseFrequency || ""}
            onChange={handleChange}
          />
        </div>
        <div className="udhc-field">
          <label>Exercise Location:</label>
          <input
            type="text"
            name="exerciseLocation"
            value={report.exerciseLocation || ""}
            onChange={handleChange}
          />
        </div>
        <div className="udhc-field">
          <label>Exercise Time:</label>
          <input
            type="text"
            name="exerciseTime"
            value={report.exerciseTime || ""}
            onChange={handleChange}
          />
        </div>
        <div className="udhc-field">
          <label>Entertainment Time:</label>
          <input
            type="text"
            name="entertainmentTime"
            value={report.entertainmentTime || ""}
            onChange={handleChange}
          />
        </div>
        <div className="udhc-field">
          <label>Other Activities:</label>
          <input
            type="text"
            name="otherActivities"
            value={report.otherActivities || ""}
            onChange={handleChange}
          />
        </div>
        <div className="udhc-field">
          <label>Special Care Areas:</label>
          <input
            type="text"
            name="specialCareAreas"
            value={report.specialCareAreas || ""}
            onChange={handleChange}
          />
        </div>
        <div className="udhc-field">
          <label>Summary Discussion:</label>
          <input
            type="text"
            name="summaryDiscussion"
            value={report.summaryDiscussion || ""}
            onChange={handleChange}
          />
        </div>

        {/* Cleanliness and Hygiene */}
        <h3 className="udhc-section-title">Cleanliness and Hygiene</h3>
        <div className="udhc-field">
          <label>House Cleanliness:</label>
          <input
            type="text"
            name="houseCleanliness"
            value={report.houseCleanliness || ""}
            onChange={handleChange}
          />
        </div>
        <div className="udhc-field">
          <label>Bedroom Cleanliness:</label>
          <input
            type="text"
            name="bedroomCleanliness"
            value={report.bedroomCleanliness || ""}
            onChange={handleChange}
          />
        </div>
        <div className="udhc-field">
          <label>Bed Cleanliness:</label>
          <input
            type="text"
            name="bedCleanliness"
            value={report.bedCleanliness || ""}
            onChange={handleChange}
          />
        </div>
        <div className="udhc-field">
          <label>Surroundings Cleanliness:</label>
          <input
            type="text"
            name="surroundingsCleanliness"
            value={report.surroundingsCleanliness || ""}
            onChange={handleChange}
          />
        </div>
        <div className="udhc-field">
          <label>Dress Cleanliness:</label>
          <input
            type="text"
            name="dressCleanliness"
            value={report.dressCleanliness || ""}
            onChange={handleChange}
          />
        </div>
        <div className="udhc-field">
          <label>Self Hygiene:</label>
          <input
            type="text"
            name="selfHygiene"
            value={report.selfHygiene || ""}
            onChange={handleChange}
          />
        </div>
        <div className="udhc-field">
          <label>Hair:</label>
          <input
            type="text"
            name="hair"
            value={report.hair || ""}
            onChange={handleChange}
          />
        </div>
        <div className="udhc-field">
          <label>Skin:</label>
          <input
            type="text"
            name="skin"
            value={report.skin || ""}
            onChange={handleChange}
          />
        </div>
        <div className="udhc-field">
          <label>Nails:</label>
          <input
            type="text"
            name="nails"
            value={report.nails || ""}
            onChange={handleChange}
          />
        </div>
        <div className="udhc-field">
          <label>Mouth:</label>
          <input
            type="text"
            name="mouth"
            value={report.mouth || ""}
            onChange={handleChange}
          />
        </div>
        <div className="udhc-field">
          <label>Perineum:</label>
          <input
            type="text"
            name="perineum"
            value={report.perineum || ""}
            onChange={handleChange}
          />
        </div>
        <div className="udhc-field">
          <label>Pressure Spaces:</label>
          <input
            type="text"
            name="pressureSpaces"
            value={report.pressureSpaces || ""}
            onChange={handleChange}
          />
        </div>
        <div className="udhc-field">
          <label>Hidden Spaces:</label>
          <input
            type="text"
            name="hiddenSpaces"
            value={report.hiddenSpaces || ""}
            onChange={handleChange}
          />
        </div>
        <div className="udhc-field">
          <label>Scalp:</label>
          <input
            type="text"
            name="scalp"
            value={report.scalp || ""}
            onChange={handleChange}
          />
        </div>
        <div className="udhc-field">
          <label>Joints:</label>
          <input
            type="text"
            name="joints"
            value={report.joints || ""}
            onChange={handleChange}
          />
        </div>
        <div className="udhc-field">
          <label>POP:</label>
          <input
            type="text"
            name="pop"
            value={report.pop || ""}
            onChange={handleChange}
          />
        </div>

        {/* Vital Signs */}
        <h3 className="udhc-section-title">Vital Signs</h3>
        <div className="udhc-field">
          <label>BP (Rt/Lt):</label>
          <input
            type="text"
            name="bpRtLt"
            value={report.bpRtLt || ""}
            onChange={handleChange}
          />
        </div>
        <div className="udhc-field">
          <label>BP (Sitting/Lying):</label>
          <input
            type="text"
            name="bpSittingLying"
            value={report.bpSittingLying || ""}
            onChange={handleChange}
          />
        </div>
        <div className="udhc-field">
          <label>BP (UL/LL):</label>
          <input
            type="text"
            name="bpUlLl"
            value={report.bpUlLl || ""}
            onChange={handleChange}
          />
        </div>
        <div className="udhc-field">
          <label>Pulse:</label>
          <input
            type="text"
            name="pulse"
            value={report.pulse || ""}
            onChange={handleChange}
          />
        </div>
        <div className="udhc-field">
          <label>Pulse Type:</label>
          <input
            type="text"
            name="pulseType"
            value={report.pulseType || ""}
            onChange={handleChange}
          />
        </div>
        <div className="udhc-field">
          <label>Respiratory Rate (RR):</label>
          <input
            type="text"
            name="rr"
            value={report.rr || ""}
            onChange={handleChange}
          />
        </div>
        <div className="udhc-field">
          <label>RR Type:</label>
          <input
            type="text"
            name="rrType"
            value={report.rrType || ""}
            onChange={handleChange}
          />
        </div>
        <div className="udhc-field">
          <label>Temperature:</label>
          <input
            type="text"
            name="temperature"
            value={report.temperature || ""}
            onChange={handleChange}
          />
        </div>
        <div className="udhc-field">
          <label>Temperature Type:</label>
          <input
            type="text"
            name="temperatureType"
            value={report.temperatureType || ""}
            onChange={handleChange}
          />
        </div>
        <div className="udhc-field">
          <label>SPO2:</label>
          <input
            type="text"
            name="spo2"
            value={report.spo2 || ""}
            onChange={handleChange}
          />
        </div>
        <div className="udhc-field">
          <label>GRBS:</label>
          <input
            type="text"
            name="grbs"
            value={report.grbs || ""}
            onChange={handleChange}
          />
        </div>
        <div className="udhc-field">
          <label>GCS:</label>
          <input
            type="text"
            name="gcs"
            value={report.gcs || ""}
            onChange={handleChange}
          />
        </div>

        {/* Miscellaneous */}
        <h3 className="udhc-section-title">Miscellaneous</h3>
        <div className="udhc-field">
          <label>Form Type:</label>
          <input
            type="text"
            name="formType"
            value={report.formType || ""}
            onChange={handleChange}
          />
        </div>
        <div className="udhc-field">
          <label>Registration Date:</label>
          <input
            type="text"
            name="registrationDate"
            value={report.registrationDate || ""}
            onChange={handleChange}
          />
        </div>
        <div className="udhc-field">
          <label>Register Time:</label>
          <input
            type="text"
            name="registerTime"
            value={report.registerTime || ""}
            onChange={handleChange}
          />
        </div>
        <div className="udhc-field">
          <label>Submitted At:</label>
          <input
            type="text"
            name="submittedAt"
            value={report.submittedAt || ""}
            onChange={handleChange}
          />
        </div>
        <div className="udhc-field">
          <label>Team 1:</label>
          <input
            type="text"
            name="team1"
            value={report.team1 || ""}
            onChange={handleChange}
          />
        </div>
        <div className="udhc-field">
          <label>Team 2:</label>
          <input
            type="text"
            name="team2"
            value={report.team2 || ""}
            onChange={handleChange}
          />
        </div>
        <div className="udhc-field">
          <label>Team 3:</label>
          <input
            type="text"
            name="team3"
            value={report.team3 || ""}
            onChange={handleChange}
          />
        </div>
        <div className="udhc-field">
          <label>Team 4:</label>
          <input
            type="text"
            name="team4"
            value={report.team4 || ""}
            onChange={handleChange}
          />
        </div>
        <div className="udhc-field">
          <label>Consultation:</label>
          <input
            type="text"
            name="consultation"
            value={report.consultation || ""}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="UpdateDHC-update-button">
          Update Report
        </button>
      </form>
    </div>
  );
};

export default UpdateDHC;