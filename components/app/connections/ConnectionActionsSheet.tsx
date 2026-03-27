"use client";

import { motion, AnimatePresence } from "framer-motion";
import { UserMinus, ShieldOff } from "lucide-react";
import { useRemoveConnection, useBlockUser } from "@/lib/api/hooks/use-connections";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
    userName: string;
    onActionComplete: () => void;
}

export function ConnectionActionsSheet({ isOpen, onClose, userId, userName, onActionComplete }: Props) {
    const removeConnection = useRemoveConnection();
    const blockUser = useBlockUser();

    const isPending = removeConnection.isPending || blockUser.isPending;

    function handleRemove() {
        removeConnection.mutate(userId, {
            onSuccess: () => {
                onClose();
                onActionComplete();
            },
        });
    }

    function handleBlock() {
        blockUser.mutate(userId, {
            onSuccess: () => {
                onClose();
                onActionComplete();
            },
        });
    }

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
                        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 pb-safe"
                    >
                        {/* Drag handle */}
                        <div className="flex justify-center pt-3 pb-1">
                            <div className="w-10 h-1 rounded-full bg-[#e8e0da]" />
                        </div>

                        <div className="px-5 pb-6 pt-2">
                            <button
                                onClick={handleRemove}
                                disabled={isPending}
                                className="flex items-center gap-4 w-full py-4 text-left disabled:opacity-50"
                            >
                                <div className="w-10 h-10 rounded-full bg-[#f5f0eb] flex items-center justify-center flex-shrink-0">
                                    {removeConnection.isPending ? (
                                        <div className="w-4 h-4 border-2 border-[#453933] border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <UserMinus size={20} className="text-[#453933]" strokeWidth={1.5} />
                                    )}
                                </div>
                                <span className="text-[16px] font-sans text-[#181412]">
                                    Remove connection
                                </span>
                            </button>

                            <div className="h-px bg-[#f0ebe6] mx-0" />

                            <button
                                onClick={handleBlock}
                                disabled={isPending}
                                className="flex items-center gap-4 w-full py-4 text-left disabled:opacity-50"
                            >
                                <div className="w-10 h-10 rounded-full bg-[#f5f0eb] flex items-center justify-center flex-shrink-0">
                                    {blockUser.isPending ? (
                                        <div className="w-4 h-4 border-2 border-[#453933] border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <ShieldOff size={20} className="text-[#453933]" strokeWidth={1.5} />
                                    )}
                                </div>
                                <span className="text-[16px] font-sans text-[#181412]">
                                    Block {userName}
                                </span>
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
