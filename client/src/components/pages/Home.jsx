import React from "react";
import Navbar from "../layouts/Navbar";
import WelcomeContent from "../layouts/WelcomeContent";
import ImageGallery from "../layouts/ImageGallery";
import Easysteps from "../layouts/Easysteps";
import TopServices from "../layouts/TopService";
import CallToAction from "../layouts/CallToAction";
import Footer from "../layouts/Footer";
import E1 from "../images/E1.JPG";
import E2 from "../images/E2.JPG";
import C1 from "../images/C1.JPG";
import C2 from "../images/C2.JPG";
import M1 from "../images/M1.JPG";
import M2 from "../images/M2.JPG";
import CA1 from "../images/CA1.JPG";
import CA2 from "../images/CA2.JPG";
import P1 from "../images/P1.JPG";
import P2 from "../images/P2.JPG";

const serviceImages = [E1, E2, C1, C2, M1, M2, CA1, CA2, P1, P2];

const Home = () => (
  <div className="min-h-screen flex flex-col bg-white">
    <Navbar />
    <main className="flex-1 container mx-auto px-4 pt-28 pb-12">
      <div className="flex flex-col md:flex-row md:items-center md:space-x-8 gap-8">
        <div className="flex-1">
          <WelcomeContent />
        </div>
        <div className="flex-1">
          <ImageGallery images={serviceImages} />
        </div>
      </div>
      <Easysteps />
      <TopServices />
      <CallToAction />
    </main>
    <Footer />
  </div>
);

export default Home;