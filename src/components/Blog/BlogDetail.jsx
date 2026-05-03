import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './BlogDetail.css';

const BlogDetail = () => {
    const { id } = useParams();

    const blogs = [
        {
            id: 'snake-plant',
            title: 'Snake Plant: The Unkillable Companion',
            excerpt: 'Discover why the Snake Plant is the perfect roommate for your home...',
            content: `The Snake Plant (Sansevieria) is widely regarded as one of the toughest houseplants you can own. Whether you're a seasoned gardener or a self-proclaimed "black thumb," this plant is nearly impossible to kill.

### Why Every Home Needs a Snake Plant

The Snake Plant is a powerhouse of air purification. Unlike most plants that release oxygen only during the day, the Snake Plant continues to produce oxygen at night, making it an ideal companion for your bedroom. It is also known to filter out common toxins like formaldehyde and benzene from the air.

### Minimal Care, Maximum Reward

One of the biggest draws of the Snake Plant is its low-maintenance nature.
• Light: It thrives in almost any light condition, from low-light corners to bright, indirect sunlight.
• Water: It prefers to be on the drier side. Water it only when the soil is completely dry—usually every 2-4 weeks depending on your home's humidity.
• Soil: Use a well-draining cactus or succulent mix to prevent root rot.

### Styling with Snake Plants

With its tall, sword-like leaves and architectural shape, the Snake Plant adds a modern, sculptural element to any room. It looks great in minimalist ceramic pots or rustic baskets. Because it grows vertically, it's perfect for tight spaces where you want to add a touch of green without taking up too much floor area.`,
            image: "/snake-plant.png",
            date: "May 2026",
            category: "Care Guide"
        },
        {
            id: 'peace-lily',
            title: 'The Graceful Peace Lily',
            excerpt: 'Learn how to keep your Peace Lily blooming year-round with these simple tips...',
            content: `The Peace Lily (Spathiphyllum) is a classic houseplant known for its elegant white blooms and lush, dark green foliage. It is a symbol of peace, purity, and prosperity, making it a popular choice for both homes and offices.

### The Beauty of Blooms

The "flowers" of the Peace Lily are actually modified leaves called spathes. These stunning white hoods protect the true, tiny flowers on the spike inside. With proper care, a Peace Lily can bloom multiple times a year, adding a touch of sophisticated beauty to your indoor space.

### Essential Care Tips

Peace Lilies are relatively easy to care for, but they do have some specific preferences.
• Light: They love bright, indirect light. Direct sunlight can scorch their leaves, while too little light may prevent blooming.
• Water: They are famous for "fainting" when they are thirsty. If the leaves start to droop, it's time for a drink. Keep the soil consistently moist but never soggy.
• Humidity: Being tropical plants, they appreciate a bit of extra humidity. Misting the leaves occasionally or using a pebble tray can help them thrive.

### A Natural Air Purifier

Beyond its beauty, the Peace Lily is an exceptional air purifier. It's one of the few plants capable of breaking down toxic gases like carbon monoxide and formaldehyde, ensuring the air in your home stays fresh and clean.`,
            image: "/peace-lily.png",
            date: "May 2026",
            category: "Houseplants"
        },
        {
            id: 'aloe-vera',
            title: 'Healing Power of Aloe Vera',
            excerpt: 'Beyond its beauty, Aloe Vera offers incredible medicinal benefits...',
            content: `Aloe Vera is often called the "Plant of Immortality" for good reason. This succulent is not only a beautiful addition to a sunny windowsill but also a living first-aid kit that every household should have.

### The Science of Healing

The clear gel found inside Aloe Vera leaves is packed with vitamins, minerals, and antioxidants. It has been used for centuries to treat minor burns, soothe sunburns, and promote skin healing. Its anti-inflammatory properties make it a natural remedy for various skin irritations.

### Growing Your Own Medicine

Aloe Vera is a hardy succulent that requires very little attention.
• Sun: They need plenty of bright, direct sunlight. A south-facing window is usually the best spot.
• Water: Being a succulent, it stores water in its leaves. Only water when the soil has dried out completely. Overwatering is the most common mistake with Aloe.
• Potting: Use a well-draining succulent mix and a pot with drainage holes to keep the roots healthy.

### More Than Just a Gel

While the gel is its most famous feature, the Aloe Vera plant itself is a striking decorative element. Its thick, fleshy leaves with serrated edges add a unique texture to any plant collection. Plus, it's great at clearing pollutants from the air, making your home healthier as well as prettier.`,
            image: "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&w=800&q=80",
            date: "May 2026",
            category: "Wellness"
        },
        {
            id: 'monstera',
            title: 'Monstera: The Jungle King',
            excerpt: 'Transform your living room into a tropical paradise with the iconic Swiss Cheese Plant...',
            content: `The Monstera Deliciosa, commonly known as the Swiss Cheese Plant, is the undisputed king of the "urban jungle" trend. Its large, heart-shaped leaves with unique natural holes (fenestrations) make it an instant focal point in any room.

### Bringing the Tropics Home

Monsteras are native to the rainforests of Central America, and they bring that lush, tropical energy right into your home. They are fast growers and can reach impressive sizes, making them perfect for filling a large corner or creating a green wall.

### How to Tame the Beast

Despite its exotic look, the Monstera is surprisingly easy to grow.
• Light: It thrives in bright, indirect light. It can tolerate some shade, but its leaves will stay smaller and won't develop as many holes without enough light.
• Support: In the wild, Monsteras are climbers. Giving your plant a moss pole or trellis to climb will encourage larger, healthier leaves.
• Watering: Water when the top inch or two of soil feels dry. They enjoy high humidity, so regular misting is highly recommended.

### A Statement Piece

A mature Monstera is more than just a plant; it's a piece of living art. Its dramatic foliage complements a wide range of interior styles, from bohemian to mid-century modern. Whether you have one large specimen or several smaller ones, the Monstera is sure to bring a sense of adventure and vibrancy to your space.`,
            image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80",
            date: "May 2026",
            category: "Design"
        }
    ];

    const blog = blogs.find(b => b.id.toString() === id.toString());

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (!blog) {
        return (
            <div className="blog-detail-error">
                <h2>Blog post not found</h2>
                <Link to="/all-products" className="back-btn">Back to Products</Link>
            </div>
        );
    }

    return (
        <div className="blog-detail-page">
            <div className="blog-detail-container">
                <Link to="/all-products" className="blog-back-link">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    Back to All Products
                </Link>

                <header className="blog-detail-header">
                    <div className="blog-detail-category">{blog.category}</div>
                    <h1 className="blog-detail-title">{blog.title}</h1>
                    <div className="blog-detail-meta">
                        <span className="blog-detail-date">{blog.date}</span>
                    </div>
                </header>

                <div className="blog-detail-hero">
                    <img src={blog.image} alt={blog.title} className="blog-detail-main-image" />
                </div>

                <div className="blog-detail-content">
                    {blog.content.split('\n\n').map((paragraph, index) => {
                        if (paragraph.startsWith('###')) {
                            return <h2 key={index}>{paragraph.replace('###', '').trim()}</h2>;
                        }
                        return <p key={index}>{paragraph}</p>;
                    })}
                </div>

                <footer className="blog-detail-footer">
                    <div className="share-section">
                        <span>Share this story:</span>
                        <div className="share-icons">
                            {/* SVG icons for social sharing */}
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default BlogDetail;
