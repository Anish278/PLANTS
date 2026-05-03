import React from 'react';

const SocialProof = () => {
  const logos = [
    { name: "Forbes", url: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Forbes_logo.svg" },
    { name: "TechCrunch", url: "https://upload.wikimedia.org/wikipedia/commons/b/b9/TechCrunch_logo.svg" },
    { name: "Vogue", url: "https://upload.wikimedia.org/wikipedia/commons/d/df/Vogue_logo.svg" },
    { name: "The Hindu", url: "https://upload.wikimedia.org/wikipedia/commons/4/4e/The-Hindu-Logo.png" },
    { name: "GQ", url: "https://upload.wikimedia.org/wikipedia/commons/1/1a/GQ_logo.svg" },
  ];

  return (
    <section className="py-12 bg-cream border-y border-gray-100 overflow-hidden">
      <div className="container mx-auto px-4">
        <p className="text-center text-[10px] font-bold text-primary uppercase tracking-[0.5em] mb-10 opacity-50">As Featured In</p>
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-30 grayscale hover:grayscale-0 transition-all">
          {logos.map((logo) => (
            <img 
              key={logo.name} 
              src={logo.url} 
              alt={logo.name} 
              className="h-6 md:h-8 w-auto object-contain"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
