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
  onFilter: (model: string, region: string, application: string) => void;
  videos: Video[];
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

export const VideoFilters = ({ onFilter, videos }: VideoFiltersProps) => {
  const [selectedModel, setSelectedModel] = useState("all");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedApplication, setSelectedApplication] = useState("all");

  const uniqueModels = Array.from(new Set(videos.map(video => video.vehicle_model)));
  const uniqueRegions = Array.from(new Set(videos.map(video => video.region)));

  useEffect(() => {
    onFilter(selectedModel, selectedRegion, selectedApplication);
  }, [selectedModel, selectedRegion, selectedApplication, onFilter]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 md:p-2 mb-6 md:mb-4">
      <h3 className="text-lg font-semibold text-blue-900 mb-2 text-center md:text-left">Filter Videos</h3>
      <div className="flex flex-col md:flex-row md:items-end md:space-x-4 gap-2 md:gap-0">
        <div className="flex-1">
          <label className="block text-xs font-medium text-gray-700 mb-1">Vehicle Model</label>
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger className="w-full bg-[#307FE2] text-white border-none focus:ring-2 focus:ring-blue-300">
              <SelectValue placeholder="All Models" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Models</SelectItem>
              {uniqueModels.map((model) => (
                <SelectItem key={model} value={model}>{model}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <label className="block text-xs font-medium text-gray-700 mb-1">State</label>
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-full bg-[#307FE2] text-white border-none focus:ring-2 focus:ring-blue-300">
              <SelectValue placeholder="All States" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All States</SelectItem>
              {uniqueRegions.map((region) => (
                <SelectItem key={region} value={region}>{region}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <label className="block text-xs font-medium text-gray-700 mb-1">Application</label>
          <Select value={selectedApplication} onValueChange={setSelectedApplication}>
            <SelectTrigger className="w-full bg-[#307FE2] text-white border-none focus:ring-2 focus:ring-blue-300">
              <SelectValue placeholder="All Applications" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Applications</SelectItem>
              {APPLICATION_OPTIONS.map((app) => (
                <SelectItem key={app} value={app}>{app}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
