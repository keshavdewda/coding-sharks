import { useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Card from "../components/Card";
import Hero from "../components/Hero";
import front from "../Images/front.png"
import programmingData from "../data/data.json"; // Import JSON
import "../pages/Home.css";


function Home() {
  const programmingSectionRef = useRef(null);

  const handleExploreCurriculumClick = () => {
    programmingSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  };

  return (
    <>
      <div className="Home">
        <Navbar />
        <Hero 
          heading="Master JavaScript, React & Node with Coding Sharks"
          subheading="Learn through real-world projects, hands-on exercises, and structured guidance designed to make you job-ready."
          ctaText="Explore Curriculum"
          imageSrc={front}
          onCtaClick={handleExploreCurriculumClick}
        />

        <div
          id="curriculum"
          ref={programmingSectionRef}
          className="programming-section"
        >
          <h1 className="heading">Javascript programming examples, exercises and solutions for beginners</h1>
          <div className="cards-container">
            {programmingData.cards.map((card, index) => (
              <Card
                key={index}
                heading={card.heading}
                links={card.links}
              />
            ))}
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}

export default Home;
