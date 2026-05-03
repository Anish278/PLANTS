import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaInstagram, FaPlay, FaPause, FaHeart, FaChevronLeft, FaChevronRight, FaVolumeMute, FaVolumeUp } from 'react-icons/fa';
import { getSocialMediaPosts } from '../firebase/firestore';

// Fallback posts jab Firebase mein kuch na ho
const fallbackPosts = [
  {
    id: 'f1',
    imageUrl: "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=400&q=70",
    likes: "2.4K",
    caption: "Morning ritual 🌿 Fresh greens for a fresh start",
    link: "https://www.instagram.com/plant_vigor/"
  },
  {
    id: 'f2',
    imageUrl: "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&w=400&q=70",
    likes: "1.8K",
    caption: "Repotting season! 🪴 New home, new growth",
    link: "https://www.instagram.com/plant_vigor/"
  },
  {
    id: 'f3',
    imageUrl: "https://images.unsplash.com/photo-1512428559083-a400a3b8463a?auto=format&fit=crop&w=400&q=70",
    likes: "3.1K",
    caption: "Sunday plant shelfie 🍃 Tag us in yours!",
    link: "https://www.instagram.com/plant_vigor/"
  },
  {
    id: 'f4',
    imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=400&q=70",
    likes: "2.7K",
    caption: "New arrivals just dropped 🌱 Shop the link in bio",
    link: "https://www.instagram.com/plant_vigor/"
  }
];

const CARD_WIDTH = 280;
const GAP = 24;
const AUTO_PLAY_MS = 3500;

// Individual reel card — handles video/image + mute toggle
const ReelCard = ({ post, isActive }) => {
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const hasVideo = Boolean(post.videoUrl);

  // Play/pause video when card becomes active
  useEffect(() => {
    if (!videoRef.current) return;
    if (isActive) {
      videoRef.current.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setPlaying(false);
    }
  }, [isActive]);

  const toggleMute = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !muted;
    setMuted(!muted);
  };

  const togglePlay = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
      setPlaying(false);
    } else {
      videoRef.current.play();
      setPlaying(true);
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* Media */}
      {hasVideo ? (
        <video
          ref={videoRef}
          src={post.videoUrl}
          className="w-full h-full object-cover"
          muted
          loop
          playsInline
          preload="metadata"
        />
      ) : (
        <img
          src={post.imageUrl || post.bg}
          alt="Instagram post"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

      {/* Top-right: Instagram badge + mute (for video) */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <div className="w-9 h-9 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
          <FaInstagram className="text-white text-base" />
        </div>
        {hasVideo && isActive && (
          <button
            onClick={toggleMute}
            className="w-9 h-9 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-all"
          >
            {muted ? <FaVolumeMute size={13} /> : <FaVolumeUp size={13} />}
          </button>
        )}
      </div>

      {/* Center play/pause (video only) */}
      {hasVideo && isActive && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <div className="w-14 h-14 bg-white/25 backdrop-blur-md rounded-full flex items-center justify-center">
            {playing
              ? <FaPause className="text-white text-xl" />
              : <FaPlay className="text-white text-xl ml-1" />
            }
          </div>
        </button>
      )}

      {/* Center play icon (image only) */}
      {!hasVideo && (
        <div className="absolute inset-0 flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
            <FaPlay className="text-white text-xl ml-1" />
          </div>
        </div>
      )}

      {/* Bottom caption */}
      <div className="absolute bottom-0 left-0 right-0 p-5 pointer-events-none">
        <p className="text-white text-xs font-semibold leading-snug mb-2 line-clamp-2">{post.caption}</p>
        <div className="flex items-center gap-1 text-white/70">
          <FaHeart className="text-red-400 text-xs" />
          <span className="text-[10px] font-bold">{post.likes}</span>
        </div>
      </div>
    </div>
  );
};

const InstagramFeed = () => {
  const [posts, setPosts] = useState(fallbackPosts);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const trackRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    getSocialMediaPosts().then(data => {
      if (data && data.length > 0) setPosts(data);
    });
  }, []);

  const next = useCallback(() => {
    setActiveIdx(prev => (prev + 1) % posts.length);
  }, [posts.length]);

  const prev = useCallback(() => {
    setActiveIdx(prev => (prev - 1 + posts.length) % posts.length);
  }, [posts.length]);

  // Auto-advance only if active post has no video (videos play themselves)
  useEffect(() => {
    const activePost = posts[activeIdx];
    if (isPaused || activePost?.videoUrl) return; // don't auto-advance on videos
    timerRef.current = setInterval(next, AUTO_PLAY_MS);
    return () => clearInterval(timerRef.current);
  }, [isPaused, next, activeIdx, posts]);

  // Scroll track
  useEffect(() => {
    if (!trackRef.current) return;
    const track = trackRef.current;
    const containerWidth = track.parentElement.offsetWidth;
    const offset = activeIdx * (CARD_WIDTH + GAP) - (containerWidth / 2 - CARD_WIDTH / 2);
    track.style.transform = `translateX(${-Math.max(0, offset)}px)`;
  }, [activeIdx]);

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FaInstagram className="text-3xl text-accent" />
            <span className="text-sm font-bold text-accent tracking-[0.3em] uppercase underline decoration-accent underline-offset-8">
              Follow Us On Instagram
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-display font-black text-primary uppercase tracking-tighter">
            Our Green <span className="text-accent">Moments</span>
          </h2>
          <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-4">@plant_vigor</p>
        </div>

        {/* Carousel */}
        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Left arrow */}
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white shadow-xl rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all -translate-x-2 border border-gray-100"
            aria-label="Previous"
          >
            <FaChevronLeft size={16} />
          </button>

          {/* Right arrow */}
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white shadow-xl rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all translate-x-2 border border-gray-100"
            aria-label="Next"
          >
            <FaChevronRight size={16} />
          </button>

          {/* Track */}
          <div className="overflow-hidden mx-8 md:mx-14">
            <div
              ref={trackRef}
              className="flex"
              style={{
                gap: GAP,
                transition: 'transform 0.6s cubic-bezier(0.25,1,0.5,1)',
                willChange: 'transform',
              }}
            >
              {posts.map((post, index) => {
                const isActive = index === activeIdx;
                return (
                  <a
                    key={post.id || index}
                    href={post.link || 'https://www.instagram.com/plant_vigor/'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative rounded-[2.5rem] overflow-hidden shadow-2xl group border-4 border-white block cursor-pointer shrink-0"
                    style={{
                      width: CARD_WIDTH,
                      aspectRatio: '9/16',
                      transition: 'transform 0.5s ease, box-shadow 0.5s ease, opacity 0.4s ease',
                      transform: isActive ? 'scale(1.05)' : 'scale(0.9)',
                      opacity: isActive ? 1 : 0.6,
                      boxShadow: isActive ? '0 30px 60px rgba(0,0,0,0.25)' : '0 8px 20px rgba(0,0,0,0.1)',
                    }}
                    onClick={(e) => {
                      // If it's a video, clicking the card shouldn't navigate away
                      if (post.videoUrl && isActive) e.preventDefault();
                    }}
                  >
                    <ReelCard post={post} isActive={isActive} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Dot indicators */}
          <div className="flex items-center justify-center gap-2 mt-10">
            {posts.map((_, i) => (
              <button
                key={i}
                onClick={() => { setActiveIdx(i); setIsPaused(false); }}
                className="transition-all duration-300 rounded-full border-none cursor-pointer"
                style={{
                  width: i === activeIdx ? 32 : 8,
                  height: 8,
                  background: i === activeIdx ? '#DB663B' : '#d1d5db',
                  padding: 0,
                }}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-14 text-center">
          <a
            href="https://www.instagram.com/plant_vigor/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-4 bg-primary text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-accent transition-all shadow-2xl shadow-primary/20 group"
          >
            View More Reels <FaInstagram className="group-hover:rotate-12 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default InstagramFeed;
