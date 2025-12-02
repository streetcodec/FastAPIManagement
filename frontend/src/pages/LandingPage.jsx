import React from 'react';
import Hero from '../components/Landing/Hero';
import Features from '../components/Landing/Features';
import Contact from '../components/Landing/Contact';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-[#1a1a1a] text-white">
            <Hero />
            <Features />
            <Contact />
        </div>
    );
};

export default LandingPage;
