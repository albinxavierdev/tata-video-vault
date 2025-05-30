import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { VideoCard } from "@/components/VideoCard";
import { Header } from "@/components/Header";
import { VideoFilters } from "@/components/VideoFilters";

const WHATSAPP_NUMBER = "+919538022290";
const WHATSAPP_MESSAGE = encodeURIComponent("Hi, I'm interested in Tata Motors vehicles! Please provide more details.");
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER.replace('+', '')}?text=${WHATSAPP_MESSAGE}`;

interface Video {
  id: string;
  title: string;
  video_url: string;
  caption: string | null;
  vehicle_model: string;
  region: string;
  created_at: string;
}

const featuredTestimonialIds = [/* Add 1-3 video IDs to feature, or leave empty for now */];

const faqs = [
  {
    question: "Why choose Tata Motors?",
    answer: "Tata Motors is trusted by millions for its reliability, innovation, and customer-centric approach. Our vehicles are designed for performance, safety, and comfort." 
  },
  {
    question: "How can I book a test drive?",
    answer: "Simply click the WhatsApp enquiry button or contact us via email or phone. Our team will assist you in scheduling a test drive at your convenience."
  },
  {
    question: "Where can I find Tata Motors dealerships?",
    answer: "Tata Motors has an extensive network of dealerships and service centers across India. Contact us to find the nearest one to you."
  },
];

const Index = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    const { data, error } = await supabase
      .from("videos")
      .select("*")
      .order("created_at", { ascending: false });
    setVideos(data || []);
    setFilteredVideos(data || []);
    setLoading(false);
  };

  const handleFilter = (model: string, region: string) => {
    let filtered = videos;
    if (model !== "all") {
      filtered = filtered.filter(video => video.vehicle_model === model);
    }
    if (region !== "all") {
      filtered = filtered.filter(video => video.region === region);
    }
    setFilteredVideos(filtered);
  };

  // Featured testimonials (pick first 1-3 for now)
  const featured = videos.slice(0, 2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 text-gray-900 font-sans">
      <Header />

      {/* Hero Section */}
      <section className="w-full min-h-[350px] flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 py-16 px-4">
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-4 leading-tight text-center">
            Tata Motors Commercials & Testimonials
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-xl text-center">
            Discover why millions trust Tata Motors. Watch real customer stories and see our vehicles in action.
          </p>
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg transition-colors duration-200 mb-2"
          >
            Enquire on WhatsApp
          </a>
        </div>
      </section>

      {/* About Section */}
      <section className="max-w-3xl mx-auto py-10 px-4">
        <div className="bg-gradient-to-br from-blue-50 via-white to-blue-100 rounded-2xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-blue-800 mb-3">About Tata Motors</h2>
          <p className="text-gray-700 text-lg mb-4">
            Tata Motors is India's leading automobile manufacturer, renowned for its innovative engineering, reliability, and customer-first approach. Our vehicles are designed to empower journeys, whether for business or personal use.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <div className="bg-white rounded-lg px-6 py-4 shadow border border-blue-100 hover:shadow-md transition-all">
              <span className="block text-2xl font-bold text-blue-900 mb-1">#1</span>
              <span className="text-blue-800">Commercial Vehicle Brand</span>
            </div>
            <div className="bg-white rounded-lg px-6 py-4 shadow border border-blue-100 hover:shadow-md transition-all">
              <span className="block text-2xl font-bold text-blue-900 mb-1">Millions</span>
              <span className="text-blue-800">of Happy Customers</span>
            </div>
            <div className="bg-white rounded-lg px-6 py-4 shadow border border-blue-100 hover:shadow-md transition-all">
              <span className="block text-2xl font-bold text-blue-900 mb-1">Nationwide</span>
              <span className="text-blue-800">Service Network</span>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Videos Section */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-blue-900 mb-2 text-center">Customer Testimonials</h2>
        <p className="text-gray-600 mb-8 text-center">Hear directly from Tata Motors owners across the country.</p>
        <div className="bg-white/90 rounded-2xl shadow-lg p-6 mb-10 max-w-4xl mx-auto">
          <VideoFilters onFilter={handleFilter} videos={videos} />
        </div>
        {filteredVideos.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl text-gray-500">No videos found</h3>
            <p className="text-gray-400">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="flex flex-wrap items-start gap-8 justify-center">
            {filteredVideos.map((video) => (
              <div className="flex-grow-0 flex-shrink-0" key={video.id}>
                <VideoCard video={video} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="text-center py-12 bg-gradient-to-br from-blue-50 via-white to-blue-100 border-t border-blue-100">
        <div className="inline-block bg-white/90 rounded-2xl shadow-lg px-10 py-8">
          <h3 className="text-2xl font-bold text-blue-900 mb-4">Ready to join the Tata family?</h3>
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg transition-colors duration-200"
          >
            Enquire on WhatsApp
          </a>
          <div className="mt-4">
            <a href="mailto:enquiry@tatamotors.com" className="text-blue-700 underline mx-2">Email Us</a>
            <span className="text-gray-400">|</span>
            <a href="tel:+919538022290" className="text-blue-700 underline mx-2">Call: +91 95380 22290</a>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto py-12 px-4">
        <div className="bg-white/90 rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-gradient-to-br from-blue-50 via-white to-blue-100 rounded-lg shadow p-6 border border-blue-100">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">{faq.question}</h3>
                <p className="text-gray-700 text-base">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-white via-blue-50 to-blue-100 border-t border-blue-100 py-8 mt-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <img src="/tata-logo.jpg" alt="Tata Motors Logo" className="h-8 w-auto" />
            <span className="text-blue-900 font-bold text-lg">Tata Motors</span>
          </div>
          <div className="text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} Tata Motors. All rights reserved.
          </div>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="https://www.facebook.com/TataMotorsGroup" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">Facebook</a>
            <a href="https://twitter.com/TataMotors" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">Twitter</a>
            <a href="https://www.instagram.com/tatamotorsgroup/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">Instagram</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
