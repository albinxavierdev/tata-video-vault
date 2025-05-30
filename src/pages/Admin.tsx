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
  is_short?: boolean;
  application: string;
}

interface Vehicle {
  id: string;
  image: string;
  name: string;
  spec_gvw: string;
  spec_fuel: string;
  spec_engine: string;
  created_at: string;
}

const APPLICATION_OPTIONS = [
  'Fruits and Vegetables',
  'Cereal',
  'Construction',
  'Logistics',
  'Poultry',
  'Fisheries',
  'FMCG',
  'Milk',
  'Refrigerated Vans',
];

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
    is_short: false,
    application: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehicleForm, setVehicleForm] = useState({
    image: '',
    name: '',
    spec_gvw: '',
    spec_fuel: '',
    spec_engine: '',
  });
  const [vehicleEditingId, setVehicleEditingId] = useState<string | null>(null);
  const [vehicleSubmitting, setVehicleSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] = useState<'dashboard' | 'videos' | 'vehicles'>('dashboard');

  useEffect(() => {
    checkAuth();
    fetchVideos();
    fetchVehicles();
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

  const fetchVehicles = async () => {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setVehicles(data || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load vehicles',
        variant: 'destructive',
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
        is_short: false,
        application: "",
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
      is_short: video.is_short || false,
      application: video.application,
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
      is_short: false,
      application: "",
    });
    setEditingId(null);
  };

  const handleVehicleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setVehicleSubmitting(true);
    try {
      if (vehicleEditingId) {
        const { error } = await supabase
          .from('vehicles')
          .update(vehicleForm)
          .eq('id', vehicleEditingId);
        if (error) throw error;
        toast({ title: 'Success!', description: 'Vehicle updated successfully.' });
      } else {
        const { error } = await supabase
          .from('vehicles')
          .insert([vehicleForm]);
        if (error) throw error;
        toast({ title: 'Success!', description: 'Vehicle added successfully.' });
      }
      setVehicleForm({ image: '', name: '', spec_gvw: '', spec_fuel: '', spec_engine: '' });
      setVehicleEditingId(null);
      fetchVehicles();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setVehicleSubmitting(false);
    }
  };

  const handleVehicleEdit = (vehicle: Vehicle) => {
    setVehicleForm({
      image: vehicle.image,
      name: vehicle.name,
      spec_gvw: vehicle.spec_gvw,
      spec_fuel: vehicle.spec_fuel,
      spec_engine: vehicle.spec_engine,
    });
    setVehicleEditingId(vehicle.id);
  };

  const handleVehicleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', id);
      if (error) throw error;
      toast({ title: 'Success!', description: 'Vehicle deleted successfully.' });
      fetchVehicles();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const cancelVehicleEdit = () => {
    setVehicleForm({ image: '', name: '', spec_gvw: '', spec_fuel: '', spec_engine: '' });
    setVehicleEditingId(null);
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
    <div className="min-h-screen flex bg-blue-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#307FE2] text-white flex flex-col items-center py-8 px-4 min-h-screen shadow-lg">
        <div className="mb-8 flex flex-col items-center">
          <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mb-2 drop-shadow-lg">
            <img src="/tata-motors-logo.png" alt="Tata Motors Logo" className="w-12 h-12 object-contain" />
          </div>
          <span className="font-bold text-lg tracking-wide">Tata Admin</span>
        </div>
        <nav className="flex flex-col gap-4 w-full">
          <button onClick={() => setSelectedSection('dashboard')} className={`py-2 px-4 rounded text-left font-semibold transition ${selectedSection === 'dashboard' ? 'bg-blue-800' : 'hover:bg-blue-800'}`}>Dashboard</button>
          <button onClick={() => setSelectedSection('videos')} className={`py-2 px-4 rounded text-left font-semibold transition ${selectedSection === 'videos' ? 'bg-blue-800' : 'hover:bg-blue-800'}`}>Videos</button>
          <button onClick={() => setSelectedSection('vehicles')} className={`py-2 px-4 rounded text-left font-semibold transition ${selectedSection === 'vehicles' ? 'bg-blue-800' : 'hover:bg-blue-800'}`}>Vehicles</button>
          <button onClick={async () => { await supabase.auth.signOut(); navigate('/auth'); }} className="mt-8 py-2 px-4 rounded bg-white text-[#307FE2] font-bold shadow hover:bg-blue-100 transition">Logout</button>
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-8 flex flex-col gap-12">
        {selectedSection === 'dashboard' && (
          <div id="dashboard" className="mb-8">
            <h1 className="text-3xl font-bold text-[#307FE2] mb-2">Admin Panel</h1>
            <p className="text-lg text-gray-700">Manage your Tata Motors content and data.</p>
          </div>
        )}
        {selectedSection === 'videos' && (
          <div id="videos" className="mb-12">
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

                    <select
                      className="w-full border rounded px-3 py-2 text-gray-700"
                      value={formData.application}
                      onChange={e => setFormData({ ...formData, application: e.target.value })}
                      required
                    >
                      <option value="">Select Application</option>
                      {APPLICATION_OPTIONS.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="is_short"
                        checked={formData.is_short}
                        onChange={(e) => setFormData({...formData, is_short: e.target.checked})}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="is_short" className="text-sm text-gray-700">
                        This is a YouTube Short
                      </label>
                    </div>
                    
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
        )}
        {selectedSection === 'vehicles' && (
          <div id="vehicles" className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Manage Vehicles (Find Your Drive For Success Section)</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleVehicleSubmit} className="space-y-4 mb-8">
                  <Input
                    placeholder="Image URL (public folder or external)"
                    value={vehicleForm.image}
                    onChange={e => setVehicleForm({ ...vehicleForm, image: e.target.value })}
                    required
                  />
                  <Input
                    placeholder="Vehicle Name"
                    value={vehicleForm.name}
                    onChange={e => setVehicleForm({ ...vehicleForm, name: e.target.value })}
                    required
                  />
                  <Input
                    placeholder="GVW (e.g. 3160 kg)"
                    value={vehicleForm.spec_gvw}
                    onChange={e => setVehicleForm({ ...vehicleForm, spec_gvw: e.target.value })}
                    required
                  />
                  <Input
                    placeholder="Payload (e.g. 1500 kg)"
                    value={vehicleForm.spec_fuel}
                    onChange={e => setVehicleForm({ ...vehicleForm, spec_fuel: e.target.value })}
                    required
                  />
                  <Input
                    placeholder="Engine (e.g. 1497 CC)"
                    value={vehicleForm.spec_engine}
                    onChange={e => setVehicleForm({ ...vehicleForm, spec_engine: e.target.value })}
                    required
                  />
                  <div className="flex space-x-2">
                    <Button type="submit" disabled={vehicleSubmitting}>
                      {vehicleEditingId ? 'Update Vehicle' : 'Add Vehicle'}
                    </Button>
                    {vehicleEditingId && (
                      <Button type="button" variant="outline" onClick={cancelVehicleEdit}>
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white rounded shadow">
                    <thead>
                      <tr>
                        <th className="px-4 py-2">Image</th>
                        <th className="px-4 py-2">Name</th>
                        <th className="px-4 py-2">GVW</th>
                        <th className="px-4 py-2">Payload</th>
                        <th className="px-4 py-2">Engine</th>
                        <th className="px-4 py-2">Application</th>
                        <th className="px-4 py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vehicles.map(vehicle => (
                        <tr key={vehicle.id} className="border-t">
                          <td className="px-4 py-2"><img src={vehicle.image} alt={vehicle.name} className="h-12 w-auto rounded" /></td>
                          <td className="px-4 py-2">{vehicle.name}</td>
                          <td className="px-4 py-2">{vehicle.spec_gvw}</td>
                          <td className="px-4 py-2">{vehicle.spec_fuel}</td>
                          <td className="px-4 py-2">{vehicle.spec_engine}</td>
                          <td className="px-4 py-2">{vehicle.application}</td>
                          <td className="px-4 py-2">
                            <Button size="sm" variant="ghost" onClick={() => handleVehicleEdit(vehicle)}>Edit</Button>
                            <Button size="sm" variant="destructive" onClick={() => handleVehicleDelete(vehicle.id)}>Delete</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
