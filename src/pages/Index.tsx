
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { VideoCard } from "@/components/VideoCard";
import { VideoFilters } from "@/components/VideoFilters";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Video {
  id: string;
  title: string;
  video_url: string;
  caption: string | null;
  vehicle_model: string;
  region: string;
  created_at: string;
}

const Index = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchVideos();
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from("videos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      setVideos(data || []);
      setFilteredVideos(data || []);
    } catch (error) {
      console.error("Error fetching videos:", error);
      toast({
        title: "Error",
        description: "Failed to load videos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading videos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Tata Motors Video Vault
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Discover and explore our complete collection of vehicle videos
          </p>
          
          {user && (
            <Link to="/admin">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Manage Videos
              </Button>
            </Link>
          )}
        </div>

        <VideoFilters onFilter={handleFilter} videos={videos} />

        {filteredVideos.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl text-gray-500">No videos found</h3>
            <p className="text-gray-400">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
