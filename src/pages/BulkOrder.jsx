import React, { useState } from 'react';
import { FaWhatsapp, FaEnvelope, FaTruck, FaLeaf, FaUsers, FaPercent, FaStar, FaBuilding, FaGift } from 'react-icons/fa';
import { toast } from 'react-toastify';

const BulkOrder = () => {
   const [formData, setFormData] = useState({
      name: '',
      email: '',
      phone: '',
      company: '',
      quantity: '',
      message: ''
   });

   const handleSubmit = (e) => {
      e.preventDefault();
      console.log('Bulk Order Enquiry:', formData);
      toast.success('Thank you for your enquiry! Our team will contact you shortly.');
      setFormData({ name: '', email: '', phone: '', company: '', quantity: '', message: '' });
   };

   return (
      <div className="pt-32 pb-20 bg-cream min-h-screen">
         <div className="container mx-auto px-4 md:px-12">

            {/* Hero Section */}
            <div className="relative rounded-[4rem] overflow-hidden bg-primary p-12 md:p-24 flex flex-col md:flex-row items-center gap-16 mb-20 shadow-2xl">
               <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none">
                  <FaLeaf className="w-full h-full text-white rotate-45 scale-150" />
               </div>
               <div className="relative z-10 md:w-1/2 text-center md:text-left">
                  <span className="text-accent font-bold text-xs uppercase tracking-[0.4em] mb-6 block underline decoration-accent underline-offset-8">Corporate & Wholesale</span>
                  <h1 className="text-5xl md:text-8xl font-display font-black text-white mb-10 leading-none tracking-tighter uppercase">
                     Foliage <br /> <span className="text-accent">Fortune</span>
                  </h1>
                  <p className="text-white/70 text-xl mb-12 max-w-md font-medium leading-relaxed italic">
                     Elevate your space with premium greenery in bulk. Competitive pricing, dedicated support, and safe delivery across India.
                  </p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4">
                     <a href="mailto:plantvigor@gmail.com" className="bg-white text-primary px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-accent hover:text-white transition-all shadow-xl flex items-center gap-3">
                        <FaEnvelope /> Get a Quote
                     </a>
                     <a href="https://wa.me/916397950266" className="bg-green-500 text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-green-600 transition-all shadow-xl flex items-center gap-3">
                        <FaWhatsapp /> WhatsApp Us
                     </a>
                  </div>
               </div>
               <div className="md:w-1/2 relative">
                  <img
                     src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80"
                     alt="Bulk Plants"
                     className="rounded-[3rem] shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-700 border-8 border-white/10"
                  />
                  <div className="absolute -bottom-8 -left-8 bg-accent text-white p-8 rounded-[2rem] shadow-2xl rotate-12">
                     <p className="text-4xl font-black leading-none uppercase tracking-tighter">Up to <br /> 70% OFF</p>
                     <p className="text-[10px] font-bold uppercase tracking-widest mt-2">On Bulk Orders</p>
                  </div>
               </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
               {[
                  { icon: <FaPercent />, title: "Best Bulk Pricing", desc: "Enjoy up to 50-70% discount on wholesale orders. The more you order, the more you save." },
                  { icon: <FaLeaf />, title: "Premium Quality", desc: "Every plant is carefully nurtured and inspected. We guarantee healthy, vibrant plants." },
                  { icon: <FaTruck />, title: "Safe Delivery", desc: "Specialized packaging and logistics ensure your bulk order arrives in perfect condition." },
                  { icon: <FaUsers />, title: "Dedicated Support", desc: "Get a dedicated account manager for expert guidance on plant selection and quantities." },
                  { icon: <FaBuilding />, title: "Corporate Gifting", desc: "Ideal for offices, hotels, landscaping projects, and meaningful corporate gifts." },
                  { icon: <FaGift />, title: "Custom Solutions", desc: "Need specific sizes or arrangements? We accommodate tailored orders to fit your needs." }
               ].map((item, i) => (
                  <div key={i} className="bg-white p-12 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all group">
                     <div className="w-16 h-16 bg-cream text-primary rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-all text-2xl">
                        {item.icon}
                     </div>
                     <h3 className="text-2xl font-display font-black text-primary mb-4 uppercase tracking-tighter">{item.title}</h3>
                     <p className="text-gray-400 font-medium leading-relaxed italic">{item.desc}</p>
                  </div>
               ))}
            </div>

            {/* Enquiry Form Section */}
            <div className="flex flex-col lg:flex-row gap-20 items-start mb-32">
               <div className="lg:w-1/2">
                  <span className="text-accent font-bold text-xs uppercase tracking-[0.4em] mb-4 block underline decoration-accent underline-offset-8">Get Started</span>
                  <h2 className="text-4xl md:text-6xl font-display font-black text-primary mb-8 leading-none tracking-tighter uppercase">
                     Bulk Order <br /> <span className="text-accent">Enquiry Form</span>
                  </h2>
                  <p className="text-gray-400 text-lg mb-12 font-medium italic">
                     Fill out the form and our wholesale team will get back to you with a customized quote within 24 hours.
                  </p>

                  <div className="space-y-8">
                     <div className="flex items-center gap-6 p-6 bg-white rounded-3xl border border-gray-50 shadow-sm">
                        <div className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center"><FaEnvelope /></div>
                        <div>
                           <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Email Us</p>
                           <p className="text-sm font-bold text-primary tracking-wider">plantvigor@gmail.com</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-6 p-6 bg-white rounded-3xl border border-gray-50 shadow-sm">
                        <div className="w-12 h-12 bg-green-500 text-white rounded-xl flex items-center justify-center"><FaWhatsapp /></div>
                        <div>
                           <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">WhatsApp Support</p>
                           <p className="text-sm font-bold text-primary tracking-wider">+91 6397950266</p>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="lg:w-1/2 w-full bg-white rounded-[4rem] p-12 md:p-16 shadow-2xl border border-gray-50">
                  <form onSubmit={handleSubmit} className="space-y-8">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest ml-4">Full Name</label>
                           <input
                              type="text" required
                              className="w-full bg-cream border-2 border-transparent focus:border-primary/20 p-6 rounded-2xl text-xs font-bold focus:outline-none"
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest ml-4">Email Address</label>
                           <input
                              type="email" required
                              className="w-full bg-cream border-2 border-transparent focus:border-primary/20 p-6 rounded-2xl text-xs font-bold focus:outline-none"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                           />
                        </div>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest ml-4">Phone Number</label>
                           <input
                              type="tel" required
                              className="w-full bg-cream border-2 border-transparent focus:border-primary/20 p-6 rounded-2xl text-xs font-bold focus:outline-none"
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest ml-4">Company Name</label>
                           <input
                              type="text"
                              className="w-full bg-cream border-2 border-transparent focus:border-primary/20 p-6 rounded-2xl text-xs font-bold focus:outline-none"
                              value={formData.company}
                              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                           />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest ml-4">Estimated Quantity</label>
                        <input
                           type="number" required
                           className="w-full bg-cream border-2 border-transparent focus:border-primary/20 p-6 rounded-2xl text-xs font-bold focus:outline-none"
                           value={formData.quantity}
                           onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest ml-4">Message / Requirements</label>
                        <textarea
                           rows="4" required
                           className="w-full bg-cream border-2 border-transparent focus:border-primary/20 p-6 rounded-2xl text-xs font-bold focus:outline-none"
                           value={formData.message}
                           onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        ></textarea>
                     </div>
                     <button className="w-full bg-primary text-white py-6 rounded-3xl font-black text-lg uppercase tracking-widest shadow-2xl shadow-primary/20 hover:bg-accent transition-all">
                        Send Enquiry
                     </button>
                  </form>
               </div>
            </div>

            {/* Testimonials */}
            <div className="mb-32">
               <div className="text-center mb-20">
                  <span className="text-accent font-bold text-xs uppercase tracking-[0.4em] mb-4 block underline decoration-accent underline-offset-8">Partners</span>
                  <h2 className="text-4xl md:text-5xl font-display font-black text-primary uppercase tracking-tighter">Client Stories</h2>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[
                     { name: "Rahul S.", role: "Corporate Manager", quote: "The quality was exactly as promised. The bulk packaging was perfect and all plants arrived in great condition." },
                     { name: "Priya M.", role: "Landscape Architect", quote: "Vibrant and healthy plants! Dedicated account manager helped us choose the right varieties for our project." }
                  ].map((t, i) => (
                     <div key={i} className="bg-white p-12 rounded-[3rem] border border-gray-100 shadow-sm italic">
                        <div className="flex text-yellow-400 mb-6 gap-1">
                           {[...Array(5)].map((_, j) => <FaStar key={j} size={12} />)}
                        </div>
                        <p className="text-primary text-lg font-medium leading-relaxed mb-8">"{t.quote}"</p>
                        <div>
                           <h4 className="text-sm font-black text-primary uppercase tracking-widest">{t.name}</h4>
                           <p className="text-[10px] font-bold text-accent uppercase tracking-widest mt-1">{t.role}</p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            {/* FAQ Section */}
            <div className="mb-32">
               <div className="text-center mb-20">
                  <span className="text-accent font-bold text-xs uppercase tracking-[0.4em] mb-4 block underline decoration-accent underline-offset-8">Questions</span>
                  <h2 className="text-4xl md:text-5xl font-display font-black text-primary uppercase tracking-tighter">Everything You Need to Know</h2>
               </div>
               <div className="max-w-4xl mx-auto space-y-6">
                  {[
                     { q: "What is the minimum order quantity for bulk pricing?", a: "Minimum order quantities vary by plant type, but generally start at 25-50 units to qualify for wholesale discounts." },
                     { q: "How do you ensure safe delivery of large quantities?", a: "We use specialized heavy-duty packaging and dedicated logistics partners who specialize in live plant transport to ensure zero damage." },
                     { q: "Can I get a custom quote for specific plant sizes?", a: "Yes! Our account managers can help you source specific ages, sizes, and even varieties not listed in our standard catalog." },
                     { q: "Do you provide maintenance services for corporate bulk orders?", a: "We offer maintenance consultancy and can connect you with local AMC partners for long-term plant care in your office or project." }
                  ].map((faq, i) => (
                     <div key={i} className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-gray-50 shadow-sm hover:shadow-xl transition-all group">
                        <h4 className="text-xl font-display font-black text-primary mb-4 uppercase tracking-tight group-hover:text-accent transition-colors flex items-center gap-4">
                           <span className="w-8 h-8 bg-cream rounded-full flex items-center justify-center text-[10px] text-accent">0{i + 1}</span>
                           {faq.q}
                        </h4>
                        <p className="text-gray-400 font-medium leading-relaxed pl-12 italic">{faq.a}</p>
                     </div>
                  ))}
               </div>
            </div>

            {/* CTA */}
            <div className="bg-primary rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl">
               <div className="relative z-10">
                  <h2 className="text-4xl md:text-7xl font-display font-black text-white mb-8 uppercase tracking-tighter">Ready to green <br /> <span className="text-accent">your project?</span></h2>
                  <p className="text-white/60 text-lg mb-12 max-w-xl mx-auto font-medium">Whether it's 50 plants or 5000 — we've got you covered with the best wholesale prices in India.</p>
                  <button className="bg-white text-primary px-12 py-6 rounded-[2rem] font-black text-lg uppercase tracking-widest shadow-2xl hover:bg-accent hover:text-white transition-all">
                     Contact Wholesale Team
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
};

export default BulkOrder;
