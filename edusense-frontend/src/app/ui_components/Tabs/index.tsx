import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './Tabs.scss';

interface TabsProps {
    tabs: string[];
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabChange }) => {
    const [underlineProps, setUnderlineProps] = useState({ left: 0, width: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            const activeButton = Array.from(containerRef.current.children).find(
                (child: any) => child.textContent === activeTab,
            ) as HTMLElement;
            if (activeButton) {
                setUnderlineProps({
                    left: activeButton.offsetLeft,
                    width: activeButton.offsetWidth,
                });
            }
        }
    }, [activeTab, tabs]);

    return (
        <div className="tabs" ref={containerRef} style={{ position: 'relative' }}>
            {tabs.map((tab, index) => (
                <button
                    key={tab}
                    className={`tab ${tab === activeTab ? 'active' : ''}`}
                    onClick={() => onTabChange(tab)}
                    data-testid={`tab-${index}`}
                >
                    {tab}
                </button>
            ))}

            {/* Sliding underline */}
            <motion.div
                className="tab-underline"
                animate={{ left: underlineProps.left, width: underlineProps.width }}
                transition={{ type: 'spring', stiffness: 150, damping: 30 }}
            />
        </div>
    );
};

export default Tabs;
