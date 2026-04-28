import React, { useState, useEffect } from 'react';
import './About.css';
import { sliderImages } from '../../assets/about/slider-images';

const About = () => {
  const [sliderIndex, setSliderIndex] = useState(0);

  // Auto-play for slider
  useEffect(() => {
    const interval = setInterval(() => {
      setSliderIndex((prev) => (prev + 1) % sliderImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="about-page">
      {/* Banner Section with Slider */}
      <section className="about-banner-section">
        <div className="slider-wrapper">
          {sliderImages.map((slide, idx) => (
            <img
              key={slide.image}
              src={slide.image}
              alt={slide.alt}
              className={`slider-image${idx === sliderIndex ? ' active' : ''}`}
              loading={idx === 0 ? "eager" : "lazy"}
            />
          ))}
          <div className="slider-overlay"></div>
        </div>

        <div className="about-banner-content">
          <div className="title-container">
            <h1>
              {"ABOUT FIKA".split('').map((letter, index) => (
                <span key={index} style={{ animationDelay: `${index * 0.1}s` }}>
                  {letter === ' ' ? '\u00A0' : letter}
                </span>
              ))}
            </h1>
            <p className="about-banner-description">
              Where Every Home Tells a Story • Crafting Comfort Since 2023
            </p>
          </div>
        </div>

        <div className="slider-dots">
          {sliderImages.map((_, idx) => (
            <span
              key={idx}
              className={`slider-dot${idx === sliderIndex ? ' active' : ''}`}
              onClick={() => setSliderIndex(idx)}
            />
          ))}
        </div>
      </section>

      {/* Content Section */}
      <section className="about-content-section">
        <div className="content-container">
          <div className="about-description">
            <p>
              At FIKA, we believe that home is more than just a place — it's a feeling.
              Inspired by the Scandinavian concept of slowing down and savoring life's simple moments,
              FIKA brings you thoughtfully designed soft furnishings that turn everyday living into
              a cozy, stylish experience.
            </p>

            <p>
              Our collection includes beautifully crafted cushion covers, bed linens, quilts,
              dohars, and more — each piece a harmonious blend of comfort, quality, and aesthetic charm.
              Whether it's the richness of hand-block prints, the softness of pure cotton, or the
              elegance of velvet textures, our products are made to transform your space into a sanctuary.
            </p>

            <p>
              We work with skilled artisans and ethical production practices to create pieces that
              feel as good as they look. Every item from FIKA is a gentle invitation to pause,
              unwind, and enjoy the art of slow living — right at home.
            </p>

            <p className="tagline">
              FIKA — where comfort meets craft.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
