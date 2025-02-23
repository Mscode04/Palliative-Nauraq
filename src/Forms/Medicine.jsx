import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Select from "react-select";
import { db } from "../Firebase/config";
import { collection, query, where, getDocs, addDoc, updateDoc, doc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./MedAdd.css";

const Medicine = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formFields, setFormFields] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [medicineOptions, setMedicineOptions] = useState([]);

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

        const medicineQuery = query(collection(db, "Medicines"), where("patientId", "==", patientId));
        const medicineSnapshot = await getDocs(medicineQuery);

        if (!medicineSnapshot.empty) {
          const medicinesData = medicineSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setMedicines(medicinesData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchMedicines = async () => {
      try {
        const medicineQuery = query(collection(db, "medibase"));
        const medicineSnapshot = await getDocs(medicineQuery);

        const options = medicineSnapshot.docs.map((doc) => ({
          value: doc.data().name,
          label: doc.data().name,
        }));

        setMedicineOptions(options);
      } catch (error) {
        console.error("Error fetching medicines:", error);
      }
    };

    fetchPatientData();
    fetchMedicines();
  }, [patientId]);

  const handleInputChange = (index, name, value) => {
    const updatedFields = [...formFields];
    updatedFields[index][name] = value;
    setFormFields(updatedFields);
  };

  const addMedicineField = () => {
    setFormFields([...formFields, { medicine: null, newMedicine: "", quantity: "", time: "Morning", patientsNow: false }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const currentDate = new Date().toISOString();

      // Check if new medicines are added and add them to the medibase collection
      for (const field of formFields) {
        if (field.newMedicine && !medicineOptions.some(option => option.value === field.newMedicine)) {
          await addDoc(collection(db, "medibase"), {
            name: field.newMedicine,
          });

          // Update the medicineOptions state
          setMedicineOptions(prevOptions => [
            ...prevOptions,
            { value: field.newMedicine, label: field.newMedicine },
          ]);
        }
      }

      const medicinesData = formFields.map((field) => ({
        medicineName: field.newMedicine || field.medicine?.value,
        quantity: field.quantity,
        time: field.time,
        patientsNow: field.patientsNow,
      }));

      if (isEditing) {
        const medicineRef = doc(db, "Medicines", medicines[0].id); // Assuming only one entry per patient
        await updateDoc(medicineRef, { medicines: medicinesData });
        toast.success("Medicines updated successfully!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        const reportData = {
          patientId,
          patientDetails: patientData,
          medicines: medicinesData,
          submittedAt: currentDate,
        };
        await addDoc(collection(db, "Medicines"), reportData);
        toast.success("Medicines saved successfully!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }

      setMedicines(medicinesData);
      setFormFields([]);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving medicines:", error);
      toast.error("Error saving medicines. Please try again.", {
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
    <div className="MedAdd-container">
      <button className="MedAdd-backButton" onClick={() => navigate(-1)}>
        &larr; Back
      </button>
      <h2 className="MedAdd-title">Manage Medicines for Patient ID: {patientId}</h2>
      {patientData ? (
        <div className="MedAdd-patientInfo">
           <h3 style={{color:"black"}}>Patient Medicines</h3>
          <h3><strong>Name:</strong> {patientData.name}</h3>
          <h3><strong>Address:</strong> {patientData.address}</h3>
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

      {medicines.length > 0 ? (
        <div className="MedAdd-existingMedicines">
          <h3>Existing Medicines</h3>
          <table className="MedAdd-table">
            <thead>
              <tr>
                <th>Medicine Name</th>
                <th>Quantity</th>
                <th>Time</th>
                <th>Patients Show</th>
              </tr>
            </thead>
            <tbody>
              {medicines.length > 0 && medicines[0].medicines ? (
                medicines[0].medicines.map((medicine, index) => (
                  <tr key={index}>
                    <td data-label="Medicine Name">{medicine.medicineName}</td>
                    <td data-label="Quantity">{medicine.quantity}</td>
                    <td data-label="Time">{medicine.time}</td>
                    <td data-label="Patients Now">{medicine.patientsNow ? "Yes" : "No"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No medicines available.</td>
                </tr>
              )}
            </tbody>
          </table>

          <button
            onClick={() => navigate(`/main/update-medicines/${patientId}`)} // Navigate to the update route
            className="MedAdd-updateButton"
          >
            Update Medicines
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="MedAdd-form">
          <h3>Add Medicines</h3>
          {formFields.map((field, index) => (
            <div key={index} className="MedAdd-field">
              <label>
                Medicine Name:
                <Select
                  options={medicineOptions}
                  value={field.medicine}
                  onChange={(selectedOption) => handleInputChange(index, "medicine", selectedOption)}
                  placeholder="Select Medicine"
                  isClearable
                />
                <span>or Add New:</span>
                <input
                  type="text"
                  name="newMedicine"
                  value={field.newMedicine}
                  placeholder="New Medicine"
                  onChange={(e) => handleInputChange(index, "newMedicine", e.target.value)}
                />
              </label>
              <label>
                Quantity:
                <input
                  type="number"
                  name="quantity"
                  value={field.quantity}
                  onChange={(e) => handleInputChange(index, "quantity", e.target.value)}
                />
              </label>
              <label>
                Time:
                <select
                  name="time"
                  value={field.time}
                  onChange={(e) => handleInputChange(index, "time", e.target.value)}
                >
                  <option value="Mor-Noon-Eve">Mor-Noon-Eve</option>
                  <option value="Mor-Noon">Mor-Noon</option>
                  <option value="Mor-Eve">Mor-Eve</option>
                  <option value="Noon-Eve">Noon-Eve</option>
                  <option value="Mor">Morning</option>
                  <option value="Noon">Noon</option>
                  <option value="Eve">Evening</option>
                  <option value="SOS">SOS</option>
                  <option value="If Required">If Required</option>
                </select>
              </label>
              <label>
                Patients Show:
                <input
                  type="checkbox"
                  name="patientsNow"
                  checked={field.patientsNow}
                  onChange={(e) => handleInputChange(index, "patientsNow", e.target.checked)}
                />
              </label>
            </div>
          ))}
          <button type="button" onClick={addMedicineField} className="MedAdd-addButton">
            Add More
          </button>
          <button type="submit" className="MedAdd-submitButton" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Save Medicines"}
          </button>
        </form>
      )}

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

export default Medicine;