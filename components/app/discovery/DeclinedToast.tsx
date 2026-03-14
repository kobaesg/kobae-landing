"use client";
import { motion, AnimatePresence } from "framer-motion";

interface Props { isVisible: boolean; message?: string }

export function DeclinedToast({ isVisible, message = "Profile declined." }: Props) {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 80, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 80, opacity: 0 }}
                    transition={{ type: "spring", damping: 20, stiffness: 300 }}
                    className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#181412] text-white px-5 py-3 rounded-xl shadow-lg"
                >
                    <p className="text-[14px] font-sans font-medium">{message}</p>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
