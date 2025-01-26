import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../Firebase/config";
import { collection, addDoc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AddPatient.css";

const AddPatient = () => {
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState({
    profile: {
      name: "",
      age: "",
      gender: "",
      category: "",
      address: "",
      email: "",
      password: "",
      dob: "",
      location: "",
      panchayat: "",
      ward: "",
      mainCaretaker: "",
      mainCaretakerPhone: "",
      relativePhone: "",
      referralPerson: "",
      referralPhone: "",
      neighbourName: "",
      neighbourPhone: "",
      communityVolunteer: "",
      communityVolunteerPhone: "",
      wardMember: "",
      wardMemberPhone: "",
      ashaWorker: "",
    },
    medical: {
      medicalHistory: "",
      currentDifficulties: "",
      mainDiagnosis: "",
    },
    doctor: {
      advice: "",
      note: "",
      examinations: "",
    },
    additionalInfo: "",
  });

  const [registrationDate, setRegistrationDate] = useState("");
  const [familyDetails, setFamilyDetails] = useState([
    {
      name: "",
      relation: "",
      age: "",
      education: "",
      income: "",
      marriageStatus: "",
      remark: "",
    },
  ]);

  const handleChange = (e, section) => {
    const { name, value } = e.target;
    setPatientData((prevData) => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [name]: value,
      },
    }));
  };

  const handleFamilyDetailsChange = (index, e) => {
    const { name, value } = e.target;
    const updatedFamilyDetails = [...familyDetails];
    updatedFamilyDetails[index][name] = value;
    setFamilyDetails(updatedFamilyDetails);
  };

  const addFamilyMember = () => {
    setFamilyDetails([
      ...familyDetails,
      {
        name: "",
        relation: "",
        age: "",
        education: "",
        income: "",
        marriageStatus: "",
        remark: "",
      },
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const registerTime = new Date().toISOString();
      const patientDoc = await addDoc(collection(db, "Patients"), {
        ...patientData.profile,
        ...patientData.medical,
        familyDetails, // Add family details to the patient data
        registrationDate,
        registerTime,
      });

      const patientId = patientDoc.id;
      await addDoc(collection(db, "users"), {
        email: patientData.profile.email,
        password: patientData.profile.password,
        patientId,
        is_nurse: false,
      });

      toast.success("Patient added successfully!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setTimeout(() => {
        navigate(`/main/patient/${patientId}`);
      }, 3000);
    } catch (error) {
      toast.error(`Failed to add patient: ${error.message}`, {
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
    <div className="AddPatient-container">
      <button className="AddPatient-backButton" onClick={() => navigate(-1)}>
        &larr; Back
      </button>
      <h2 className="AddPatient-title">Add New Patient</h2>
      <form onSubmit={handleSubmit} className="AddPatient-form">
        {/* Section 1: Profile */}
        <h4 className="AddPatient-sectionTitle">Section 1: Profile</h4>
        <div className="AddPatient-row">
          {Object.entries(patientData.profile).map(([field, value]) => (
            <div className="AddPatient-field" key={field}>
              <label htmlFor={field}>
                {field.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}:
              </label>
              <input
                type={field === "email" ? "email" : field === "password" ? "password" : "text"}
                id={field}
                name={field}
                value={value}
                onChange={(e) => handleChange(e, "profile")}
              />
            </div>
          ))}
        </div>

        {/* Section 2: Medical Section */}
        <h4 className="AddPatient-sectionTitle">Section 2: Medical Section</h4>
        <div className="AddPatient-row">
          {Object.entries(patientData.medical).map(([field, value]) => (
            <div className="AddPatient-field" key={field}>
              <label htmlFor={field}>
                {field.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}:
              </label>
              <textarea
                id={field}
                name={field}
                value={value}
                onChange={(e) => handleChange(e, "medical")}
                rows="3"
              ></textarea>
            </div>
          ))}
        </div>

        {/* Section 3: Doctor */}
        <h4 className="AddPatient-sectionTitle">Section 3: Doctor</h4>
        <div className="AddPatient-row">
          {Object.entries(patientData.doctor).map(([field, value]) => (
            <div className="AddPatient-field" key={field}>
              <label htmlFor={field}>
                {field.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}:
              </label>
              <textarea
                id={field}
                name={field}
                value={value}
                onChange={(e) => handleChange(e, "doctor")}
                rows="3"
              ></textarea>
            </div>
          ))}
        </div>

        {/* Section 4: Family Details */}
        <h4 className="AddPatient-sectionTitle">Section 4: Family Details</h4>
        {familyDetails.map((family, index) => (
          <div key={index} className="AddPatient-familyDetails">
            <h5>Family Member {index + 1}</h5>
            <div className="AddPatient-row">
              {Object.entries(family).map(([field, value]) => (
                <div className="AddPatient-field" key={field}>
                  <label htmlFor={`${field}-${index}`}>
                    {field.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}:
                  </label>
                  <input
                    type="text"
                    id={`${field}-${index}`}
                    name={field}
                    value={value}
                    onChange={(e) => handleFamilyDetailsChange(index, e)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
        <button type="button" className="AddPatient-addFamilyButton" onClick={addFamilyMember}>
          + Add Family Member
        </button>

        {/* Section 5: Additional Info */}
        <h4 className="AddPatient-sectionTitle">Section 5: Additional Info</h4>
        <div className="AddPatient-field">
          <label htmlFor="additionalInfo">Additional Information:</label>
          <textarea
            id="additionalInfo"
            name="additionalInfo"
            value={patientData.additionalInfo}
            onChange={(e) => handleChange(e, "additionalInfo")}
            rows="3"
          ></textarea>
        </div>

        {/* Registration Date */}
        <div className="AddPatient-field">
          <label htmlFor="registrationDate">Registration Date:</label>
          <input
            type="date"
            id="registrationDate"
            name="registrationDate"
            value={registrationDate}
            onChange={(e) => setRegistrationDate(e.target.value)}
            required
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="AddPatient-submitButton">
          Add Patient
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AddPatient;