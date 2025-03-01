import React, { useState, useEffect } from "react";
import { db } from "../Firebase/config"; // Adjust the path if necessary
import { collection, getDocs } from "firebase/firestore";
import "./PatientTable.css";
import { useNavigate } from "react-router-dom";
import { FaFilter } from "react-icons/fa";

const PatientTable = () => {
  const [patients, setPatients] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState("All"); // Filter by diagnosis
  const [sortOrder, setSortOrder] = useState("desc"); // Default to descending
  const [sortBy, setSortBy] = useState("registernumber"); // Default sort by register number
  const [selectedStatus, setSelectedStatus] = useState("All"); // Filter by active/inactive
  const patientsPerPage = 100; // Show 100 cards per page
  const navigate = useNavigate();

  // Fetch patients from Firestore
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setIsLoading(true);
        const querySnapshot = await getDocs(collection(db, "Patients"));
        const patientsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPatients(patientsData);
        setFilteredPatients(patientsData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching patients: ", error);
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // Normalize diagnosis string into an array
  const normalizeDiagnosis = (diagnosis) => {
    if (!diagnosis) return [];
    return diagnosis.split(",").map((d) => d.trim());
  };

  // Filter and sort patients
  useEffect(() => {
    let filtered = patients.filter((patient) => {
      const name = patient.name || "";
      const address = patient.address || "";
      const caretakerPhone = patient.mainCaretakerPhone || "";
      const mainDiagnosis = patient.mainDiagnosis || "";
      const registernumber = patient.registernumber || "";
      const isDeactivated = patient.deactivated || false;

      // Search filter
      const matchesSearchQuery =
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        caretakerPhone.includes(searchQuery) ||
        mainDiagnosis.toLowerCase().includes(searchQuery.toLowerCase()) ||
        registernumber.includes(searchQuery);

      // Diagnosis filter
      const normalizedDiagnosis = normalizeDiagnosis(mainDiagnosis);
      const matchesDiagnosis =
        selectedDiagnosis === "All" || normalizedDiagnosis.includes(selectedDiagnosis);

      // Status filter (Active / Inactive)
      const matchesStatus =
        selectedStatus === "All" ||
        (selectedStatus === "Active" && !isDeactivated) ||
        (selectedStatus === "Inactive" && isDeactivated);

      return matchesSearchQuery && matchesDiagnosis && matchesStatus;
    });

    // Sort patients
    if (sortBy === "name") {
      filtered.sort((a, b) => {
        const nameA = a.name || "";
        const nameB = b.name || "";
        return sortOrder === "asc"
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      });
    } else if (sortBy === "registernumber") {
      filtered.sort((a, b) => {
        const parseRegisterNumber = (reg) => {
          if (!reg) return { number: Infinity, year: Infinity };
          const parts = reg.split("/");
          const number = parseInt(parts[0]) || 0;
          const year = parts[1] ? 2000 + parseInt(parts[1]) : 0;
          return { number, year };
        };

        const regA = parseRegisterNumber(a.registernumber);
        const regB = parseRegisterNumber(b.registernumber);

        if (regA.year !== regB.year) {
          return sortOrder === "asc" ? regA.year - regB.year : regB.year - regA.year;
        }
        return sortOrder === "asc" ? regA.number - regB.number : regB.number - regA.number;
      });
    }

    setFilteredPatients(filtered);
    setCurrentPage(1); // Reset to the first page on filter or sort change
  }, [searchQuery, selectedDiagnosis, selectedStatus, sortOrder, sortBy, patients]);

  // Pagination logic
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient);

  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);

  // Get unique diagnoses for the filter dropdown
  const uniqueDiagnoses = [
    "All",
    ...new Set(
      patients
        .flatMap((patient) => normalizeDiagnosis(patient.mainDiagnosis))
        .filter(Boolean)
    ),
  ];

  // Handle card click to navigate to patient details
  const handleCardClick = (patientId) => {
    navigate(`/main/patient/${patientId}`);
  };

  // Pagination handlers
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="PatientTable-container">
      <button className="PatientTable-back-button" onClick={() => navigate(-1)}>
        <i className="bi bi-arrow-left"></i> Back
      </button>

      {/* Display total number of patients */}
      <div className="PatientTable-total-count">
        Total Patients: {filteredPatients.length}
      </div>

      {/* Search bar and filter toggle */}
      <div className="PatientTable-search-filter-container">
        <div className="PatientTable-search-bar">
          <input
            type="text"
            placeholder="Search by name, phone number, address, diagnosis, or register number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button
          className="PatientTable-filter-toggle mb-4"
          onClick={() => setShowFilters(!showFilters)}
          title={showFilters ? "Hide Filters" : "Show Filters"}
        >
          <FaFilter /> {/* Filter icon */}
        </button>
      </div>

      {/* Filter box */}
      {showFilters && (
        <div className="PatientTable-filters-box">
          <div className="PatientTable-filters">
            <label>
              Filter by Diagnosis:
              <select value={selectedDiagnosis} onChange={(e) => setSelectedDiagnosis(e.target.value)}>
                {uniqueDiagnoses.map((diagnosis) => (
                  <option key={diagnosis} value={diagnosis}>
                    {diagnosis}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Filter by Status:
              <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                <option value="All">All</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </label>

            <label>
              Sort by:
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="name">Name</option>
                <option value="registernumber">Register Number</option>
              </select>
            </label>

            <label>
              Order:
              <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </label>
          </div>
        </div>
      )}

      {/* Loading indicator */}
      {isLoading ? (
        <div className="PatientTable-loading-indicator">
          <div className="loading-container">
            <img
              src="https://media.giphy.com/media/YMM6g7x45coCKdrDoj/giphy.gif"
              alt="Loading..."
              className="loading-image"
            />
          </div>
        </div>
      ) : (
        <>
          {/* Patient cards */}
          <div className="PatientTable-patient-cards">
            {currentPatients.map((patient) => (
              <div key={patient.id} className="PatientTable-patient-card" onClick={() => handleCardClick(patient.id)}>
                <div className="PatientTable-profile-pic">
                  <img src="https://assets-v2.lottiefiles.com/a/c529e71e-1150-11ee-952a-73e31b65ab2d/TiH0Dha3Qs.gif" alt="" />
                </div>
                <div className="PatientTable-patient-info">
                  <h5>{patient.registernumber || "N/A"}</h5>
                  <h5>{patient.name || "N/A"}</h5>
                  <p>{patient.address || "N/A"}</p>
                  <p>{patient.mainCaretakerPhone || "N/A"}</p>
                  <p>
                    {normalizeDiagnosis(patient.mainDiagnosis).join(", ") || "N/A"}
                  </p>
                  <p style={{ display: "flex", alignItems: "center", gap: "8px", color: patient.deactivated ? "red" : "green" }}>
                    <span
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        backgroundColor: patient.deactivated ? "red" : "green",
                        display: "inline-block",
                      }}
                    ></span>
                    {patient.deactivated ? "Inactive" : "Active"}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="PatientTable-pagination">
            <button onClick={handlePreviousPage} disabled={currentPage === 1} className="PatientTable-pagination-btn">
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button onClick={handleNextPage} disabled={currentPage === totalPages} className="PatientTable-pagination-btn">
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PatientTable;