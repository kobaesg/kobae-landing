"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import type { MutualConnection } from "@/lib/api/types";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    connections: MutualConnection[];
}

export function MutualConnectionsSheet({ isOpen, onClose, connections }: Props) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.4 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black z-50"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 max-h-[70vh] overflow-y-auto"
                    >
                        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e8e0da]">
                            <h3 className="font-serif font-semibold text-[18px] text-[#181412]">
                                Mutual Connections
                            </h3>
                            <button onClick={onClose} className="p-1 rounded-full hover:bg-[#f5ede6]">
                                <X size={20} className="text-[#453933]" />
                            </button>
                        </div>
                        <div className="px-5 py-3">
                            {connections.map((conn) => (
                                <div key={conn.user_id} className="flex items-center gap-3 py-3">
                                    <div className="w-10 h-10 rounded-full bg-[#e8d5c8] flex-shrink-0 overflow-hidden">
                                        {conn.photo_url && (
                                            <img src={conn.photo_url} alt="" className="w-full h-full object-cover" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-[15px] font-semibold font-sans text-[#181412]">
                                            {conn.first_name} {conn.last_name}
                                        </p>
                                        {conn.headline && (
                                            <p className="text-[13px] font-sans text-[#715e55]">{conn.headline}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {connections.length === 0 && (
                                <p className="text-[14px] font-sans text-[#9b8479] text-center py-6">No mutual connections yet</p>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
