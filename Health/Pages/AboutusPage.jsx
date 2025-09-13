import React from 'react';
import Header from "../components/Header";
import Image from "../assets/download3.jpeg";
import Chatgpt from "../assets/download1.jpeg";
import Developers from "../assets/abeg.jpeg";
import Footer  from "../components/Footer";
import "../style/AboutusPage.css";
import Doctors from "../assets/doctors.jpg";


function AboutusPage() {
  const services = [
    {
      title: "Find Hospitals near you",
      description: "Search our directory of hospitals by region or service (e.g., vaccinations, pediatrics). View details, ratings, and locations on Google Maps, even on basic phones."
    },
    {
      title: "Stay Updated on Events",
      description: "Check vaccination dates, free screenings, and health seminars."
    },
    {
      title: "Get Personalised Alerts (well not really)",
      description: "Never miss a health event!"
    },
    {
      title: "Ask Questions",
      description: "Join our community Q&A to ask about local health services (e.g., 'When’s the next HIV test in Bamenda?') and get trusted answers."
    },
    {
      title: "Share Feedback",
      description: "Report issues or suggest improvements to keep our platform reliable and user-driven."
    }
  ];

  return (
    <div className="about-us-page">
      <Header />

      {/* About Us Heading */}
      <div className="mt-32 flex flex-col items-center md:items-start px-4 md:px-20">

        <p className=" about-text ">
          About
        </p>

        <div className="flex flex-col md:flex-row gap-12 mb-12 mt-8 w-full">
          {/* Left Text */}
          <div className="flex flex-col max-w-md md:w-[230px]">
            <p className=" us-text ">
              Us
            </p>
            <p>
              We are on a mission to make health information accessible to every Cameroonian. Our platform connects us to hospitals, vaccination dates, free screenings, and personalized alerts helping you stay healthy and informed in 2025 and beyond.
            </p>
          </div>

          {/* Center Image */}
          <div className="flex justify-center md:justify-start">
            <img
              src={Doctors}
              alt="about"
              className=" center-image "
            />
          </div>

          {/* Right Projects */}
          <div className="flex flex-col max-w-xs md:max-w-[350px] mt-8 md:mt-0">
            <img
              src={Chatgpt}
              alt="projects"
              className=" project-image "
            />
            <p className="text-2xl font-bold mt-4 md:mt-10">Our other projects</p>
            <p>Click here to see our other projects</p>
          </div>
        </div>

        {/* Developers Section */}
        <div className="relative w-full max-w-6xl h-64 md:h-[400px] mb-4 mx-auto">
          <img
            src={Developers}
            alt="developers"
            className=" developers-image "
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
              Meet the Developers
            </h1>
          </div>
        </div>

         <div className=" developers-names ">
         <p>Timah Something</p>
         <p>Bih Lubinkett</p>
         </div>



        {/* Our Services */}
        <p className="font-bold text-3xl mb-8 text-left w-full">Our Services</p>
        <div className="flex flex-col gap-6 w-full">
          {services.map((service, idx) => (
            <div
              key={idx}
              className=" our-services-items "
            >
              <p className="text-2xl font-semibold mb-2">{service.title}</p>
              <p>{service.description}</p>
            </div>
          ))}
        </div>

        {/* Feedback Section */}
        <div className="mt-8 text-left w-full mb-8">
          <p className=" feedback-text">
            Wanna give us feedback?
          </p>
          <p className=" feedback-text">
            Contact us at: info@camhealthportal.cm
          </p>
        </div>

      </div>
      <Footer/>
    </div>
  );
}

export default AboutusPage;

















































  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
