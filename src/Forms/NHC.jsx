import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../Firebase/config";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./NHC.css"; // New CSS file for styling

const NHC = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState(null);
  const [formData, setFormData] = useState({
    // ... (your existing formData state)
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const q = query(collection(db, "Patients"), where("patientId", "==", patientId));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const data = querySnapshot.docs[0].data();
          setPatientData(data);
        } else {
          console.error("No patient document found with patientId:", patientId);
        }
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    };

    fetchPatientData();
  }, [patientId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      const currentDate = new Date();
      const timestamp = currentDate.toISOString();
  
      const reportData = {
        ...formData,
        ...patientData,
        patientId,
        submittedAt: timestamp,
      };
  
      await addDoc(collection(db, "Reports"), reportData);
  
      // Show success toast and navigate back after the toast is closed
      toast.success("Report submitted successfully!", {
        position: "top-center",
        autoClose: 5000, // 5 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        onClose: () => navigate(-1), // Navigate back after toast is closed
      });
  
      // Reset form data
      setFormData({
        // ... (reset all fields to their initial values)
      });
  
    } catch (error) {
      console.error("Error adding document: ", error);
      // Show error toast
      toast.error("Error submitting the report. Please try again.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="NHCAdd-container">
      <ToastContainer />
      <button className="NHCAdd-back-btn" onClick={() => navigate(-1)}>
        <i className="fa fa-arrow-left"></i> Back
      </button>

      <h2>NHC Details for Patient ID: {patientId}</h2>
      {patientData ? (
        <>
          <h3>Patient Information</h3>
          <p><strong>Name:</strong> {patientData.name}</p>
          <p><strong>Address:</strong> {patientData.address}</p>
          <p><strong>Phone Number:</strong> {patientData.phone}</p>
          <p><strong>Location:</strong> {patientData.location}</p>
          <p><strong>Age:</strong> {patientData.age}</p>
        </>
      ) : (
        <p>Loading patient information...</p>
      )}

      <form onSubmit={handleSubmit} className="NHCAdd-form">
        {/* Form sections go here */}
        {/* Example for one section */}
        <h3>Section 1: General Details</h3>
        <label>
          Date:
          <input type="date" name="date" value={formData.date} onChange={handleChange} />
        </label>
        <label>
          Team 1:
          <select name="team1" value={formData.team1} onChange={handleChange}>
            <option value="Shameema">Shameema</option>
            <option value="Divya">Divya</option>
            <option value="Haseen">Haseen</option>
            <option value="Null">Null</option>
          </select>
        </label>
        {[2, 3, 4].map((num) => (
          <label key={num}>
            Team {num}:
            <input type="text" name={`team${num}`} value={formData[`team${num}`]} onChange={handleChange} />
          </label>
        ))}
        <label>
          First Impression:
          <input type="text" name="firstImpression" value={formData.firstImpression} onChange={handleChange} />
        </label>
        <label>
          Patient Awareness:
          <select name="patientAwareness" value={formData.patientAwareness} onChange={handleChange}>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </label>
        <label>
          Caretaker Awareness:
          <select name="caretakerAwareness" value={formData.caretakerAwareness} onChange={handleChange}>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </label>
        <label>
          Extra Details about Awareness:
          <textarea name="extraDetailsAwareness" value={formData.extraDetailsAwareness} onChange={handleChange}></textarea>
        </label>
        <label>
          Bad Habit:
          <select name="badHabit" value={formData.badHabit} onChange={handleChange}>
            <option value="No">No</option>
            <option value="Smoking">Smoking</option>
            <option value="beer">Beer</option>
          </select>
        </label>
        <label>
          Complimentary Rx:
          <select name="complimentaryRx" value={formData.complimentaryRx} onChange={handleChange}>
            <option value="nill">Nill</option>
            <option value="ay">AY</option>
            <option value="h">H</option>
            <option value="u">U</option>
            <option value="sd">SD</option>
            <option value="n">N</option>
            <option value="o">O</option>
          </select>
        </label>

        <h3>Section 2: Basic Matters</h3>
        {["food", "drink", "pee", "pop", "sleep", "selfHygiene"].map((field) => (
          <label key={field}>
            {field.charAt(0).toUpperCase() + field.slice(1)}:
            <select name={field} value={formData[field]} onChange={handleChange}>
              <option value="Good">Good</option>
              <option value="Bad">Bad</option>
              <option value="Average">Average</option>
              {field === "food" || field === "drink" ? <option value="Satisfy">Satisfy</option> : null}
            </select>
          </label>
        ))}
        <label>
          Sexuality:
          <select name="sexuality" value={formData.sexuality} onChange={handleChange}>
            <option value="nill">Nill</option>
            <option value="yes">Yes</option>
          </select>
        </label>

        <h3>Section 3: Exercise</h3>
        <label>
          Exercise:
          <select name="exercise" value={formData.exercise} onChange={handleChange}>
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </select>
        </label>
        <label>
          Frequency:
          <select name="exerciseFrequency" value={formData.exerciseFrequency} onChange={handleChange}>
            <option value="daily">Daily</option>
            <option value="weekly once">Weekly Once</option>
            <option value="sometimes">Sometimes</option>
          </select>
        </label>
        <label>
          Time of Exercise:
          <input type="text" name="exerciseTime" value={formData.exerciseTime} onChange={handleChange} />
        </label>
        <label>
          Location:
          <select name="exerciseLocation" value={formData.exerciseLocation} onChange={handleChange}>
            <option value="in">In</option>
            <option value="out">Out</option>
          </select>
        </label>

        <h3>Section 4: Habits</h3>
        <label>
          Entertainment Time Spending:
          <input type="text" name="entertainmentTime" value={formData.entertainmentTime} onChange={handleChange} />
        </label>

        <h3>Section 5: Awareness</h3>
        <label>
          Patient Awareness Details:
          <textarea name="patientAwarenessDetails" value={formData.patientAwarenessDetails} onChange={handleChange}></textarea>
        </label>
        <label>
          Caretaker Awareness Details:
          <textarea name="caretakerAwarenessDetails" value={formData.caretakerAwarenessDetails} onChange={handleChange}></textarea>
        </label>

        <h3>Section 6: Surroundings</h3>
        {["house", "surroundings", "bedroom", "bed", "dress"].map((field) => (
          <label key={field}>
            {field.charAt(0).toUpperCase() + field.slice(1)} Cleanliness:
            <select name={`${field}Cleanliness`} value={formData[`${field}Cleanliness`]} onChange={handleChange}>
              <option value="clean">Clean</option>
              <option value="unclean">Unclean</option>
              <option value="average">Average</option>
            </select>
          </label>
        ))}

        <h3>Section 7: General Matters</h3>
        <label>
          General Status:
          <select name="generalStatus" value={formData.generalStatus} onChange={handleChange}>
            <option value="stable">Stable</option>
            <option value="unstable">Unstable</option>
          </select>
        </label>
        <label>
          Patient Currently:
          <select name="patientCurrently" value={formData.patientCurrently} onChange={handleChange}>
            <option value="sitting">Sitting</option>
            <option value="standing">Standing</option>
          </select>
        </label>
        <label>
          Memory Status:
          <select name="memoryStatus" value={formData.memoryStatus} onChange={handleChange}>
            <option value="remember">Remember</option>
            <option value="not remember">Not Remember</option>
          </select>
        </label>
        <label>
          Response Status:
          <select name="responseStatus" value={formData.responseStatus} onChange={handleChange}>
            <option value="good">Good</option>
            <option value="bad">Bad</option>
          </select>
        </label>
        <label>
          Activity Score:
          <select name="activityScore" value={formData.activityScore} onChange={handleChange}>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
        </label>

        <h3>Section 8: Head to Foot Checkup</h3>
        {["scalp", "hair", "skin", "nails", "mouth", "perineum", "hiddenSpaces", "pressureSpaces", "joints"].map((field) => (
          <label key={field}>
            {field.charAt(0).toUpperCase() + field.slice(1)}:
            <select name={field} value={formData[field]} onChange={handleChange}>
              <option value="Good">Good</option>
              <option value="Bad">Bad</option>
              <option value="Average">Average</option>
            </select>
          </label>
        ))}
           <h3>Section 9: Vital Signs</h3>
        <div className="vital-signs-row">
          <label>
            BP (UL/LL):
            <input type="text" name="bpUlLl" value={formData.bpUlLl} onChange={handleChange} />
          </label>
          <label>
            BP (RT/LT):
            <input type="text" name="bpRtLt" value={formData.bpRtLt} onChange={handleChange} />
          </label>
          <label>
            BP (Sitting/Lying):
            <input type="text" name="bpSittingLying" value={formData.bpSittingLying} onChange={handleChange} />
          </label>
        </div>
        <div className="vital-signs-row">
          <label>
            RR:
            <input type="text" name="rr" value={formData.rr} onChange={handleChange} placeholder="Mt" />
          </label>
          <label>
            RR Type:
            <select name="rrType" value={formData.rrType} onChange={handleChange}>
              <option value="R">R</option>
              <option value="IR">IR</option>
            </select>
          </label>
        </div>
        <div className="vital-signs-row">
          <label>
            Pulse:
            <input type="text" name="pulse" value={formData.pulse} onChange={handleChange} placeholder="Mt" />
          </label>
          <label>
            Pulse Type:
            <select name="pulseType" value={formData.pulseType} onChange={handleChange}>
              <option value="R">R</option>
              <option value="IR">IR</option>
            </select>
          </label>
        </div>
        <div className="vital-signs-row">
          <label>
            Temperature:
            <input type="text" name="temperature" value={formData.temperature} onChange={handleChange} placeholder="Fahrenheit" />
          </label>
          <label>
            Temperature Type:
            <select name="temperatureType" value={formData.temperatureType} onChange={handleChange}>
              <option value="O">O</option>
              <option value="A">A</option>
              <option value="R">R</option>
            </select>
          </label>
        </div>
        <div className="vital-signs-row">
          <label>
            SpO2:
            <input type="text" name="spo2" value={formData.spo2} onChange={handleChange} placeholder="%" />
          </label>
        </div>
        <div className="vital-signs-row">
          <label>
            GCS:
            <input type="text" name="gcs" value={formData.gcs} onChange={handleChange} placeholder="/15" />
          </label>
        </div>
        <div className="vital-signs-row">
          <label>
            GRBS:
            <input type="text" name="grbs" value={formData.grbs} onChange={handleChange} placeholder="mg/dl" />
          </label>
        </div>

        <h3>Section 10: Summary Discussion</h3>
        <label>
          Special Care Areas:
          <textarea name="specialCareAreas" value={formData.specialCareAreas} onChange={handleChange}></textarea>
        </label>
        <label>
          Summary Discussion:
          <textarea name="summaryDiscussion" value={formData.summaryDiscussion} onChange={handleChange}></textarea>
        </label>
        <label>
          Medicine Changes:
          <textarea name="medicineChanges" value={formData.medicineChanges} onChange={handleChange}></textarea>
        </label>
        <label>
          Other Activities:
          <textarea name="otherActivities" value={formData.otherActivities} onChange={handleChange}></textarea>
        </label>
        <label>
          Home Care Plan:
          <select name="homeCarePlan" value={formData.homeCarePlan} onChange={handleChange}>
            <option value="def">DEF</option>
            <option value="jef">JEF</option>
          </select>
        </label>
        <label>
          Home Care Type:
          <select name="homeCareType" value={formData.homeCareType} onChange={handleChange}>
            <option value="nhc">NHC</option>
            <option value="dhc">DHC</option>
          </select>
        </label>
        <label>
          Consultation:
          <textarea name="consultation" value={formData.consultation} onChange={handleChange}></textarea>
        </label>

        <button type="submit" className="NHCAdd-submit-btn mb-5" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
      
    </div>
  );
};

export default NHC;