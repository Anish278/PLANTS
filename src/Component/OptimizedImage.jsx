import React, { useState, useEffect } from 'react';

/**
 * OptimizedImage Component
 * Automatically applies Cloudinary transformations for performance.
 */
const OptimizedImage = ({ src, alt, className = "", containerClass = "" }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(false);

    // Function to transform Cloudinary URL
    const getOptimizedUrl = (url) => {
        if (!url) return '/placeholder.png';
        if (url.includes('cloudinary.com')) {
            // Add f_auto, q_auto after /upload/
            return url.replace('/upload/', '/upload/f_auto,q_auto/');
        }
        return url;
    };

    const optimizedSrc = getOptimizedUrl(src);

    useEffect(() => {
        setIsLoaded(false);
        setError(false);
    }, [src]);

    return (
        <div className={`relative overflow-hidden ${!isLoaded ? 'bg-gray-100 animate-pulse' : ''} ${containerClass}`}>
            <img
                src={optimizedSrc}
                alt={alt}
                className={`transition-opacity duration-700 ${className} ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                loading="lazy"
                onLoad={() => setIsLoaded(true)}
                onError={() => {
                    setError(true);
                    setIsLoaded(true);
                }}
            />
            {!isLoaded && !error && (
                <div className="absolute inset-0 bg-gray-200"></div>
            )}
        </div>
    );
};

export default OptimizedImage;
