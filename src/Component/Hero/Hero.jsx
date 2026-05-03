import React from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { FaChevronRight, FaLeaf } from "react-icons/fa";

const Hero = () => {
  const slides = [
    {
      image: "/hero_image1.webp",
      title: "Transform Your <br/> <span className='text-primary italic'>Living Space</span>",
      subtitle: "Discover our curated collection of premium indoor plants that bring life and purer air to your home.",
      cta: "Explore Collection",
      link: "/all-products"
    },
    {
      image: "/hero_image2.webp",
      title: "Nature's Best <br/> <span className='text-primary italic'>Delivered Fresh</span>",
      subtitle: "From our nursery to your doorstep. Guaranteed healthy and vibrant plants for every corner.",
      cta: "Shop New Arrivals",
      link: "/new-arrivals"
    },
    {
      image: "https://images.unsplash.com/photo-1466781783364-099732a37bcc?auto=format&fit=crop&w=1920&q=80",
      title: "Rare & Exotic <br/> <span className='text-primary italic'>Succulents</span>",
      subtitle: "Exclusive collection of hardy and beautiful succulents for the modern collector.",
      cta: "View Succulents",
      link: "/category/Succulents"
    }
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
    pauseOnHover: false,
    customPaging: (i) => (
      <div className="w-3 h-3 mx-2 rounded-full border-2 border-white transition-all hover:bg-white active:scale-125"></div>
    ),
    appendDots: (dots) => (
      <div style={{ bottom: "40px" }}>
        <ul className="m-0 flex justify-center items-center"> {dots} </ul>
      </div>
    )
  };

  return (
    <section className="relative h-[85vh] md:h-[95vh] overflow-hidden bg-primary">
      <Slider {...settings} className="h-full">
        {slides.map((slide, index) => (
          <div key={index} className="relative h-[85vh] md:h-[95vh]">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <img 
                src={slide.image} 
                alt="Plant Hero" 
                className="w-full h-full object-cover scale-105 animate-slow-zoom"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/60"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto">
              <div className="animate-fade-in-up">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 backdrop-blur-md text-primary rounded-full text-xs font-bold uppercase tracking-[0.3em] mb-8 border border-primary/30">
                  <FaLeaf size={10} /> Premium Plant Store
                </span>
                
                <h1 
                  className="text-5xl md:text-8xl font-display font-black text-white mb-8 leading-[0.9] tracking-tighter"
                  dangerouslySetInnerHTML={{ __html: slide.title }}
                />
                
                <p className="text-lg md:text-xl text-white/70 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
                  {slide.subtitle}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <Link 
                    to={slide.link}
                    className="group bg-accent hover:bg-white text-white hover:text-primary px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl shadow-accent/30 transition-all duration-500 flex items-center gap-3"
                  >
                    {slide.cta} <FaChevronRight className="group-hover:translate-x-2 transition-transform" />
                  </Link>
                  <Link 
                    to="/about"
                    className="text-white hover:text-primary font-bold text-lg transition-all border-b-2 border-white/20 hover:border-primary py-2"
                  >
                    Our Story
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none"></div>
    </section>
  );
};

export default Hero;