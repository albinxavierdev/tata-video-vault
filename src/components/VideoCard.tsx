
interface Video {
  id: string;
  title: string;
  video_url: string;
  caption: string | null;
  vehicle_model: string;
  region: string;
  created_at: string;
}

interface VideoCardProps {
  video: Video;
}

export const VideoCard = ({ video }: VideoCardProps) => {
  const getEmbedUrl = (url: string) => {
    // Convert YouTube URLs to embed format
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="aspect-video w-full">
        <iframe
          src={getEmbedUrl(video.video_url)}
          title={video.title}
          className="w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {video.title}
        </h3>
        
        {video.caption && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {video.caption}
          </p>
        )}
        
        <div className="flex justify-between items-center text-sm">
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            {video.vehicle_model}
          </span>
          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
            {video.region}
          </span>
        </div>
      </div>
    </div>
  );
};
