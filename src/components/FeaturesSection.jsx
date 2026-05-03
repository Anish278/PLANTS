import React from 'react';
import { FaShippingFast, FaLeaf, FaHeadset, FaShieldAlt } from 'react-icons/fa';

const features = [
  {
    icon: <FaShippingFast className="text-4xl text-primary" />,
    title: "Free Shipping",
    description: "On all orders over ₹999. Fast and secure delivery to your doorstep."
  },
  {
    icon: <FaLeaf className="text-4xl text-primary" />,
    title: "Fresh Plants",
    description: "Nurtured with care and delivered in prime condition, ready to thrive."
  },
  {
    icon: <FaHeadset className="text-4xl text-primary" />,
    title: "Expert Support",
    description: "Get professional plant care advice from our botanists anytime."
  },
  {
    icon: <FaShieldAlt className="text-4xl text-primary" />,
    title: "Secure Payment",
    description: "100% secure payment gateways to ensure your data is always safe."
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-24 bg-cream overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-accent tracking-[0.2em] uppercase mb-3 underline decoration-accent underline-offset-8">Our Identity</h2>
          <h3 className="text-4xl md:text-5xl font-display font-black text-primary uppercase tracking-tighter">What Makes Us Different?</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center p-6 bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className="mb-6 p-4 bg-primary/10 rounded-2xl group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                {React.cloneElement(feature.icon, { className: "text-4xl text-primary group-hover:text-white transition-colors" })}
              </div>
              <h4 className="text-xl font-display font-bold text-primary mb-3">{feature.title}</h4>
              <p className="text-gray-500 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
