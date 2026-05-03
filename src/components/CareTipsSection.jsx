import React from 'react';

const CareTipsSection = () => {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Image Side */}
          <div className="lg:w-1/2">
            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl group">
              <img 
                src="https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1000&q=80" 
                alt="Plant Care" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors"></div>
            </div>
          </div>

          {/* Content Side */}
          <div className="lg:w-1/2">
            <span className="text-accent font-bold text-xs uppercase tracking-[0.3em] mb-4 block underline decoration-accent underline-offset-8">Expert Advice</span>
            <h2 className="text-4xl md:text-5xl font-display font-black text-primary mb-10 uppercase tracking-tighter">
              Essential <span className="text-accent">Care Tips</span>
            </h2>
            
            <div className="space-y-8">
              <div className="flex gap-6">
                <span className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center font-bold">1</span>
                <div>
                  <p className="text-gray-600 font-medium leading-relaxed">
                    After receiving the plants, open the box 📦 as soon as possible.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <span className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center font-bold">2</span>
                <div>
                  <p className="text-gray-600 font-medium leading-relaxed">
                    Air dry the plants for 2-3 hours on fresh air.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <span className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center font-bold">3</span>
                <div>
                  <p className="text-gray-600 font-medium leading-relaxed">
                    Plant in well-drained soil (30% sand + 30% soil + 20% vermicompost + 20% perlite).
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <span className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center font-bold">4</span>
                <div>
                  <p className="text-gray-600 font-medium leading-relaxed">
                    Water plants after 2-3 days and don't give direct sunlight to newly planted succulents for at least 10 days.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 p-8 bg-cream rounded-3xl border-l-8 border-accent shadow-sm">
               <p className="text-primary font-bold italic leading-relaxed">
                 <span className="text-accent uppercase tracking-widest text-xs block mb-2 not-italic">Note:</span>
                 Always water succulents when the top layer of soil feels dry in the roots of the plant rather than leaves.
               </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CareTipsSection;
