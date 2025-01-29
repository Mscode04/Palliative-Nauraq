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
        {/* General Details */}
        <h3 className="UpdateDHC-section-title">General Details</h3>
        <div className="UpdateDHC-field">
          <label>Date:</label>
          <input type="date" name="date" value={report.date || ""} onChange={handleChange} required />
        </div>
        <div className="UpdateDHC-field">
          <label>Team 1:</label>
          <select name="team1" value={report.team1 || ""} onChange={handleChange} required>
            <option value="Shameema">Shameema</option>
            <option value="Divya">Divya</option>
            <option value="Haseen">Haseen</option>
            <option value="Null">Null</option>
          </select>
        </div>
        {[2, 3, 4].map((num) => (
          <div className="UpdateDHC-field" key={num}>
            <label>Team {num}:</label>
            <input type="text" name={`team${num}`} value={report[`team${num}`] || ""} onChange={handleChange} />
          </div>
        ))}
        <div className="UpdateDHC-field">
          <label>First Impression:</label>
          <input type="text" name="firstImpression" value={report.firstImpression || ""} onChange={handleChange} />
        </div>
        <div className="UpdateDHC-field">
          <label>Patient Awareness:</label>
          <select name="patientAwareness" value={report.patientAwareness || ""} onChange={handleChange} required>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <div className="UpdateDHC-field">
          <label>Caretaker Awareness:</label>
          <select name="caretakerAwareness" value={report.caretakerAwareness || ""} onChange={handleChange} required>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <div className="UpdateDHC-field">
          <label>Extra Details about Awareness:</label>
          <textarea name="extraDetailsAwareness" value={report.extraDetailsAwareness || ""} onChange={handleChange}></textarea>
        </div>
        <div className="UpdateDHC-field">
          <label>Bad Habit:</label>
          <select name="badHabit" value={report.badHabit || ""} onChange={handleChange} required>
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </select>
        </div>
        {report.badHabit === "Yes" && (
          <div className="UpdateDHC-field">
            <label>More About Bad Habits:</label>
            <input type="text" name="moreAboutBadHabits" value={report.moreAboutBadHabits || ""} onChange={handleChange} />
          </div>
        )}
        <div className="UpdateDHC-field">
          <label>Complimentary Rx:</label>
          <select name="complimentaryRx" value={report.complimentaryRx || ""} onChange={handleChange} required>
            <option value="nill">Nill</option>
            <option value="ay">AY</option>
            <option value="h">H</option>
            <option value="u">U</option>
            <option value="sd">Sd</option>
            <option value="n">N</option>
            <option value="o">O</option>
          </select>
        </div>

        {/* Basic Matters */}
        <h3 className="UpdateDHC-section-title">Basic Matters</h3>
        {["food", "drink", "pee", "pop", "sleep", "selfHygiene"].map((field) => (
          <div className="UpdateDHC-field" key={field}>
            <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
            <select name={field} value={report[field] || ""} onChange={handleChange} required>
              <option value="Good">Good</option>
              <option value="Bad">Bad</option>
              <option value="Average">Average</option>
              <option value="Satisfy">Satisfy</option>
            </select>
          </div>
        ))}
        <div className="UpdateDHC-field">
          <label>Additional Notes:</label>
          <textarea name="basicMattersNotes" value={report.basicMattersNotes || ""} onChange={handleChange}></textarea>
        </div>
        <div className="UpdateDHC-field">
          <label>Sexuality:</label>
          <select name="sexuality" value={report.sexuality || ""} onChange={handleChange} required>
            <option value="nill">Nill</option>
            <option value="yes">Yes</option>
          </select>
        </div>

        {/* Exercise */}
        <h3 className="UpdateDHC-section-title">Exercise</h3>
        <div className="UpdateDHC-field">
          <label>Exercise:</label>
          <select name="exercise" value={report.exercise || ""} onChange={handleChange} required>
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </select>
        </div>
        <div className="UpdateDHC-field">
          <label>Frequency:</label>
          <select name="exerciseFrequency" value={report.exerciseFrequency || ""} onChange={handleChange} required>
            <option value="daily">Daily</option>
            <option value="weekly once">Weekly Once</option>
            <option value="sometimes">Sometimes</option>
          </select>
        </div>
        <div className="UpdateDHC-field">
          <label>Time of Exercise:</label>
          <input type="text" name="exerciseTime" value={report.exerciseTime || ""} onChange={handleChange} />
        </div>
        <div className="UpdateDHC-field">
          <label>Location:</label>
          <select name="exerciseLocation" value={report.exerciseLocation || ""} onChange={handleChange} required>
            <option value="in">In</option>
            <option value="out">Out</option>
          </select>
        </div>

        {/* Habits */}
        <h3 className="UpdateDHC-section-title">Habits</h3>
        <div className="UpdateDHC-field">
          <label>Entertainment / Time Spending:</label>
          <input type="text" name="entertainmentTime" value={report.entertainmentTime || ""} onChange={handleChange} />
        </div>

        {/* Surroundings */}
        <h3 className="UpdateDHC-section-title">Surroundings</h3>
        {["house", "surroundings", "bedroom", "bed", "dress"].map((field) => (
          <div className="UpdateDHC-field" key={field}>
            <label>{field.charAt(0).toUpperCase() + field.slice(1)} Cleanliness:</label>
            <select name={`${field}Cleanliness`} value={report[`${field}Cleanliness`] || ""} onChange={handleChange} required>
              <option value="clean">Clean</option>
              <option value="unclean">Unclean</option>
              <option value="average">Average</option>
            </select>
          </div>
        ))}

        {/* General Matters */}
        <h3 className="UpdateDHC-section-title">General Matters</h3>
        <div className="UpdateDHC-field">
          <label>General Status:</label>
          <select name="generalStatus" value={report.generalStatus || ""} onChange={handleChange} required>
            <option value="stable">Stable</option>
            <option value="unstable">Unstable</option>
          </select>
        </div>
        <div className="UpdateDHC-field">
          <label>Patient Currently:</label>
          <select name="patientCurrently" value={report.patientCurrently || ""} onChange={handleChange} required>
          <option value="lying">Lying</option>
<option value="standing">Standing</option>
<option value="sitting">Sitting</option>
<option value="fully_capable">Fully Capable</option>
<option value="toss_and_turns_in_bed_self">Toss and Turns in Bed (Self)</option>
<option value="toss_and_turns_with_help">Toss and Turns with Help</option>
<option value="sitting_with_help">Sitting with Help</option>
<option value="standing_with_help">Standing with Help</option>
<option value="walking_house_self">Walking (House) Self</option>
<option value="walking_house_with_help">Walking (House) with Help</option>
<option value="walking_out_with_help">Walking (Out) with Help</option>
<option value="walking_out_self">Walking (Out) Self</option>
          </select>
        </div>
        <div className="UpdateDHC-field">
          <label>Memory Status:</label>
          <select name="memoryStatus" value={report.memoryStatus || ""} onChange={handleChange} required>
          <option value="remember">Remember</option>
    <option value="not-remember">Do Not Remember</option>
    <option value="sometimes">Sometimes</option>
    <option value="something">Something</option> 
          </select>
        </div>
        <div className="UpdateDHC-field">
          <label>Response Status:</label>
          <select name="responseStatus" value={report.responseStatus || ""} onChange={handleChange} required>
          <option value="full-respond">Full Respond</option>
    <option value="slightly-respond">Slightly Respond</option>
    <option value="not-respond">Not Respond</option>
    <option value="respond-with-talking">Respond with Talking</option>
    <option value="respond-with-hands">Respond with Hands</option>
    <option value="respond-with-fingers">Respond with Fingers</option>
    <option value="respond-with-eye">Respond with Eye</option>
    <option value="respond-with-head">Respond with Head</option>
    <option value="respond-with-sound">Respond with Sound</option>
          </select>
        </div>
        <div className="UpdateDHC-field">
          <label>Activity Score:</label>
          <select name="activityScore" value={report.activityScore || ""} onChange={handleChange} required>
          <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>

        {/* Head to Foot Checkup */}
        <h3 className="UpdateDHC-section-title">Head to Foot Checkup</h3>
        {["scalp", "hair", "skin", "nails", "mouth", "perineum", "hiddenSpaces", "pressureSpaces", "joints"].map((field) => (
          <div className="UpdateDHC-field" key={field}>
            <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
            <select name={field} value={report[field] || ""} onChange={handleChange} required>
              {field === "skin" && (
                <>
                  <option value="Dry">Dry</option>
                  <option value="Oily">Oily</option>
                  <option value="Combination">Combination</option>
                  <option value="Sensitive">Sensitive</option>
                  <option value="Normal">Normal</option>
                  <option value="Wrinkled">Wrinkled</option>
                </>
              )}
              {field === "hair" && (
                <>
                  <option value="Messy Hair">Messy Hair</option>
                  <option value="Well maintain">Well maintain</option>
                  <option value="Clean">Clean</option>
                  <option value="Unclean">Unclean</option>
                  <option value="Normal">Normal</option>
                </>
              )}
              {field === "nails" && (
                <>
                  <option value="Clean">Clean</option>
                  <option value="Unclean">Unclean</option>
                  <option value="Well maintain">Well maintain</option>
                  <option value="Normal">Normal</option>
                  <option value="Not maintain">Not maintain</option>
                </>
              )}
              {field === "mouth" && (
                <>
                  <option value="Clean">Clean</option>
                  <option value="Unclean">Unclean</option>
                  <option value="Oral candidiasis">Oral candidiasis</option>
                  <option value="Glotitis">Glotitis</option>
                </>
              )}
              {field === "perineum" && (
                <>
                  <option value="Clean">Clean</option>
                  <option value="Unclean">Unclean</option>
                  <option value="Normal">Normal</option>
                </>
              )}
              {field === "hiddenSpaces" && (
                <>
                  <option value="Clean">Clean</option>
                  <option value="Unclean">Unclean</option>
                  <option value="Normal">Normal</option>
                </>
              )}
              {field === "pressureSpaces" && (
                <>
                  <option value="Clean">Clean</option>
                  <option value="Unclean">Unclean</option>
                  <option value="Normal">Normal</option>
                </>
              )}
              {field === "joints" && (
                <>
                  <option value="Movable">Movable</option>
                  <option value="Slightly movable">Slightly movable</option>
                  <option value="Fixed">Fixed</option>
                  <option value="Freely movable">Freely movable</option>
                </>
              )}
              {!["skin", "hair", "nails", "mouth", "perineum", "hiddenSpaces", "pressureSpaces", "joints"].includes(field) && (
                <>
                               <option value="Clean">Clean </option>
                  <option value="Unclean">Unclean</option>
                  <option value="Average">Average</option>
                </>
              )}
            </select>
          </div>
        ))}
        <div className="UpdateDHC-field">
          <label>Additional Notes:</label>
          <textarea name="headToFootNotes" value={report.headToFootNotes || ""} onChange={handleChange}></textarea>
        </div>

        {/* Vital Signs */}
        <h3 className="UpdateDHC-section-title">Vital Signs</h3>
        <div className="UpdateDHC-field">
          <label>BP:</label>
          <input type="text" name="bp" value={report.bp || ""} onChange={handleChange} />
        </div>
        <div className="UpdateDHC-field">
          <label>UL/LL:</label>
          <select name="ulLl" value={report.ulLl || ""} onChange={handleChange}>
            <option value="UL">UL</option>
            <option value="LL">LL</option>
          </select>
        </div>
        <div className="UpdateDHC-field">
          <label>Position:</label>
          <select name="position" value={report.position || ""} onChange={handleChange}>
            <option value="Null">Null</option>
            <option value="RT Sitting">RT Sitting</option>
            <option value="RT Lying">RT Lying</option>
            <option value="LT Sitting">LT Sitting</option>
            <option value="LT Lying">LT Lying</option>
          </select>
        </div>
        <div className="UpdateDHC-field">
          <label>RR:</label>
          <input type="text" name="rr" value={report.rr || ""} onChange={handleChange} />
        </div>
        <div className="UpdateDHC-field">
          <label>RR Type:</label>
          <select name="rrType" value={report.rrType || ""} onChange={handleChange}>
            <option value="R">R</option>
            <option value="IR">IR</option>
          </select>
        </div>
        <div className="UpdateDHC-field">
          <label>Pulse:</label>
          <input type="text" name="pulse" value={report.pulse || ""} onChange={handleChange} />
        </div>
        <div className="UpdateDHC-field">
          <label>Pulse Type:</label>
          <select name="pulseType" value={report.pulseType || ""} onChange={handleChange}>
            <option value="R">R</option>
            <option value="IR">IR</option>
          </select>
        </div>
        <div className="UpdateDHC-field">
          <label>Temperature:</label>
          <input type="text" name="temperature" value={report.temperature || ""} onChange={handleChange} />
        </div>
        <div className="UpdateDHC-field">
          <label>Temperature Type:</label>
          <select name="temperatureType" value={report.temperatureType || ""}>
          <option value="O">O</option>
          <option value="A">A</option>
          <option value="R">R</option>
          
          </select>
        </div>
        <div className="UpdateDHC-field">
          <label>SPO2:</label>
          <input
            type="text"
            name="spo2"
            value={report.spo2 || ""}
            onChange={handleChange}
          />
        </div>
        <div className="UpdateDHC-field">
          <label>GRBS:</label>
          <input
            type="text"
            name="grbs"
            value={report.grbs || ""}
            onChange={handleChange}
          />
        </div>
        <div className="UpdateDHC-field">
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
        <div className="UpdateDHC-field">
          <label>Form Type:</label>
          <input
            type="text"
            name="formType"
            value={report.formType || ""}
            onChange={handleChange}
          />
        </div>
        <div className="UpdateDHC-field">
          <label>Registration Date:</label>
          <input
            type="text"
            name="registrationDate"
            value={report.registrationDate || ""}
            onChange={handleChange}
          />
        </div>
        <div className="UpdateDHC-field">
          <label>Register Time:</label>
          <input
            type="text"
            name="registerTime"
            value={report.registerTime || ""}
            onChange={handleChange}
          />
        </div>
        <div className="UpdateDHC-field">
          <label>Submitted At:</label>
          <input
            type="text"
            name="submittedAt"
            value={report.submittedAt || ""}
            onChange={handleChange}
          />
        </div>
        <div className="UpdateDHC-field">
          <label>Team 1:</label>
          <input
            type="text"
            name="team1"
            value={report.team1 || ""}
            onChange={handleChange}
          />
        </div>
        <div className="UpdateDHC-field">
          <label>Team 2:</label>
          <input
            type="text"
            name="team2"
            value={report.team2 || ""}
            onChange={handleChange}
          />
        </div>
        <div className="UpdateDHC-field">
          <label>Team 3:</label>
          <input
            type="text"
            name="team3"
            value={report.team3 || ""}
            onChange={handleChange}
          />
        </div>
        <div className="UpdateDHC-field">
          <label>Team 4:</label>
          <input
            type="text"
            name="team4"
            value={report.team4 || ""}
            onChange={handleChange}
          />
        </div>
        <div className="UpdateDHC-field">
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