// components/ZoomCard.tsx
'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export function ZoomCard({ title, url }: { title: string; url: string }) {
    const router = useRouter();
    const cardRef = useRef<HTMLDivElement>(null);
    const [animating, setAnimating] = useState(false);
    const [startRect, setStartRect] = useState<DOMRect | null>(null);

    const handleClick = () => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        setStartRect(rect);
        setAnimating(true);

        setTimeout(() => {
            router.push(url);
        }, 600); // matches animation duration
    };

    return (
        <>
            <div
                ref={cardRef}
                onClick={handleClick}
                className="flex h-[250px] w-[250px] items-center justify-center rounded-lg text-center text-white shadow transition-transform duration-200 hover:scale-105 hover:shadow-lg active:scale-95"
                style={{ backgroundColor: '#6C8EBF' }}
            >
                <h3 className="text-xl font-bold">{title}</h3>
            </div>

            {animating && startRect && (
                <motion.div
                    className="fixed z-50 rounded-xl shadow-xl"
                    style={{ backgroundColor: '#6C8EBF' }}
                    initial={{
                        top: startRect.top,
                        left: startRect.left,
                        width: startRect.width,
                        height: startRect.height,
                        borderRadius: 16,
                    }}
                    animate={{
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        borderRadius: 0,
                    }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                />
            )}
        </>
    );
}
