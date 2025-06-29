// components/PointsPopup.tsx
import { useEffect } from 'react';

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
        <div className="fixed top-20 right-50 z-50 animate-bounce rounded-xl bg-green-100 px-4 py-2 text-lg font-bold text-green-800 shadow-lg">
            +{points} Points!
        </div>
    );
}
