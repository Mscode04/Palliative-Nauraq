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
    basicMattersNotes: "",
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
    headToFootNotes: "",
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
    bp: "",
    ulLl: "NUll", 
    position: "Null", 
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
        moreAboutBadHabits: "",
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
        homeCarePlan: "",
        
        consultation: "",
        formType: "DHC",
        submittedAt: "",
        bp: "",
        ulLl: "UL", 
        position: "Null", 
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
           <h3 style={{color:"black"}}>Patient DHC</h3>
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
  {/* Bad Habit Dropdown */}
  <label>Bad Habit:</label>
  <select name="badHabit" value={formData.badHabit} onChange={handleChange} required>
    <option value="No">No</option>
    <option value="Yes">Yes</option>
  </select>

  {/* Conditionally Render "More About Bad Habits" Field */}
  {formData.badHabit === "Yes" && (
    <div className="DHCAdd-field">
      <label>More About Bad Habits:</label>
      <input
        type="text"
        name="moreAboutBadHabits"
        value={formData.moreAboutBadHabits}
        onChange={handleChange}
        placeholder="Describe the bad habit..."
        required
      />
    </div>
  )}
</div>
        <div className="DHCAdd-field">
          <label>Complimentary Rx:</label>
          <select name="complimentaryRx" value={formData.complimentaryRx} onChange={handleChange} required>
            <option value="nill">Nill</option>
            <option value="ay">AY</option>
            <option value="h">H</option>
            <option value="u">U</option>
            <option value="sd">Sd</option>
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
      <option value="Satisfy">Satisfy</option> {/* Added for all fields */}
    </select>
  </div>
))}

{/* New Text Field for Additional Notes */}
<div className="DHCAdd-field">
  <label>Additional Notes:</label>
  <textarea
    name="basicMattersNotes"
    value={formData.basicMattersNotes}
    onChange={handleChange}
    placeholder="Enter any additional notes or observations..."
    rows={4} // Adjust the number of rows as needed
  />
</div>
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
          <label>Entertainment / Time Spending:</label>
          <input type="text" name="entertainmentTime" value={formData.entertainmentTime} onChange={handleChange} />
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
        <div className="DHCAdd-field">
          <label>Memory Status:</label>
          <select name="memoryStatus" value={formData.memoryStatus} onChange={handleChange} required>
          <option value="remember">Remember</option>
    <option value="not-remember">Do Not Remember</option>
    <option value="sometimes">Sometimes</option>
    <option value="something">Something</option> 
          </select>
        </div>
        <div className="DHCAdd-field">
          <label>Response Status:</label>
          <select name="responseStatus" value={formData.responseStatus} onChange={handleChange} required>
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
        <div className="DHCAdd-field">
          <label>Activity Score:</label>
          <select name="activityScore" value={formData.activityScore} onChange={handleChange} required>
          <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>

        <h3>Section 8: Head to Foot Checkup</h3>
{["scalp", "hair", "skin", "nails", "mouth", "perineum", "hiddenSpaces", "pressureSpaces", "joints"].map((field) => (
  <div className="DHCAdd-field" key={field}>
    <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
    <select name={field} value={formData[field]} onChange={handleChange} required>
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

{/* Extra Text Field for Additional Notes */}
<div className="DHCAdd-field">
  <label>Additional Notes:</label>
  <textarea
    name="headToFootNotes"
    value={formData.headToFootNotes}
    onChange={handleChange}
    placeholder="Enter any additional notes or observations..."
    rows={4} // Adjust the number of rows as needed
  />
</div>

        <h3>Section 9: Vital Signs</h3>
        <div className="DHCAdd-vitalSigns">
  {/* BP Input Field */}
  <div className="DHCAdd-field">
    <label>BP:</label>
    <input type="text" name="bp" value={formData.bp} onChange={handleChange} />
  </div>

  {/* Select Box for UL/LL */}
  <div className="DHCAdd-field">
    <label>UL/LL:</label>
    <select name="ulLl" value={formData.ulLl} onChange={handleChange}>
      <option value="UL">Null</option>
      <option value="UL">UL</option>
      <option value="LL">LL</option>
    </select>
  </div>

  {/* Select Box for Null, RT Sitting, RT Lying, LT Sitting, LT Lying */}
  <div className="DHCAdd-field">
    <label>Position:</label>
    <select name="position" value={formData.position} onChange={handleChange}>
      <option value="Null">Null</option>
      <option value="RT Sitting">RT Sitting</option>
      <option value="RT Lying">RT Lying</option>
      <option value="LT Sitting">LT Sitting</option>
      <option value="LT Lying">LT Lying</option>
    </select>
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
          
            <option value="daily_7_1">Daily (7/1)</option>
            <option value="1_day_1_week_1_1">1 Day 1 Week (1/1)</option>
            <option value="2_day_1_week_2_1">2 Day 1 Week (2/1)</option>
            <option value="3_day_1_week_3_1">3 Day 1 Week (3/1)</option>
            <option value="1_day_2_week_1_2">1 Day 2 Week (1/2)</option>
            <option value="1_day_1_month_1_4">1 Day 1 Month (1/4)</option>
            <option value="1_day_1.5_month_1_6">1 Day 1.5 Month (1/6)</option>
            <option value="1_day_2_month_1_8">1 Day 2 Month (1/8)</option>
            <option value="1_day_3_month_1_12">1 Day 3 Month (1/12)</option>
            <option value="sos">SOS</option>
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