import React, { useState, useEffect } from 'react';
import './About.css';
import { sliderImages } from '../../assets/about/slider-images';
import { FaLeaf, FaSeedling, FaHandsHelping, FaHeart, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const About = () => {
  const [sliderIndex, setSliderIndex] = useState(0);

  const blogPosts = [
    {
      id: 'snake-plant',
      title: 'Snake Plant: The Unkillable Companion',
      excerpt: 'Discover why the Snake Plant is the perfect roommate. It purifies air and survives in low light conditions...',
      image: '/snake-plant.png',
      category: 'Care Guide'
    },
    {
      id: 'peace-lily',
      title: 'The Graceful Peace Lily',
      excerpt: 'Learn how to keep your Peace Lily blooming year-round. It is not just beautiful but a powerhouse of air purification...',
      image: '/peace-lily.png',
      category: 'Houseplants'
    },
    {
      id: 'aloe-vera',
      title: 'Healing Power of Aloe Vera',
      excerpt: 'Beyond its beauty, Aloe Vera offers incredible medicinal benefits. Perfect for skin care and minor burns...',
      image: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&w=800&q=80',
      category: 'Wellness'
    },
    {
      id: 'monstera',
      title: 'Monstera: The Jungle King',
      excerpt: 'Transform your living room into a tropical paradise with the iconic Swiss Cheese Plant. Learn about its fenestrations...',
      image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80',
      category: 'Design'
    }
  ];

  // Auto-play for slider
  useEffect(() => {
    const interval = setInterval(() => {
      setSliderIndex((prev) => (prev + 1) % sliderImages.length);
    }, 5000);
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
            <span className="subtitle">Rooted in Passion</span>
            <h1>
              {"OUR STORY".split('').map((letter, index) => (
                <span key={index} style={{ animationDelay: `${index * 0.1}s` }}>
                  {letter === ' ' ? '\u00A0' : letter}
                </span>
              ))}
            </h1>
            <p className="about-banner-description">
              Bringing Nature's Best to Your Living Space • Since 2024
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

      {/* Philosophy Section */}
      <section className="philosophy-section">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center">
            <div className="philosophy-card">
              <div className="icon-box"><FaLeaf /></div>
              <h3>Ethically Sourced</h3>
              <p>Every plant in our nursery is ethically grown with sustainable practices.</p>
            </div>
            <div className="philosophy-card">
              <div className="icon-box"><FaSeedling /></div>
              <h3>Nurtured with Care</h3>
              <p>We hand-pick and nurture each seedling until it reaches your doorstep.</p>
            </div>
            <div className="philosophy-card">
              <div className="icon-box"><FaHandsHelping /></div>
              <h3>Expert Support</h3>
              <p>Our botanical experts are always here to guide your plant journey.</p>
            </div>
            <div className="philosophy-card">
              <div className="icon-box"><FaHeart /></div>
              <h3>Eco-Friendly</h3>
              <p>From organic fertilizers to plastic-free packaging, we love the planet.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Botanical Stories Section */}
      <section className="about-blog-section py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-black text-primary mb-4">Botanical Stories</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Explore our curated collection of plant wisdom and botanical insights.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {blogPosts.map((post) => (
              <div key={post.id} className="about-blog-card group">
                <div className="about-blog-image relative h-64 rounded-3xl overflow-hidden mb-6 shadow-xl">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <span className="absolute top-4 left-4 bg-accent text-white text-[10px] font-bold px-3 py-1 rounded-full">{post.category}</span>
                </div>
                <h3 className="text-xl font-bold text-primary mb-3 group-hover:text-accent transition-colors">{post.title}</h3>
                <p className="text-gray-500 text-sm mb-6 line-clamp-2">{post.excerpt}</p>
                <Link to={`/blog/${post.id}`} className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:text-accent transition-colors group/link">
                  Read More <FaArrowRight size={10} className="group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="about-content-section">
        <div className="content-container">
          <div className="about-grid">
            <div className="about-text">
              <h2 className="section-title text-primary">Where Greenery Meets Home</h2>
              <p>
                At PlantVigor, we believe that every home deserves a touch of nature.
                Our journey began with a simple observation: modern living often disconnects
                us from the calming presence of greenery. We set out to change that.
              </p>
              <p>
                What started as a small local nursery has grown into a community of plant
                lovers. We don't just sell plants; we cultivate experiences. Whether you're
                a seasoned "plant parent" or just starting your journey, we're here to
                provide the healthiest, most vibrant botanical companions for your space.
              </p>
              <p>
                Our collection is curated to include everything from air-purifying indoor
                giants to resilient succulents. Each piece is an invitation to pause,
                breathe deeper, and enjoy the art of slow living.
              </p>
              <div className="tagline">
                PlantVigor — Nature's Best, Nurtured for You.
              </div>
            </div>
            <div className="about-image">
              <img
                src="https://images.unsplash.com/photo-1470058869958-2a77abd41702?auto=format&fit=crop&w=800&q=80"
                alt="Botanical Craft"
                className="rounded-[3rem] shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
