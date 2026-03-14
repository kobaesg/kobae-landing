"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, UserPlus, UserCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePendingRequests, useAcceptRequest, useDeclineRequest } from "@/lib/api/hooks/use-connections";
import { useNotifications, useMarkAllRead } from "@/lib/api/hooks/use-notifications";
import { DeclinedToast } from "@/components/app/discovery/DeclinedToast";

function formatRelativeTime(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${Math.max(1, minutes)}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}d`;
}

export default function NotificationsPage() {
    const router = useRouter();
    const { data: pendingRequests } = usePendingRequests();
    const { data: notifications } = useNotifications();
    const acceptMutation = useAcceptRequest();
    const declineMutation = useDeclineRequest();
    const markAllReadMutation = useMarkAllRead();

    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const handleAccept = useCallback(
        (requestId: string, name: string) => {
            acceptMutation.mutate(requestId, {
                onSuccess: () => {
                    setToastMessage(`You're now connected with ${name}!`);
                    setTimeout(() => setToastMessage(null), 2500);
                },
            });
        },
        [acceptMutation]
    );

    const handleDecline = useCallback(
        (requestId: string) => {
            declineMutation.mutate(requestId);
        },
        [declineMutation]
    );

    const updateNotifications = notifications?.filter(
        (n) => n.type !== "connection_request"
    );

    return (
        <div className="min-h-dvh pb-20">
            {/* Header */}
            <div className="flex items-center gap-3 px-5 pt-6 pb-4">
                <button
                    onClick={() => router.back()}
                    className="p-1.5 rounded-full hover:bg-[#f5ede6] transition-colors"
                >
                    <ArrowLeft size={22} className="text-[#453933]" />
                </button>
                <h1 className="font-serif font-semibold text-[24px] text-[#181412] flex-1">
                    Notifications
                </h1>
                {notifications && notifications.some((n) => !n.read) && (
                    <button
                        onClick={() => markAllReadMutation.mutate()}
                        className="text-[13px] font-sans font-medium text-[#d8602e]"
                    >
                        Mark all read
                    </button>
                )}
            </div>

            {/* Connection Requests Section */}
            {pendingRequests && pendingRequests.length > 0 && (
                <div className="px-5 mb-6">
                    <div className="flex items-center gap-2 mb-3">
                        <h2 className="font-serif font-semibold text-[16px] text-[#181412]">
                            Connection Requests
                        </h2>
                        <span className="w-5 h-5 rounded-full bg-[#d8602e] text-white text-[11px] font-bold flex items-center justify-center">
                            {pendingRequests.length}
                        </span>
                    </div>
                    <div className="flex flex-col gap-3">
                        <AnimatePresence>
                            {pendingRequests.map((req) => (
                                <motion.div
                                    key={req.id}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    className="bg-white rounded-xl p-4 shadow-[0_0_7px_rgba(0,0,0,0.08)]"
                                >
                                    {/* Top row: avatar + name/headline */}
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-12 h-12 rounded-full bg-[#e8d5c8] flex-shrink-0 overflow-hidden">
                                            {req.sender.photo_url && (
                                                <img
                                                    src={req.sender.photo_url}
                                                    alt=""
                                                    className="w-full h-full object-cover"
                                                />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[15px] font-sans font-semibold text-[#181412] truncate">
                                                {req.sender.first_name} {req.sender.last_name}
                                            </p>
                                            {req.sender.headline && (
                                                <p className="text-[12px] font-sans text-[#715e55] truncate">
                                                    {req.sender.headline}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Bottom row: full-width side-by-side buttons */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleDecline(req.id)}
                                            disabled={declineMutation.isPending}
                                            className="flex-1 py-2 rounded-full text-[13px] font-sans font-semibold text-[#d8602e] border border-[#d8602e] bg-white hover:bg-[#fff0eb] transition-colors"
                                        >
                                            Decline
                                        </button>
                                        <button
                                            onClick={() => handleAccept(req.id, req.sender.first_name)}
                                            disabled={acceptMutation.isPending}
                                            className="flex-1 py-2 rounded-full text-[13px] font-sans font-semibold text-white bg-[#d8602e] active:scale-[0.98] transition-transform disabled:opacity-50"
                                        >
                                            Accept
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            )}

            {/* Updates Section */}
            <div className="px-5">
                {updateNotifications && updateNotifications.length > 0 && (
                    <>
                        <h2 className="font-serif font-semibold text-[16px] text-[#181412] mb-3">
                            Updates
                        </h2>
                        <div className="flex flex-col gap-2">
                            {updateNotifications.map((notif) => {
                                const senderPhotoUrl = notif.type === "connection_accepted"
                                    ? (notif.data.sender_photo_url as string | undefined)
                                    : undefined;

                                return (
                                    <div
                                        key={notif.id}
                                        className={`flex items-start gap-3 p-4 rounded-xl transition-colors ${
                                            notif.read ? "bg-white" : "bg-[#ffefe5]/50"
                                        }`}
                                    >
                                        <div className="w-9 h-9 rounded-full bg-[#f5ede6] flex items-center justify-center flex-shrink-0 overflow-hidden">
                                            {senderPhotoUrl ? (
                                                <img src={senderPhotoUrl} alt="" className="w-full h-full object-cover" />
                                            ) : notif.type === "connection_accepted" ? (
                                                <UserCheck size={18} className="text-[#2e8b57]" />
                                            ) : (
                                                <UserPlus size={18} className="text-[#d8602e]" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[14px] font-sans font-semibold text-[#181412]">
                                                {notif.title}
                                            </p>
                                            <p className="text-[13px] font-sans text-[#715e55]">
                                                {notif.body}
                                            </p>
                                            <p className="text-[11px] font-sans text-[#9b8479] mt-1">
                                                {formatRelativeTime(notif.created_at)}
                                            </p>
                                        </div>
                                        {!notif.read && (
                                            <div className="w-2 h-2 rounded-full bg-[#d8602e] flex-shrink-0 mt-2" />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}

                {/* Empty state */}
                {(!pendingRequests || pendingRequests.length === 0) &&
                    (!updateNotifications || updateNotifications.length === 0) && (
                        <div className="flex flex-col items-center justify-center gap-4 pt-20 text-center">
                            <div className="w-16 h-16 rounded-full bg-[#f5ede6] flex items-center justify-center">
                                <UserPlus size={28} className="text-[#9b8479]" strokeWidth={1.5} />
                            </div>
                            <p className="text-[15px] font-sans text-[#715e55]">
                                No notifications yet
                            </p>
                        </div>
                    )}
            </div>

            <DeclinedToast
                isVisible={!!toastMessage}
                message={toastMessage || ""}
            />
        </div>
    );
}
