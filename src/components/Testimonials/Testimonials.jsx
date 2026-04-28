import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaQuoteLeft, FaStar, FaUser } from 'react-icons/fa';
import Slider from "react-slick";
import { db } from '../../firebase/config';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';

// Import slick carousel CSS
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const TestimonialsContainer = styled.div`
  width: 100%;
  padding: 3rem 1rem;
  margin-top: 2rem;
  position: relative;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  overflow: hidden;
`;

const TestimonialTitle = styled.h2`
  font-size: 1.6rem;
  color: #000000;
  text-align: center;
  margin-bottom: 1.2rem;
  font-family: 'Montserrat', sans-serif;
  position: relative;
  padding-bottom: 1rem;

  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 2px;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 2px;
  }
`;

const TestimonialCard = styled.div`
  padding: 1.5rem;
  border-radius: 10px;
  border: 1px solid #e0e0e0;
  margin: 0 10px;
  background: #ffffff;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
`;

const QuoteIcon = styled(FaQuoteLeft)`
  font-size: 1.5rem;
  color: #cccccc;
  margin-bottom: 0.8rem;
  opacity: 0.8;
`;

const TestimonialText = styled.p`
  font-size: 1rem;
  color: #333333;
  line-height: 1.6;
  margin-bottom: 1rem;
  font-style: italic;
`;

const CustomerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eeeeee;
`;

const CustomerImage = styled.img`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #764ba2;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const CustomerDetails = styled.div`
  flex: 1;
`;

const CustomerName = styled.h4`
  font-size: 1rem;
  color: #111111;
  margin: 0;
  font-weight: 600;
`;

const CustomerRole = styled.p`
  font-size: 0.8rem;
  color: #555555;
  margin: 0.2rem 0;
`;

const RatingContainer = styled.div`
  display: flex;
  gap: 0.1rem;
  margin-top: 0.15rem;
`;

const StarIcon = styled(FaStar)`
  color: #ffd700;
  font-size: 0.7rem;
`;

// Placeholder for static testimonials removed in favor of dynamic fetching

const Testimonials = () => {
  const [dynamicTestimonials, setDynamicTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const testimonialsRef = collection(db, 'testimonials');
        const q = query(
          testimonialsRef,
          where('status', '==', 'active'),
          where('featured', '==', true),
          orderBy('createdAt', 'desc'),
          limit(10)
        );
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        if (data.length === 0) {
          // If no featured testimonials, just get latest active ones
          const q2 = query(
            testimonialsRef,
            where('status', '==', 'active'),
            orderBy('createdAt', 'desc'),
            limit(10)
          );
          const querySnapshot2 = await getDocs(q2);
          const data2 = querySnapshot2.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setDynamicTestimonials(data2);
        } else {
          setDynamicTestimonials(data);
        }
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const settings = {
    dots: false,
    arrows: false,
    infinite: dynamicTestimonials.length > 1,
    slidesToShow: 1,
    slidesToScroll: 1,
    vertical: true,
    verticalSwiping: true,
    autoplay: dynamicTestimonials.length > 1,
    speed: 1000,
    autoplaySpeed: 3000,
    cssEase: "linear"
  };

  if (loading) return null;
  if (dynamicTestimonials.length === 0) return null;

  return (
    <TestimonialsContainer>
      <TestimonialTitle>What Our Customers Say</TestimonialTitle>
      <Slider {...settings}>
        {dynamicTestimonials.map((testimonial) => (
          <div key={testimonial.id}>
            <TestimonialCard>
              <QuoteIcon />
              <TestimonialText>{testimonial.text}</TestimonialText>
              <CustomerInfo>
                {testimonial.image ? (
                  <CustomerImage src={testimonial.image} alt={testimonial.author} loading="lazy" />
                ) : (
                  <div style={{ 
                    width: '45px', 
                    height: '45px', 
                    borderRadius: '50%', 
                    background: '#f0f0f0', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    border: '2px solid #764ba2',
                    color: '#ccc'
                  }}>
                    <FaUser size={20} />
                  </div>
                )}
                <CustomerDetails>
                  <CustomerName>{testimonial.author}</CustomerName>
                  <CustomerRole>{testimonial.location}</CustomerRole>
                  <RatingContainer>
                    {[...Array(testimonial.rating || 5)].map((_, index) => (
                      <StarIcon key={index} />
                    ))}
                  </RatingContainer>
                </CustomerDetails>
              </CustomerInfo>
            </TestimonialCard>
          </div>
        ))}
      </Slider>
    </TestimonialsContainer>
  );
};

export default Testimonials; 