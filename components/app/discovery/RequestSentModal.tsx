"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

interface Props { isOpen: boolean; onClose: () => void; name?: string }

export function RequestSentModal({ isOpen, onClose, name }: Props) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-8"
                >
                    <motion.div
                        initial={{ scale: 0.85, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.85, opacity: 0 }}
                        transition={{ type: "spring", damping: 20, stiffness: 300 }}
                        className="bg-white rounded-2xl p-8 flex flex-col items-center gap-5 max-w-sm w-full"
                    >
                        <div className="w-16 h-16 rounded-full bg-[#e6f7e6] flex items-center justify-center">
                            <Check size={32} className="text-[#2e8b57]" strokeWidth={2.5} />
                        </div>
                        <div className="text-center">
                            <h3 className="font-serif font-semibold text-[20px] text-[#181412] mb-1">
                                Request Sent!
                            </h3>
                            <p className="text-[14px] font-sans text-[#715e55]">
                                {name ? `We've let ${name} know you'd like to connect.` : "Your connection request has been sent."}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-full py-3.5 rounded-2xl bg-[#d8602e] text-white font-semibold font-sans text-[15px] active:scale-[0.98] transition-transform"
                        >
                            Got it
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
