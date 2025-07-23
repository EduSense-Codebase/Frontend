import React from 'react';
import "../theme.css";
import { motion } from "framer-motion";

const CompletionMsg: React.FC = () => {
    
    return (
        
            <div className="theme-vars fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
                <div className="relative">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{opacity: 0, scale: 0.9, transition: { duration: 0.3, ease: "easeInOut" },}}
                    >
                        <img src={`/stars.gif?${Date.now()}`} className="w-[70vh]" />
                    </motion.div>
                    
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1, transition: { duration: 0.7, ease: "easeOut" } }}
                        exit={{opacity: 0, scale: 0.9, transition: { duration: 0.3, ease: "easeInOut" },}}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    >
                        <div className="activity-container">
                            <p className="subheading">Activity Complete!</p>
                        </div>
                    </motion.div>
                </div>
            </div>
            
    );
};

export default CompletionMsg;
