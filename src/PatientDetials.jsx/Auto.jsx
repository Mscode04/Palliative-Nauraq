import React, { useState, useEffect } from "react";
import { db } from "../Firebase/config";
import {
  collection,
  getDoc,
  getDocs,
  doc,
  query,
  where
} from "firebase/firestore";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Divya.css";

const Auto = () => {
  const [patients, setPatients] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const formattedDate = selectedDate.toISOString().split("T")[0];

  // Calculate scheduled dates
  const getScheduledDates = (startDate, plan) => {
    const start = new Date(startDate);
    const dates = [];
    const format = (date) => date.toISOString().split("T")[0];
    
    switch (plan) {
      case "daily_7/1":
        for (let i = 0; i < 7; i++) {
          const d = new Date(start);
          d.setDate(start.getDate() + i);
          dates.push(format(d));
        }
        break;
      case "1_day_1_week_1/1":
        for (let i = 0; i < 4; i++) {
          const d = new Date(start);
          d.setDate(start.getDate() + i * 7);
          dates.push(format(d));
        }
        break;
      case "2_day_1_week_2/1":
        for (let i = 0; i < 4; i++) {
          const d1 = new Date(start);
          d1.setDate(start.getDate() + i * 7);
          const d2 = new Date(d1);
          d2.setDate(d1.getDate() + 3);
          dates.push(format(d1), format(d2));
        }
        break;
      case "3_day_1_week_3/1":
        for (let i = 0; i < 4; i++) {
          const base = new Date(start);
          base.setDate(start.getDate() + i * 7);
          dates.push(
            format(base),
            format(new Date(base.getFullYear(), base.getMonth(), base.getDate() + 2)),
            format(new Date(base.getFullYear(), base.getMonth(), base.getDate() + 4))
          );
        }
        break;
      case "1_day_2_week_1/2":
        for (let i = 0; i < 2; i++) {
          const d = new Date(start);
          d.setDate(start.getDate() + i * 14);
          dates.push(format(d));
        }
        break;
      case "1_day_1_month_1/4":
        case "1_day_1.5_month_1/6":
        case "1_day_2_month_1/8":
        case "1_day_3_month_1/12":
        default:
          break;
    }
    return dates;
  };

  useEffect(() => {
    const fetchAutoScheduledPatients = async () => {
      const plansSnapshot = await getDocs(collection(db, "Plans"));
      const autoScheduled = [];

      for (const docSnap of plansSnapshot.docs) {
        const plan = docSnap.data();
        const scheduledDates = getScheduledDates(plan.createdAt, plan.homeCarePlan);
        if (scheduledDates.includes(formattedDate)) {
          const patientDoc = await getDoc(doc(db, "Patients", plan.patientId));
          if (patientDoc.exists()) {
            const data = patientDoc.data();
            autoScheduled.push({
              id: plan.patientId,
              name: data.name,
              registernumber: data.registernumber,
              address: data.address,
              mainCaretakerPhone: data.mainCaretakerPhone,
              plan: plan.homeCarePlan,
              createdAt: plan.createdAt,
            });
          }
        }
      }
      setPatients(autoScheduled);
    };

    fetchAutoScheduledPatients();
  }, [formattedDate]);

  return (
    <div className="divya-container">
      <h2>Auto Scheduled Patients for {formattedDate}</h2>

      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        dateFormat="yyyy-MM-dd"
        className="divya-datepicker"
      />
      
      <div className="divya-patient-list">
        <h3>Scheduled Patients</h3>
        {patients.length === 0 ? (
          <p>No auto-scheduled patients for this date.</p>
        ) : (
          <table className="divya-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Name</th>
                <th>Reg Number</th>
                <th>Address</th>
                <th>Phone</th>
                <th>Plan</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient, index) => (
                <tr key={patient.id}>
                  <td>{index + 1}</td>
                  <td>{patient.name}</td>
                  <td>{patient.registernumber}</td>
                  <td>{patient.address}</td>
                  <td>{patient.mainCaretakerPhone}</td>
                  <td>{patient.plan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Auto;