// src/Main/LandingPage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaClinicMedical,
  FaUserNurse,
  FaHeartbeat,
  FaMobileAlt,
  FaChalkboardTeacher,
  FaCheckCircle,
  FaGooglePlay,
  FaFileMedical,
  FaClock,
  FaRobot,
  FaRegChartBar,
  FaPlay,
  FaApple
} from "react-icons/fa";

import logo from '../assets/img/logo-1.png';
import successImage from '../assets/img/award.jpg';
import successImage1 from '../assets/img/red.jpg';
import "./LandingPage.css";

const LandingPage = ({ isAuthenticated, isNurse }) => {
    const navigate = useNavigate();
    const [installPrompt, setInstallPrompt] = useState(null);
    const [isInstalled, setIsInstalled] = useState(false);
    const [videoModalOpen, setVideoModalOpen] = useState(false);

    useEffect(() => {
        const handleBeforeInstallPrompt = (event) => {
            event.preventDefault();
            setInstallPrompt(event);
        };

        // Check if app is installed
        if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
            setIsInstalled(true);
        }

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', () => setIsInstalled(true));

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', () => setIsInstalled(true));
        };
    }, []);

    const handleLoginRedirect = () => navigate("/login");
    const handleProfileRedirect = () => {
        isNurse ? navigate("/main") : navigate(`/users/${localStorage.getItem("patientId")}`);
    };
    const handleAboutRedirect = () => navigate("/about");

    const handleInstallClick = async () => {
        if (installPrompt) {
            installPrompt.prompt();
            const { outcome } = await installPrompt.userChoice;
            if (outcome === 'accepted') {
                console.log('User accepted the install prompt');
                setIsInstalled(true);
            }
            setInstallPrompt(null);
        }
    };

    const toggleVideoModal = () => setVideoModalOpen(!videoModalOpen);

const features = [
    {
        icon: <FaHeartbeat className="feature-icon" />,
        title: "Real-time Monitoring",
        description: "Continuous tracking of vital signs and symptoms for proactive care management."
    },
    {
        icon: <FaUserNurse className="feature-icon" />,
        title: "Care Team Coordination",
        description: "Seamless communication between doctors, nurses, and caregivers."
    },
    {
        icon: <FaFileMedical className="feature-icon" />,
        title: "Case Management",
        description: "Quick case additions with easy-to-navigate reports, filters, and search functionalities."
    },
    {
        icon: <FaClock className="feature-icon" />,
        title: "Efficient Scheduling System",
        description: "Automated and manual scheduling for catheter changes and home visits to optimize workflow."
    },
    {
        icon: <FaRobot className="feature-icon" />,
        title: "AI Chatbot Assistance",
        description: "24/7 intelligent support for users to streamline queries and improve engagement."
    },
    {
        icon: <FaRegChartBar className="feature-icon" />,
        title: "Insightful Reporting Tools",
        description: "Access annual and individual reports with enhanced admin-level visibility and analytics."
    }
];


    const stats = [
        { value: "400+", label: "Patients" },
        { value: "120000+", label: "Home Care Visits" },
        { value: "500+", label: "Volenterrs" },
        { value: "10+", label: "Trained Professionals" }
    ];

    return (
        <div className="landing-page app-style">
            {/* Navbar */}
            <nav className="app-navbar">
                <div className="navbar-container">
                    <div className="logo-container">
                        <img src={logo} alt="Neu Health Care Logo" className="logo" />
                        <span className="navbar-logo-tx">euraq Care</span>
                    </div>
                    
                    <div className="nav-buttons">
                        {isAuthenticated ? (
                            <button className="nav-button primary" onClick={handleProfileRedirect}>
                                My Profile
                            </button>
                        ) : (
                            <button className="nav-button outline" onClick={handleLoginRedirect}>
                                Login
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <h1>Palliative Care Makkaraparamba</h1>
                    <p className="hero-subtitle">
                        Revolutionizing Palliative Care with <span style={{ color: '#2564eb', fontWeight: 'bold' }}>Neuraq</span>, Compassionate Healthcare Solutions.
                    </p>
                    
                    <div className="hero-cta">
                        {isInstalled ? (
                            <>
                                {isAuthenticated ? (
                                    <button className="cta-button primary me-2" onClick={handleProfileRedirect}>
                                        <FaUserNurse className="cta-icon" />
                                        Go to Profile
                                    </button>
                                ) : (
                                    <button className="cta-button primary me-2" onClick={handleLoginRedirect}>
                                        <FaUserNurse className="cta-icon" />
                                        Login
                                    </button>
                                )}
                                <button className="cta-button outline" onClick={handleAboutRedirect}>
                                    <FaClinicMedical className="cta-icon" />
                                    About Us
                                </button>
                            </>
                        ) : (
                            <button className="cta-button primary" onClick={handleInstallClick}>
                                <FaMobileAlt className="cta-icon" />
                                Install App
                            </button>
                        )}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="">
                <div className="section-container">
                    <div className="stats-grid">
                        {stats.map((stat, index) => (
                            <div key={index} className="stat-card">
                                <div className="stat-value">{stat.value}</div>
                                <div className="stat-label">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="section-container">
                    <div className="section-header">
                        <h2>Key Features</h2>
                        <p className="section-subtitle">
                            Everything you need for comprehensive palliative care
                        </p>
                    </div>
                    
                    <div className="features-grid">
                        {features.map((feature, index) => (
                            <div key={index} className="feature-card">
                                <div className="feature-icon-container">
                                    {feature.icon}
                                </div>
                                <h3 className="feature-title">{feature.title}</h3>
                                {/* <p className="feature-description">{feature.description}</p> */}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Success Story Section */}
<section className="success-section">
    <div className="section-container">
        <div className="section-header">
            <h2 className="section-title">Our Pioneering Journey in Palliative Care</h2>
            <p className="section-subtitle">
                Where cutting-edge technology meets compassionate human care to transform lives
            </p>
        </div>
        
        <div className="success-content">
            {/* Video Section */}
            <div className="success-media">
                <div className="success-image-container">
                    <img src={successImage1} alt="Medical team launching the Neuraq mobile app for palliative care" className="success-image" />
                    <button className="play-button" onClick={toggleVideoModal}>
                        <FaPlay className="play-icon" />
                    </button>
                </div>
            </div>
            
            <div className="success-text">
                <h3 className="success-heading">Neuraq Technologies Launches Mobile App for Palliative Care</h3>
                <div className="text-block">
                    <p>
                        On May 18, 2025, Neuraq Technologies launched a mobile application designed to enhance palliative care by streamlining patient management and reducing the burden on healthcare workers. The app simplifies communication and tracking, allowing doctors and nurses to dedicate more time to patient care.
                    </p>
                    <p>
                        The application was officially launched during the “Arike” patient gathering by Makkaraparamba Palliative in the presence of Dr. P. Unni and was conducted by Muhammad Musthafa Tharayil, MD of Tharayil Business Group.
                    </p>
                </div>
            </div>
        </div>

        {/* Additional Image Section */}
        <div className="success-content">
            <div className="success-media">
                <div className="success-image-container">
                    <img src={successImage} alt="Neuraq developers being honored at the Arike event" className="success-image" />
                </div>
            </div>
            
            <div className="success-text">
                <div className="text-block">
                    <h4 className="achievements-title">Recognizing Our Developers</h4>
                    <p>
                        During the same event, Makkaraparamba Palliative honored the Neuraq Technologies development team for their impactful contribution. The team received a memento as a token of appreciation for their role in delivering a transformative solution in healthcare through this mobile application.
                    </p>
                    <p>
                        This moment marked a significant milestone in our journey, reaffirming our commitment to leveraging technology for compassionate care delivery in rural regions.
                    </p>
                </div>
            </div>
        </div>
    </div>
</section>


            {/* App Download Section */}
            {!isInstalled && (
                <section className="download-section">
                    <div className="section-container">
                        <div className="download-content">
                            <div className="download-text">
                                <h2>Experience Better Care With Our App</h2>
                                {/* <p className="download-subtitle">
                                    Download our mobile application for seamless access to all features and real-time updates
                                </p> */}
                                <div className="app-features">
    <div className="app-feature">
        <div className="app-feature-icon">
            <FaCheckCircle />
        </div>
        <div className="app-feature-text">Free Demo</div>
    </div>
    <div className="app-feature">
        <div className="app-feature-icon">
            <FaClock />
        </div>
        <div className="app-feature-text">2 Week Free</div>
    </div>
    <div className="app-feature">
        <div className="app-feature-icon">
            <FaChalkboardTeacher />
        </div>
        <div className="app-feature-text">Free Training</div>
    </div>
</div>

                                
                                
                                <div className="download-buttons">
                                    <p href="" className="download-button android cursor-pointer" onClick={handleInstallClick}>
                                        <div className="button-content  cursor-pointer">
                                            <FaGooglePlay className="download-icon  cursor-pointer" />
                                            <div className="download-info">
                                                {/* <span className="download-label">GET IT ON</span> */}
                                                <span className="download-platform  cursor-pointer">Google Play</span>
                                            </div>
                                        </div>
                                    </p>
                                    
                                    <p href="" className="download-button ios cursor-pointer" >
                                        <div className="button-content" onClick={handleInstallClick}>
                                            <FaApple className="download-icon" />
                                            <div className="download-info">
                                                {/* <span className="download-label">Download on the</span> */}
                                                <span className="download-platform">App Store</span>
                                            </div>
                                        </div>
                                    </p>
                                </div>
                            </div>
                            
                            <div className="download-image">
                                <img 
                                    src="https://images.pexels.com/photos/5407249/pexels-photo-5407249.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                                    alt="Mobile app screens" 
                                    className="app-screenshot"
                                />
                                <div className="phone-frame"></div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Video Modal */}
            {videoModalOpen && (
                <div className="video-modal">
                    <div className="modal-content">
                        <button className="close-modal" onClick={toggleVideoModal}>
                            &times;
                        </button>
                        <div className="video-container">
                            <iframe 
                                width="560" 
                                height="315" 
                                src="https://youtu.be/74DWwSxsVSs?si=x3kLYXcQPLhrw2-q" 
                                title="YouTube video player" 
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LandingPage;