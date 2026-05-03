import React, { useState, useEffect } from 'react';

const AnnouncementBar = () => {
  const announcements = [
    "🌿 FREE DELIVERY ON ALL ORDERS ABOVE ₹549!",
    "✨ USE CODE WELCOME10 FOR 10% OFF!",
    "🚛 FAST SHIPPING ACROSS INDIA",
    "🍃 FRESH PLANTS DELIVERED TO YOUR DOORSTEP"
  ];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [announcements.length]);

  return (
    <div className="bg-primary text-white py-2 overflow-hidden border-b border-white/10 relative h-9">
      {announcements.map((text, i) => (
        <div 
          key={i}
          className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${
            i === current ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 invisible"
          }`}
        >
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">{text}</span>
        </div>
      ))}
    </div>
  );
};

export default AnnouncementBar;
