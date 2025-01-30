import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../Firebase/config";
import { collection, query, where, getDocs, addDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Conditions.css";

const Conditions = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState(null);
  const [conditions, setConditions] = useState([]);
  const [condition, setCondition] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updatingConditionId, setUpdatingConditionId] = useState(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const patientQuery = query(collection(db, "Patients"), where("patientId", "==", patientId));
        const patientSnapshot = await getDocs(patientQuery);

        if (!patientSnapshot.empty) {
          const data = patientSnapshot.docs[0].data();
          setPatientData(data);
        } else {
          console.error("No patient document found with patientId:", patientId);
        }

        const conditionQuery = query(collection(db, "Conditions"), where("patientId", "==", patientId));
        const conditionSnapshot = await getDocs(conditionQuery);

        if (!conditionSnapshot.empty) {
          const conditionsData = conditionSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setConditions(conditionsData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchPatientData();
  }, [patientId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const currentDate = new Date().toISOString();

      const conditionData = {
        patientId,
        patientDetails: patientData,
        conditionName: condition,
        submittedAt: currentDate,
      };
      await addDoc(collection(db, "Conditions"), conditionData);

      toast.success("Condition saved successfully!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setConditions([...conditions, conditionData]);
      setCondition("");
    } catch (error) {
      console.error("Error saving condition:", error);
      toast.error("Error saving condition. Please try again.", {
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

  const handleDelete = async (id) => {
    try {
      const conditionRef = doc(db, "Conditions", id);
      await deleteDoc(conditionRef);

      toast.success("Condition deleted successfully!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setConditions(conditions.filter((condition) => condition.id !== id));
    } catch (error) {
      console.error("Error deleting condition:", error);
      toast.error("Error deleting condition. Please try again.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <div className="Conditions-container">
      <button className="Conditions-backButton" onClick={() => navigate(-1)}>
        &larr; Back
      </button>
      <h2 className="Conditions-title">Manage Conditions for Patient ID: {patientId}</h2>
      {patientData ? (
        <div className="Conditions-patientInfo">
          <h3 style={{color:'black'}}>Patient Conditions</h3>
          <h3><strong>Name:</strong> {patientData.name}</h3>
          <h3><strong>Address:</strong> {patientData.address}</h3>
          
        </div>
      ) : (
        <p>         <div className="loading-container">
        <img
          src="https://media.giphy.com/media/YMM6g7x45coCKdrDoj/giphy.gif"
          alt="Loading..."
          className="loading-image"
        />
      </div></p>
      )}

      {conditions.length > 0 && (
        <div className="Conditions-existingConditions">
          <h3>Existing Conditions</h3>
          <table className="Conditions-table">
            <thead>
              <tr>
                <th>Condition Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {conditions.map((condition, index) => (
                <tr key={index}>
                  <td data-label="Condition Name">{condition.conditionName}</td>
                  <td data-label="Actions">
                    <button onClick={() => handleDelete(condition.id)} className="Conditions-deleteButton">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <form onSubmit={handleSubmit} className="Conditions-form">
        <h3>Add Condition</h3>
        <label>
          
          <textarea
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            placeholder="Enter condition"
            className="form-control-lg w-100 mt-2"
          ></textarea>
        </label>
        <button type="submit" className="Conditions-submitButton" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Save Condition"}
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

export default Conditions;
