import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../Firebase/config";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Progression.css";

const Progression = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState(null);
  const [formData, setFormData] = useState({
    timeIn: "",
    timeOut: "",
    hcSiNo: "",
    dnvsphcNumber: "",
    monthly: "",
    lastHomeCare: "",
    lastHomeCareDate: "",
    consultationHospitalisation: "No",
    mainActivities: "",
    physicalService: "No",
    primaryOnce: "",
    patientAwareness: "No",
    familyAwareness: "No",
    financially: "No",
    emotionalState: "No",
    caretaker: "No",
    caretakerType: "ee",
    communitySupport: "No",
    palliativeTeamSupport: "No",
    environmentalHygiene: "No",
    headToFootCheckup: "No",
    silentTapes: "",
    activityMobility: "No",
    glassglow: "No",
    generalCondition: "No",
    careStatus: "No",
    qualityOfLife: "No",
    logistic: "No",
    hcPlan: "",
    team1: "arun",
    team2: "",
    team3: "",
    team4: "",
    submittedAt: "",
    formType: "PROGRESSION REPORT",
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
      toast.success("Report submitted successfully!", {
        position: "top-center",
        autoClose: 3000,
      });

      setFormData({
        timeIn: "",
        timeOut: "",
        hcSiNo: "",
        dnvsphcNumber: "",
        monthly: "",
        lastHomeCare: "",
        lastHomeCareDate: "",
        consultationHospitalisation: "No",
        mainActivities: "",
        physicalService: "No",
        primaryOnce: "",
        patientAwareness: "No",
        familyAwareness: "No",
        financially: "No",
        emotionalState: "No",
        caretaker: "No",
        caretakerType: "ee",
        communitySupport: "No",
        palliativeTeamSupport: "No",
        environmentalHygiene: "No",
        headToFootCheckup: "No",
        silentTapes: "",
        activityMobility: "No",
        glassglow: "No",
        generalCondition: "No",
        careStatus: "No",
        qualityOfLife: "No",
        logistic: "No",
        hcPlan: "",
        team1: "arun",
        team2: "",
        team3: "",
        team4: "",
        submittedAt: "",
        formType: "PROGRESSION REPORT",
      });
    } catch (error) {
      console.error("Error adding document: ", error);
      toast.error("Error submitting the report. Please try again.", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="PROAdd-container">
      <button className="PROAdd-back-btn" onClick={() => navigate(-1)}>
        <i className="fa fa-arrow-left"></i> Back
      </button>

      <h2>Progression Report for Patient ID: {patientId}</h2>
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

      <form onSubmit={handleSubmit} className="PROAdd-form">
        <h3>Section 1: General Details</h3>
        <label>
          Time In:
          <input type="time" name="timeIn" value={formData.timeIn} onChange={handleChange} />
        </label>
        <label>
          Time Out:
          <input type="time" name="timeOut" value={formData.timeOut} onChange={handleChange} />
        </label>
        <label>
          HC SI No:
          <input type="text" name="hcSiNo" value={formData.hcSiNo} onChange={handleChange} />
        </label>
        <label>
          D/N/V/SPHC Number:
          <input type="text" name="dnvsphcNumber" value={formData.dnvsphcNumber} onChange={handleChange} />
        </label>
        <label>
          Monthly:
          <input type="text" name="monthly" value={formData.monthly} onChange={handleChange} />
        </label>
        <label>
          Last Home Care:
          <input type="text" name="lastHomeCare" value={formData.lastHomeCare} onChange={handleChange} />
        </label>
        <label>
          Last Home Care Date:
          <input type="date" name="lastHomeCareDate" value={formData.lastHomeCareDate} onChange={handleChange} />
        </label>
        <label>
          Consultation/Hospitalisation:
          <select name="consultationHospitalisation" value={formData.consultationHospitalisation} onChange={handleChange}>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </label>
        <label>
          Main Activities:
          <textarea name="mainActivities" value={formData.mainActivities} onChange={handleChange}></textarea>
        </label>
        <label>
          Physical Service:
          <select name="physicalService" value={formData.physicalService} onChange={handleChange}>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </label>
        <label>
          The Primary Once:
          <input type="text" name="primaryOnce" value={formData.primaryOnce} onChange={handleChange} />
        </label>
        <label>
          Patient Awareness:
          <select name="patientAwareness" value={formData.patientAwareness} onChange={handleChange}>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </label>
        <label>
          Family Awareness:
          <select name="familyAwareness" value={formData.familyAwareness} onChange={handleChange}>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </label>
        <label>
          Financially:
          <select name="financially" value={formData.financially} onChange={handleChange}>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </label>
        <label>
          Emotional State:
          <select name="emotionalState" value={formData.emotionalState} onChange={handleChange}>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </label>
        <label>
          Caretaker:
          <select name="caretaker" value={formData.caretaker} onChange={handleChange}>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </label>
        <label>
          Caretaker Type:
          <select name="caretakerType" value={formData.caretakerType} onChange={handleChange}>
            <option value="ee">EE</option>
            <option value="rr">RR</option>
          </select>
        </label>
        <label>
          Community Support:
          <select name="communitySupport" value={formData.communitySupport} onChange={handleChange}>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </label>
        <label>
          Palliative Team Support:
          <select name="palliativeTeamSupport" value={formData.palliativeTeamSupport} onChange={handleChange}>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </label>
        <label>
          Environmental Hygiene:
          <select name="environmentalHygiene" value={formData.environmentalHygiene} onChange={handleChange}>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </label>
        <label>
          Head to Foot Checkup:
          <select name="headToFootCheckup" value={formData.headToFootCheckup} onChange={handleChange}>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </label>
        <label>
          Silent Tapes:
          <input type="text" name="silentTapes" value={formData.silentTapes} onChange={handleChange} />
        </label>
        <label>
          Activity Mobility:
          <select name="activityMobility" value={formData.activityMobility} onChange={handleChange}>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </label>
        <label>
          Glassglow:
          <select name="glassglow" value={formData.glassglow} onChange={handleChange}>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </label>
        <label>
          General Condition:
          <select name="generalCondition" value={formData.generalCondition} onChange={handleChange}>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </label>
        <label>
          Care Status:
          <select name="careStatus" value={formData.careStatus} onChange={handleChange}>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </label>
        <label>
          Quality of Life:
          <select name="qualityOfLife" value={formData.qualityOfLife} onChange={handleChange}>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </label>
        <label>
          Logistic:
          <select name="logistic" value={formData.logistic} onChange={handleChange}>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </label>
        <label>
          HC Plan:
          <input type="text" name="hcPlan" value={formData.hcPlan} onChange={handleChange} />
        </label>
        <label>
          Team 1:
          <select name="team1" value={formData.team1} onChange={handleChange}>
            <option value="arun">Arun</option>
            <option value="hashir">Hashir</option>
          </select>
        </label>
        <label>
          Team 2:
          <input type="text" name="team2" value={formData.team2} onChange={handleChange} />
        </label>
        <label>
          Team 3:
          <input type="text" name="team3" value={formData.team3} onChange={handleChange} />
        </label>
        <label>
          Team 4:
          <input type="text" name="team4" value={formData.team4} onChange={handleChange} />
        </label>

        <button type="submit" className="PROAdd-submit-btn" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Progression;