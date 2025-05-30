
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Video {
  id: string;
  title: string;
  video_url: string;
  caption: string | null;
  vehicle_model: string;
  region: string;
  created_at: string;
}

interface VideoFiltersProps {
  onFilter: (model: string, region: string) => void;
  videos: Video[];
}

export const VideoFilters = ({ onFilter, videos }: VideoFiltersProps) => {
  const [selectedModel, setSelectedModel] = useState("all");
  const [selectedRegion, setSelectedRegion] = useState("all");

  const uniqueModels = Array.from(new Set(videos.map(video => video.vehicle_model)));
  const uniqueRegions = Array.from(new Set(videos.map(video => video.region)));

  useEffect(() => {
    onFilter(selectedModel, selectedRegion);
  }, [selectedModel, selectedRegion, onFilter]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Videos</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vehicle Model
          </label>
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger>
              <SelectValue placeholder="All Models" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Models</SelectItem>
              {uniqueModels.map((model) => (
                <SelectItem key={model} value={model}>
                  {model}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Region
          </label>
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger>
              <SelectValue placeholder="All Regions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              {uniqueRegions.map((region) => (
                <SelectItem key={region} value={region}>
                  {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
