// components/PointsPopup.tsx
import { useEffect } from "react";

type Props = {
  points: number;
  onClose: () => void;
};

export default function PointsPopup({ points, onClose }: Props) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 2000); // Hide after 2s
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-20 right-50 bg-green-100 text-green-800 px-4 py-2 rounded-xl shadow-lg text-lg font-bold animate-bounce z-50">
      +{points} Points!
    </div>
  );
}
