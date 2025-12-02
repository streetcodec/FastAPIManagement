import React from 'react';
import { FaCar, FaChartLine, FaShieldAlt } from 'react-icons/fa';

const FeatureCard = ({ icon, title, description }) => (
    <div className="bg-[#2a2a2a] p-8 rounded-2xl hover:bg-[#333] transition-colors duration-300 border border-gray-800 hover:border-purple-500/30 group">
        <div className="text-4xl text-purple-500 mb-6 group-hover:scale-110 transition-transform duration-300">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
        <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
);

const Features = () => {
    const features = [
        {
            icon: <FaCar />,
            title: "Smart Fleet Tracking",
            description: "Real-time monitoring of your entire fleet with advanced GPS and telemetry data integration."
        },
        {
            icon: <FaChartLine />,
            title: "Analytics Dashboard",
            description: "Gain actionable insights with our comprehensive analytics tools to optimize performance and reduce costs."
        },
        {
            icon: <FaShieldAlt />,
            title: "Secure & Reliable",
            description: "Enterprise-grade security ensures your data is protected with state-of-the-art encryption standards."
        }
    ];

    return (
        <section className="py-24 bg-[#111]">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                        Why Choose Us?
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        We provide the tools you need to take full control of your automotive operations.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <FeatureCard key={index} {...feature} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
