
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VideoManagementTable } from "@/components/VideoManagementTable";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";
import { Link } from "react-router-dom";

interface Video {
  id: string;
  title: string;
  video_url: string;
  caption: string | null;
  vehicle_model: string;
  region: string;
  created_at: string;
}

const Admin = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState<Video[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    video_url: "",
    caption: "",
    vehicle_model: "",
    region: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    fetchVideos();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }
    setUser(user);
    setLoading(false);
  };

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from("videos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setVideos(data || []);
    } catch (error) {
      console.error("Error fetching videos:", error);
      toast({
        title: "Error",
        description: "Failed to load videos",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingId) {
        const { error } = await supabase
          .from("videos")
          .update(formData)
          .eq("id", editingId);
        
        if (error) throw error;
        
        toast({
          title: "Success!",
          description: "Video updated successfully.",
        });
      } else {
        const { error } = await supabase
          .from("videos")
          .insert([formData]);
        
        if (error) throw error;
        
        toast({
          title: "Success!",
          description: "Video added successfully.",
        });
      }
      
      setFormData({
        title: "",
        video_url: "",
        caption: "",
        vehicle_model: "",
        region: "",
      });
      setEditingId(null);
      fetchVideos();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (video: Video) => {
    setFormData({
      title: video.title,
      video_url: video.video_url,
      caption: video.caption || "",
      vehicle_model: video.vehicle_model,
      region: video.region,
    });
    setEditingId(video.id);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("videos")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      
      toast({
        title: "Success!",
        description: "Video deleted successfully.",
      });
      
      fetchVideos();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const cancelEdit = () => {
    setFormData({
      title: "",
      video_url: "",
      caption: "",
      vehicle_model: "",
      region: "",
    });
    setEditingId(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Videos
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="w-5 h-5 mr-2" />
                {editingId ? "Edit Video" : "Add New Video"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  placeholder="Video Title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
                
                <Input
                  placeholder="Video URL (YouTube, etc.)"
                  value={formData.video_url}
                  onChange={(e) => setFormData({...formData, video_url: e.target.value})}
                  required
                />
                
                <Textarea
                  placeholder="Caption (optional)"
                  value={formData.caption}
                  onChange={(e) => setFormData({...formData, caption: e.target.value})}
                  rows={3}
                />
                
                <Input
                  placeholder="Vehicle Model"
                  value={formData.vehicle_model}
                  onChange={(e) => setFormData({...formData, vehicle_model: e.target.value})}
                  required
                />
                
                <Input
                  placeholder="Region"
                  value={formData.region}
                  onChange={(e) => setFormData({...formData, region: e.target.value})}
                  required
                />
                
                <div className="flex space-x-2">
                  <Button 
                    type="submit" 
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    disabled={submitting}
                  >
                    {submitting 
                      ? "Saving..." 
                      : editingId 
                        ? "Update Video" 
                        : "Add Video"
                    }
                  </Button>
                  
                  {editingId && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={cancelEdit}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Manage Videos</CardTitle>
            </CardHeader>
            <CardContent>
              <VideoManagementTable 
                videos={videos} 
                onEdit={handleEdit} 
                onDelete={handleDelete} 
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;
