"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function ScanQRPage() {
    const router = useRouter();
    const html5QrcodeRef = useRef<import("html5-qrcode").Html5Qrcode | null>(null);
    const [error, setError] = useState<string | null>(null);
    const startedRef = useRef(false);

    useEffect(() => {
        if (startedRef.current) return;
        startedRef.current = true;

        let instance: import("html5-qrcode").Html5Qrcode | null = null;

        import("html5-qrcode").then(({ Html5Qrcode }) => {
            instance = new Html5Qrcode("qr-video");
            html5QrcodeRef.current = instance;

            instance
                .start(
                    { facingMode: "environment" },
                    { fps: 10, qrbox: { width: 240, height: 240 }, aspectRatio: 1.0 },
                    (decodedText) => {
                        try {
                            const url = new URL(decodedText);
                            const match = url.pathname.match(/^\/users\/([^/]+)$/);
                            if (match?.[1]) {
                                instance?.stop().catch(() => {});
                                router.push(`/scan/${match[1]}`);
                                return;
                            }
                        } catch {
                            // not a URL
                        }
                        setError("This QR code doesn't belong to a Kobae profile.");
                    },
                    () => {
                        // per-frame failure — ignore
                    }
                )
                .catch(() => {
                    setError("Camera access denied. Please allow camera permissions and try again.");
                });
        });

        return () => {
            instance?.stop().catch(() => {});
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="flex flex-col min-h-dvh bg-[#181412]">
            {/* Header */}
            <div className="flex items-center px-5 pt-safe pt-4 pb-3">
                <button
                    onClick={() => router.back()}
                    className="w-10 h-10 flex items-center justify-center"
                    aria-label="Go back"
                >
                    <ArrowLeft size={24} className="text-white" strokeWidth={1.5} />
                </button>
                <h1 className="flex-1 text-center font-serif font-semibold text-[22px] leading-[30px] text-white">
                    Scan QR Code
                </h1>
                <div className="w-10" />
            </div>

            {/* Scanner */}
            <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6">
                {/* Square viewfinder wrapper */}
                <div className="relative w-full max-w-[300px] aspect-square">
                    {/* Video element — html5-qrcode renders into this div */}
                    <div
                        id="qr-video"
                        className="w-full h-full rounded-2xl overflow-hidden bg-black [&_video]:w-full [&_video]:h-full [&_video]:object-cover [&_img]:hidden"
                    />

                    {/* Corner bracket overlay */}
                    <div className="pointer-events-none absolute inset-0">
                        {/* top-left */}
                        <span className="absolute top-0 left-0 w-8 h-8 border-t-[3px] border-l-[3px] border-white/80 rounded-tl-xl" />
                        {/* top-right */}
                        <span className="absolute top-0 right-0 w-8 h-8 border-t-[3px] border-r-[3px] border-white/80 rounded-tr-xl" />
                        {/* bottom-left */}
                        <span className="absolute bottom-0 left-0 w-8 h-8 border-b-[3px] border-l-[3px] border-white/80 rounded-bl-xl" />
                        {/* bottom-right */}
                        <span className="absolute bottom-0 right-0 w-8 h-8 border-b-[3px] border-r-[3px] border-white/80 rounded-br-xl" />
                    </div>
                </div>

                <p className="text-[14px] font-sans text-white/50 text-center">
                    Align QR code with the frame to scan
                </p>

                {error && (
                    <div className="w-full max-w-sm bg-[#3a1a0a] border border-[#d8602e]/40 rounded-xl px-4 py-3 text-center">
                        <p className="text-[13px] font-sans text-[#d8602e]">{error}</p>
                        <button
                            onClick={() => setError(null)}
                            className="text-[12px] text-white/50 mt-1 underline"
                        >
                            Try again
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
