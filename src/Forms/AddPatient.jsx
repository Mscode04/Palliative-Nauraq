import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../Firebase/config";
import { collection, addDoc } from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AddPatient.css";

const AddPatient = () => {
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState({
    profile: {
      name: "",
      age: "",
      gender: "NOT SAY", // Default value for gender
      category: "", // Default value for category
      address: "",
      email: "",
      password: "",
      dob: "", // Date of Birth field
      location: "", // Will be a textarea
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

  const generatePatientId = () => {
    const min = 100000000000; // Smallest 12-digit number
    const max = 999999999999; // Largest 12-digit number
    return (Math.floor(Math.random() * (max - min + 1)) + min).toString(); // Ensure it's a string
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const patientId = generatePatientId(); // Already a string
      const registerTime = new Date().toISOString();
  
      // Convert any number fields to strings
      const profileData = {
        ...patientData.profile,
        age: patientData.profile.age.toString(), // Convert age to string
        mainCaretakerPhone: patientData.profile.mainCaretakerPhone.toString(), // Convert phone to string
        relativePhone: patientData.profile.relativePhone.toString(), // Convert phone to string
        referralPhone: patientData.profile.referralPhone.toString(), // Convert phone to string
        neighbourPhone: patientData.profile.neighbourPhone.toString(), // Convert phone to string
        communityVolunteerPhone: patientData.profile.communityVolunteerPhone.toString(), // Convert phone to string
        wardMemberPhone: patientData.profile.wardMemberPhone.toString(), // Convert phone to string
      };
  
      // Add the patient data to Firestore with the specified patientId as the document ID
      await setDoc(doc(db, "Patients", patientId), {
        ...profileData,
        ...patientData.medical,
        familyDetails: familyDetails.map((member) => ({
          ...member,
          age: member.age.toString(), // Convert family member age to string
          income: member.income.toString(), // Convert family member income to string
        })),
        registrationDate,
        registerTime,
        patientId, // Include the generated patient ID as a string
      });
  
      // Add the user data to Firestore
      await addDoc(collection(db, "users"), {
        email: patientData.profile.email,
        password: patientData.profile.password,
        patientId, // Already a string
        is_nurse: false,
      });
  
      // Show success toast
      toast.success("Patient added successfully!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
  
      // Navigate to the patient's page after 3 seconds
      setTimeout(() => {
        navigate(`/main/patient/${patientId}`);
      }, 3000);
    } catch (error) {
      // Show error toast if something goes wrong
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
              {field === "gender" ? (
                <select
                  id={field}
                  name={field}
                  className="form-control"
                  value={value}
                  onChange={(e) => handleChange(e, "profile")}
                >
                  <option value="NOT SAY">Not Say</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              ) : field === "category" ? (
                <select
                  id={field}
                  name={field}
                  className="form-control"
                  value={value}
                  onChange={(e) => handleChange(e, "profile")}
                >
                  <option value="">Select Category</option>
                  <option value="CATEGORY_1">Category 1</option>
                  <option value="CATEGORY_2">Category 2</option>
                  <option value="CATEGORY_3">Category 3</option>
                </select>
              ) : field === "location" ? (
                <textarea
                  id={field}
                  name={field}
                  value={value}
                  onChange={(e) => handleChange(e, "profile")}
                  rows="3"
                />
              ) : field === "dob" ? ( // Add DOB as a date input
                <input
                  type="date"
                  id={field}
                  name={field}
                  value={value}
                  onChange={(e) => handleChange(e, "profile")}
                />
              ) : (
                <input
                  type={
                    field === "email"
                      ? "email"
                      : field === "password"
                      ? "password"
                      : "text"
                  }
                  id={field}
                  name={field}
                  value={value}
                  onChange={(e) => handleChange(e, "profile")}
                />
              )}
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