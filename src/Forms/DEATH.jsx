import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../Firebase/config";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./DeathAdd.css";

const DEATH = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState(null);
  const [formData, setFormData] = useState({
    date: "",
    timeOfDeath: "",
    deathReason: "",
    team1:"",
    visitedHospital: "No",
    deathPlace: "",
    formType: "DEATH",
    submittedAt: "",
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
      toast.success("Death report submitted successfully!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
  
      // Redirect to /patient/:patientId after 3 seconds
      setTimeout(() => {
        navigate(-1);
      }, 3000);
  
      setFormData({
        date: "",
        timeOfDeath: "",
        deathReason: "",
        visitedHospital: "No",
        deathPlace: "",
        formType: "DEATH",
        submittedAt: "",
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
    <div className="DeathAdd-container">
      <button className="DeathAdd-backButton" onClick={() => navigate(-1)}>
        &larr; Back
      </button>

      <h2 className="DeathAdd-title">DEATH Details for Patient ID: {patientId}</h2>
      {patientData ? (
        <div className="DeathAdd-patientInfo">
          <h3 style={{color:"black"}}>Patient Information</h3>
          <h3 ><strong>Name:</strong> {patientData.name}</h3>
          <h3 ><strong>Address:</strong> {patientData.address}</h3>
          
        </div>
      ) : (
        <div className="loading-container">
        <img
          src="https://media.giphy.com/media/YMM6g7x45coCKdrDoj/giphy.gif"
          alt="Loading..."
          className="loading-image"
        />
      </div>
      )}

      <form onSubmit={handleSubmit} className="DeathAdd-form">
        <h3>Death Details</h3>
        <div className="DeathAdd-field">
          <label>Date of Death:</label>
          <input type="date" name="date" value={formData.date} onChange={handleChange} required />
        </div>
        <div className="DeathAdd-field">
          <label>Reported By:</label>
          <input type="text" name="team1" value={formData.team1} onChange={handleChange} required />
        </div>
        <div className="DeathAdd-field">
          <label>Time of Death:</label>
          <input type="time" name="timeOfDeath" value={formData.timeOfDeath} onChange={handleChange} required />
        </div>
        <div className="DeathAdd-field">
          <label>Reason for Death:</label>
          <textarea name="deathReason" value={formData.deathReason} onChange={handleChange} required></textarea>
        </div>
        <div className="DeathAdd-field">
          <label>Visited Hospital:</label>
          <select name="visitedHospital" value={formData.visitedHospital} onChange={handleChange} required>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <div className="DeathAdd-field">
          <label>Place of Death:</label>
          <input type="text" name="deathPlace" value={formData.deathPlace} onChange={handleChange} required />
        </div>

        <button type="submit" className="DeathAdd-submitButton" disabled={isSubmitting}>
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

export default DEATH;