import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { VideoCard } from "@/components/VideoCard";
import { Header } from "@/components/Header";
import { VideoFilters } from "@/components/VideoFilters";
import { HeroSection } from "@/components/HeroSection";
import { FindYourDriveSection } from "@/components/FindYourDriveSection";

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
  is_short: boolean;
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
  const [showMoreShorts, setShowMoreShorts] = useState(false);
  const [showMoreRegular, setShowMoreRegular] = useState(false);

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

  const handleFilter = (model: string, region: string, application: string) => {
    let filtered = videos;
    if (model !== "all") {
      filtered = filtered.filter(video => video.vehicle_model === model);
    }
    if (region !== "all") {
      filtered = filtered.filter(video => video.region === region);
    }
    if (application !== "all") {
      filtered = filtered.filter(video => video.application === application);
    }
    setFilteredVideos(filtered);
  };

  // Featured testimonials (pick first 1-3 for now)
  const featured = videos.slice(0, 2);

  const shorts = filteredVideos.filter(v => v.is_short);
  const regulars = filteredVideos.filter(v => !v.is_short);
  const shortsToShow = showMoreShorts ? shorts : shorts.slice(0, 4);
  const regularsToShow = showMoreRegular ? regulars : regulars.slice(0, 4);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 text-gray-900 font-sans">
      <Header />
      <HeroSection />
      <div className="border-t border-blue-100" />
      <div id="vehicles">
        <FindYourDriveSection />
      </div>
      <div className="border-t border-blue-100" />
      <section id="success-stories" className="container mx-auto px-4 py-16 bg-white rounded-2xl shadow-lg max-w-7xl min-h-screen">
        <h2 className="text-4xl font-bold text-[#307FE2] mb-4 text-center tracking-wide">Customer Success Stories</h2>
        <p className="text-xl text-gray-700 mb-10 text-center">Real journeys, real results—discover how Tata Intra empowers businesses and lives across India.</p>
        <div className="bg-white rounded-lg p-0 md:p-2 mb-6">
          <VideoFilters onFilter={handleFilter} videos={videos} />
        </div>
        {shortsToShow.length > 0 && (
          <>
            <h3 className="text-2xl font-semibold text-[#307FE2] mb-4 mt-6 text-center">Shorts</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-4">
              {shortsToShow.map((video) => (
                <div className="rounded-2xl border-2 border-[#307FE2] bg-white shadow hover:shadow-lg transition p-2" key={video.id}>
                  <VideoCard video={video} />
                </div>
              ))}
            </div>
            {shorts.length > 4 && !showMoreShorts && (
              <div className="flex justify-center mb-8">
                <button onClick={() => setShowMoreShorts(true)} className="px-8 py-3 bg-[#307FE2] hover:bg-blue-800 text-white rounded-full font-bold shadow transition">Show More Shorts</button>
              </div>
            )}
          </>
        )}
        {regularsToShow.length > 0 && (
          <>
            <h3 className="text-2xl font-semibold text-[#307FE2] mb-4 mt-8 text-center">Customer Stories</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-4">
              {regularsToShow.map((video) => (
                <div className="rounded-2xl border-2 border-[#307FE2] bg-white shadow hover:shadow-lg transition p-2" key={video.id}>
                  <VideoCard video={video} />
                </div>
              ))}
            </div>
            {regulars.length > 4 && !showMoreRegular && (
              <div className="flex justify-center mb-8">
                <button onClick={() => setShowMoreRegular(true)} className="px-8 py-3 bg-[#307FE2] hover:bg-blue-800 text-white rounded-full font-bold shadow transition">Show More Stories</button>
              </div>
            )}
          </>
        )}
        {shortsToShow.length === 0 && regularsToShow.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-2xl text-gray-500">No videos found</h3>
            <p className="text-gray-400">Try adjusting your filters</p>
          </div>
        )}
      </section>
      <div className="border-t border-blue-100" />
      <section id="contact-us" className="text-center py-16 bg-[#307FE2] border-t border-blue-100">
        <div className="inline-block bg-white rounded-2xl shadow-lg border-2 border-[#307FE2] px-10 py-8">
          <h3 className="text-4xl font-bold text-[#307FE2] mb-4">Book your free demo today!</h3>
          <p className="text-xl text-gray-700 mb-6">Take the next step with Tata Intra—connect with us instantly on WhatsApp and drive your business forward!</p>
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full text-lg font-bold shadow-lg transition-colors duration-200"
          >
            WhatsApp Us
          </a>
        </div>
      </section>
      <footer className="bg-blue-50 border-t border-blue-100 py-8 mt-8">
        <div className="container mx-auto px-4 flex flex-col items-center justify-center gap-4">
          <div className="text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} Tata Motors. All rights reserved.
          </div>
          <a href="/auth" className="inline-block bg-[#307FE2] hover:bg-blue-800 text-white px-6 py-2 rounded-full text-base font-bold shadow transition">Signup</a>
        </div>
      </footer>
    </div>
  );
};

export default Index;
