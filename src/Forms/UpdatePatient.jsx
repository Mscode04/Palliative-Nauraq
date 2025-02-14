import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../Firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AddPatient.css"; // Reuse the same CSS file

const UpdatePatient = () => {
  const { patientId } = useParams(); // Get patientId from the URL
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState({
    profile: {
      name: "",
      registernumber:"",
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
    additionalInfo: "....",
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

  // Fetch existing patient data
  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const docRef = doc(db, "Patients", patientId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const patientData = docSnap.data();
          setPatientData({
            profile: patientData.profile || patientData,
            medical: patientData.medical || {},
            doctor: patientData.doctor || {},
            additionalInfo: patientData.additionalInfo || "",
            deactivated: patientData.deactivated ?? false,
          });
          setRegistrationDate(patientData.registrationDate || "");
          setFamilyDetails(patientData.familyDetails || []);
        } else {
          toast.error("Patient not found!", {
            position: "top-center",
            autoClose: 3000,
          });
          navigate("/main/patients"); // Redirect if patient not found
        }
      } catch (error) {
        console.error("Error fetching patient: ", error);
        toast.error(`Error fetching patient: ${error.message}`, {
          position: "top-center",
          autoClose: 5000,
        });
      }
    };

    fetchPatient();
  }, [patientId, navigate]);

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
      const patientRef = doc(db, "Patients", patientId);
      await updateDoc(patientRef, {
        ...patientData.profile,
        ...patientData.medical,
        familyDetails,
        registrationDate,
        deactivated: false,
      });

      toast.success("Patient updated successfully!", {
        position: "top-center",
        autoClose: 3000,
      });

      setTimeout(() => {
        navigate(`/main/patient/${patientId}`);
      }, 3000);
    } catch (error) {
      toast.error(`Failed to update patient: ${error.message}`, {
        position: "top-center",
        autoClose: 5000,
      });
    }
  };

  return (
    <div className="AddPatient-container">
      <button className="AddPatient-backButton" onClick={() => navigate(-1)}>
        &larr; Back
      </button>
      <h2 className="AddPatient-title">Update Patient</h2>
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
        {/* <h4 className="AddPatient-sectionTitle">Section 2: Medical Section</h4>
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
        </div> */}

        {/* Section 3: Doctor */}
        {/* <h4 className="AddPatient-sectionTitle">Section 3: Doctor</h4>
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
        </div> */}

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
          Update Patient
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default UpdatePatient;