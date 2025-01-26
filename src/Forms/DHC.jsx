import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../Firebase/config";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./DHCAdd.css";

const DHC = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState(null);
  const [formData, setFormData] = useState({
    date: "",
    team1: "Null",
    team2: "",
    team3: "",
    team4: "",
    firstImpression: "",
    patientAwareness: "Yes",
    caretakerAwareness: "Yes",
    extraDetailsAwareness: "",
    badHabit: "No",
    complimentaryRx: "nill",
    food: "Good",
    drink: "Good",
    pee: "Good",
    pop: "Good",
    sleep: "Good",
    selfHygiene: "Good",
    sexuality: "nill",
    exercise: "No",
    exerciseFrequency: "daily",
    exerciseTime: "",
    exerciseLocation: "in",
    entertainmentTime: "",
    patientAwarenessDetails: "",
    caretakerAwarenessDetails: "",
    houseCleanliness: "clean",
    surroundingsCleanliness: "clean",
    bedroomCleanliness: "clean",
    bedCleanliness: "clean",
    dressCleanliness: "clean",
    generalStatus: "stable",
    patientCurrently: "sitting",
    memoryStatus: "remember",
    responseStatus: "good",
    activityScore: "1",
    scalp: "Good",
    hair: "Good",
    skin: "Good",
    nails: "Good",
    mouth: "Good",
    perineum: "Good",
    hiddenSpaces: "Good",
    pressureSpaces: "Good",
    joints: "Good",
    specialCareAreas: "",
    summaryDiscussion: "",
    medicalExamination: "",
    medicineChanges: "",
    otherActivities: "",
    homeCarePlan: "def",
    homeCareType: "dhc",
    consultation: "",
    formType: "DHC",
    submittedAt: "",
    bpUlLl: "",
    bpRtLt: "",
    bpSittingLying: "",
    rr: "",
    rrType: "R",
    pulse: "",
    pulseType: "R",
    temperature: "",
    temperatureType: "O",
    spo2: "",
    gcs: "",
    grbs: "",
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
          console.log("Patient data fetched:", data);
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

      const docRef = await addDoc(collection(db, "Reports"), reportData);

      console.log("Document written with ID: ", docRef.id);
      toast.success("DHC report submitted successfully!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Redirect to /patient/:patientId after 3 seconds
      setTimeout(() => {
        navigate(`/main/patient/${patientId}`);
      }, 3000);

      setFormData({
        date: "",
        team1: "Null",
        team2: "",
        team3: "",
        team4: "",
        firstImpression: "",
        patientAwareness: "Yes",
        caretakerAwareness: "Yes",
        extraDetailsAwareness: "",
        badHabit: "No",
        complimentaryRx: "nill",
        food: "Good",
        drink: "Good",
        pee: "Good",
        pop: "Good",
        sleep: "Good",
        selfHygiene: "Good",
        sexuality: "nill",
        exercise: "No",
        exerciseFrequency: "daily",
        exerciseTime: "",
        exerciseLocation: "in",
        entertainmentTime: "",
        patientAwarenessDetails: "",
        caretakerAwarenessDetails: "",
        houseCleanliness: "clean",
        surroundingsCleanliness: "clean",
        bedroomCleanliness: "clean",
        bedCleanliness: "clean",
        dressCleanliness: "clean",
        generalStatus: "stable",
        patientCurrently: "sitting",
        memoryStatus: "remember",
        responseStatus: "good",
        activityScore: "1",
        scalp: "Good",
        hair: "Good",
        skin: "Good",
        nails: "Good",
        mouth: "Good",
        perineum: "Good",
        hiddenSpaces: "Good",
        pressureSpaces: "Good",
        joints: "Good",
        specialCareAreas: "",
        summaryDiscussion: "",
        medicalExamination: "",
        medicineChanges: "",
        otherActivities: "",
        homeCarePlan: "def",
        homeCareType: "dhc",
        consultation: "",
        formType: "DHC",
        submittedAt: "",
        bpUlLl: "",
        bpRtLt: "",
        bpSittingLying: "",
        rr: "",
        rrType: "R",
        pulse: "",
        pulseType: "R",
        temperature: "",
        temperatureType: "O",
        spo2: "",
        gcs: "",
        grbs: "",
      });
    } catch (error) {
      console.error("Error adding document: ", error);
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
    <div className="DHCAdd-container">
      <button className="DHCAdd-backButton" onClick={() => navigate(-1)}>
        &larr; Back
      </button>

      <h2 className="DHCAdd-title">DHC Details for Patient ID: {patientId}</h2>
      {patientData ? (
        <div className="DHCAdd-patientInfo">
          <h3>Patient Information</h3>
          <p><strong>Name:</strong> {patientData.name}</p>
          <p><strong>Address:</strong> {patientData.address}</p>
          <p><strong>Phone Number:</strong> {patientData.phone}</p>
          <p><strong>Location:</strong> {patientData.location}</p>
          <p><strong>Age:</strong> {patientData.age}</p>
        </div>
      ) : (
        <p>Loading patient information...</p>
      )}

      <form onSubmit={handleSubmit} className="DHCAdd-form">
        <h3>Section 1: General Details</h3>
        <div className="DHCAdd-field">
          <label>Date:</label>
          <input type="date" name="date" value={formData.date} onChange={handleChange} required />
        </div>
        <div className="DHCAdd-field">
          <label>Team 1:</label>
          <select name="team1" value={formData.team1} onChange={handleChange} required>
            <option value="Shameema">Shameema</option>
            <option value="Divya">Divya</option>
            <option value="Haseen">Haseen</option>
            <option value="Null">Null</option>
          </select>
        </div>
        {[2, 3, 4].map((num) => (
          <div className="DHCAdd-field" key={num}>
            <label>Team {num}:</label>
            <input type="text" name={`team${num}`} value={formData[`team${num}`]} onChange={handleChange} />
          </div>
        ))}
        <div className="DHCAdd-field">
          <label>First Impression:</label>
          <input type="text" name="firstImpression" value={formData.firstImpression} onChange={handleChange} />
        </div>
        <div className="DHCAdd-field">
          <label>Patient Awareness:</label>
          <select name="patientAwareness" value={formData.patientAwareness} onChange={handleChange} required>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <div className="DHCAdd-field">
          <label>Caretaker Awareness:</label>
          <select name="caretakerAwareness" value={formData.caretakerAwareness} onChange={handleChange} required>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <div className="DHCAdd-field">
          <label>Extra Details about Awareness:</label>
          <textarea name="extraDetailsAwareness" value={formData.extraDetailsAwareness} onChange={handleChange}></textarea>
        </div>
        <div className="DHCAdd-field">
          <label>Bad Habit:</label>
          <select name="badHabit" value={formData.badHabit} onChange={handleChange} required>
            <option value="No">No</option>
            <option value="Smoking">Smoking</option>
            <option value="beer">Beer</option>
          </select>
        </div>
        <div className="DHCAdd-field">
          <label>Complimentary Rx:</label>
          <select name="complimentaryRx" value={formData.complimentaryRx} onChange={handleChange} required>
            <option value="nill">Nill</option>
            <option value="ay">AY</option>
            <option value="h">H</option>
            <option value="u">U</option>
            <option value="sd">SD</option>
            <option value="n">N</option>
            <option value="o">O</option>
          </select>
        </div>

        <h3>Section 2: Basic Matters</h3>
        {["food", "drink", "pee", "pop", "sleep", "selfHygiene"].map((field) => (
          <div className="DHCAdd-field" key={field}>
            <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
            <select name={field} value={formData[field]} onChange={handleChange} required>
              <option value="Good">Good</option>
              <option value="Bad">Bad</option>
              <option value="Average">Average</option>
              {field === "food" || field === "drink" ? <option value="Satisfy">Satisfy</option> : null}
            </select>
          </div>
        ))}
        <div className="DHCAdd-field">
          <label>Sexuality:</label>
          <select name="sexuality" value={formData.sexuality} onChange={handleChange} required>
            <option value="nill">Nill</option>
            <option value="yes">Yes</option>
          </select>
        </div>

        <h3>Section 3: Exercise</h3>
        <div className="DHCAdd-field">
          <label>Exercise:</label>
          <select name="exercise" value={formData.exercise} onChange={handleChange} required>
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </select>
        </div>
        <div className="DHCAdd-field">
          <label>Frequency:</label>
          <select name="exerciseFrequency" value={formData.exerciseFrequency} onChange={handleChange} required>
            <option value="daily">Daily</option>
            <option value="weekly once">Weekly Once</option>
            <option value="sometimes">Sometimes</option>
          </select>
        </div>
        <div className="DHCAdd-field">
          <label>Time of Exercise:</label>
          <input type="text" name="exerciseTime" value={formData.exerciseTime} onChange={handleChange} />
        </div>
        <div className="DHCAdd-field">
          <label>Location:</label>
          <select name="exerciseLocation" value={formData.exerciseLocation} onChange={handleChange} required>
            <option value="in">In</option>
            <option value="out">Out</option>
          </select>
        </div>

        <h3>Section 4: Habits</h3>
        <div className="DHCAdd-field">
          <label>Entertainment Time Spending:</label>
          <input type="text" name="entertainmentTime" value={formData.entertainmentTime} onChange={handleChange} />
        </div>

        <h3>Section 5: Awareness</h3>
        <div className="DHCAdd-field">
          <label>Patient Awareness Details:</label>
          <textarea name="patientAwarenessDetails" value={formData.patientAwarenessDetails} onChange={handleChange}></textarea>
        </div>
        <div className="DHCAdd-field">
          <label>Caretaker Awareness Details:</label>
          <textarea name="caretakerAwarenessDetails" value={formData.caretakerAwarenessDetails} onChange={handleChange}></textarea>
        </div>

        <h3>Section 6: Surroundings</h3>
        {["house", "surroundings", "bedroom", "bed", "dress"].map((field) => (
          <div className="DHCAdd-field" key={field}>
            <label>{field.charAt(0).toUpperCase() + field.slice(1)} Cleanliness:</label>
            <select name={`${field}Cleanliness`} value={formData[`${field}Cleanliness`]} onChange={handleChange} required>
              <option value="clean">Clean</option>
              <option value="unclean">Unclean</option>
              <option value="average">Average</option>
            </select>
          </div>
        ))}

        <h3>Section 7: General Matters</h3>
        <div className="DHCAdd-field">
          <label>General Status:</label>
          <select name="generalStatus" value={formData.generalStatus} onChange={handleChange} required>
            <option value="stable">Stable</option>
            <option value="unstable">Unstable</option>
          </select>
        </div>
        <div className="DHCAdd-field">
          <label>Patient Currently:</label>
          <select name="patientCurrently" value={formData.patientCurrently} onChange={handleChange} required>
            <option value="sitting">Sitting</option>
            <option value="standing">Standing</option>
          </select>
        </div>
        <div className="DHCAdd-field">
          <label>Memory Status:</label>
          <select name="memoryStatus" value={formData.memoryStatus} onChange={handleChange} required>
            <option value="remember">Remember</option>
            <option value="not remember">Not Remember</option>
          </select>
        </div>
        <div className="DHCAdd-field">
          <label>Response Status:</label>
          <select name="responseStatus" value={formData.responseStatus} onChange={handleChange} required>
            <option value="good">Good</option>
            <option value="bad">Bad</option>
          </select>
        </div>
        <div className="DHCAdd-field">
          <label>Activity Score:</label>
          <select name="activityScore" value={formData.activityScore} onChange={handleChange} required>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
        </div>

        <h3>Section 8: Head to Foot Checkup</h3>
        {["scalp", "hair", "skin", "nails", "mouth", "perineum", "hiddenSpaces", "pressureSpaces", "joints"].map((field) => (
          <div className="DHCAdd-field" key={field}>
            <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
            <select name={field} value={formData[field]} onChange={handleChange} required>
              <option value="Good">Good</option>
              <option value="Bad">Bad</option>
              <option value="Average">Average</option>
            </select>
          </div>
        ))}

        <h3>Section 9: Vital Signs</h3>
        <div className="DHCAdd-vitalSigns">
          <div className="DHCAdd-field">
            <label>BP (UL/LL):</label>
            <input type="text" name="bpUlLl" value={formData.bpUlLl} onChange={handleChange} />
          </div>
          <div className="DHCAdd-field">
            <label>BP (RT/LT):</label>
            <input type="text" name="bpRtLt" value={formData.bpRtLt} onChange={handleChange} />
          </div>
          <div className="DHCAdd-field">
            <label>BP (Sitting/Lying):</label>
            <input type="text" name="bpSittingLying" value={formData.bpSittingLying} onChange={handleChange} />
          </div>
        </div>
        <div className="DHCAdd-vitalSigns">
          <div className="DHCAdd-field">
            <label>RR:</label>
            <input type="text" name="rr" value={formData.rr} onChange={handleChange} placeholder="Mt" />
          </div>
          <div className="DHCAdd-field">
            <label>RR Type:</label>
            <select name="rrType" value={formData.rrType} onChange={handleChange} required>
              <option value="R">R</option>
              <option value="IR">IR</option>
            </select>
          </div>
        </div>
        <div className="DHCAdd-vitalSigns">
          <div className="DHCAdd-field">
            <label>Pulse:</label>
            <input type="text" name="pulse" value={formData.pulse} onChange={handleChange} placeholder="Mt" />
          </div>
          <div className="DHCAdd-field">
            <label>Pulse Type:</label>
            <select name="pulseType" value={formData.pulseType} onChange={handleChange} required>
              <option value="R">R</option>
              <option value="IR">IR</option>
            </select>
          </div>
        </div>
        <div className="DHCAdd-vitalSigns">
          <div className="DHCAdd-field">
            <label>Temperature:</label>
            <input type="text" name="temperature" value={formData.temperature} onChange={handleChange} placeholder="Fahrenheit" />
          </div>
          <div className="DHCAdd-field">
            <label>Temperature Type:</label>
            <select name="temperatureType" value={formData.temperatureType} onChange={handleChange} required>
              <option value="O">O</option>
              <option value="A">A</option>
              <option value="R">R</option>
            </select>
          </div>
        </div>
        <div className="DHCAdd-vitalSigns">
          <div className="DHCAdd-field">
            <label>SpO2:</label>
            <input type="text" name="spo2" value={formData.spo2} onChange={handleChange} placeholder="%" />
          </div>
        </div>
        <div className="DHCAdd-vitalSigns">
          <div className="DHCAdd-field">
            <label>GCS:</label>
            <input type="text" name="gcs" value={formData.gcs} onChange={handleChange} placeholder="/15" />
          </div>
        </div>
        <div className="DHCAdd-vitalSigns">
          <div className="DHCAdd-field">
            <label>GRBS:</label>
            <input type="text" name="grbs" value={formData.grbs} onChange={handleChange} placeholder="mg/dl" />
          </div>
        </div>

        <h3>Section 10: Summary Discussion</h3>
        <div className="DHCAdd-field">
          <label>Special Care Areas:</label>
          <textarea name="specialCareAreas" value={formData.specialCareAreas} onChange={handleChange}></textarea>
        </div>
        <div className="DHCAdd-field">
          <label>Medical Examination:</label>
          <textarea name="medicalExamination" value={formData.medicalExamination} onChange={handleChange}></textarea>
        </div>
        <div className="DHCAdd-field">
          <label>Summary Discussion:</label>
          <textarea name="summaryDiscussion" value={formData.summaryDiscussion} onChange={handleChange}></textarea>
        </div>
        <div className="DHCAdd-field">
          <label>Medicine Changes:</label>
          <textarea name="medicineChanges" value={formData.medicineChanges} onChange={handleChange}></textarea>
        </div>
        <div className="DHCAdd-field">
          <label>Other Activities:</label>
          <textarea name="otherActivities" value={formData.otherActivities} onChange={handleChange}></textarea>
        </div>
        <div className="DHCAdd-field">
          <label>Home Care Plan:</label>
          <select name="homeCarePlan" value={formData.homeCarePlan} onChange={handleChange} required>
            <option value="def">DEF</option>
            <option value="jef">JEF</option>
          </select>
        </div>
        <div className="DHCAdd-field">
          <label>Home Care Type:</label>
          <select name="homeCareType" value={formData.homeCareType} onChange={handleChange} required>
            <option value="dhc">DHC</option>
            <option value="nhc">NHC</option>
          </select>
        </div>
        <div className="DHCAdd-field">
          <label>Consultation:</label>
          <textarea name="consultation" value={formData.consultation} onChange={handleChange}></textarea>
        </div>

        <button type="submit" className="DHCAdd-submitButton" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        toastStyle={{ marginTop: "20px" }}
      />
    </div>
  );
};

export default DHC;