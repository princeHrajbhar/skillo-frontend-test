import { X } from "lucide-react";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  poster: string;
}

export default function VideoModal({ isOpen, onClose, videoUrl, poster }: VideoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 animate-fade-in">
      <div className="relative w-full max-w-4xl mx-4">
        <button 
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
        >
          <X className="h-8 w-8" />
        </button>
        <div className="aspect-video bg-black rounded-xl overflow-hidden">
          <video 
            src={videoUrl} 
            controls 
            autoPlay
            className="w-full h-full"
            poster={poster}
          />
        </div>
      </div>
    </div>
  );
}