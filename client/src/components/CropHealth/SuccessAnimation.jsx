import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const SuccessAnimation = ({ onComplete }) => {
    const [show, setShow] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShow(false);
            if (onComplete) {
                setTimeout(() => onComplete(), 300); // Wait for fade out
            }
        }, 1500);

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50"
                >
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        transition={{
                            type: "spring",
                            stiffness: 200,
                            damping: 20
                        }}
                        className="bg-white rounded-full p-8 shadow-2xl"
                    >
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                            }}
                            transition={{
                                duration: 0.5,
                                repeat: 1,
                                ease: "easeInOut"
                            }}
                        >
                            <CheckCircle 
                                className="text-green-500 w-24 h-24" 
                                strokeWidth={3}
                            />
                        </motion.div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: 0.2 }}
                        className="absolute mt-48 text-center"
                    >
                        <p className="text-white text-2xl font-bold bg-green-500 px-6 py-3 rounded-full shadow-lg">
                            ವಿಶ್ಲೇಷಣೆ ಪೂರ್ಣಗೊಂಡಿದೆ ✓
                        </p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SuccessAnimation;
