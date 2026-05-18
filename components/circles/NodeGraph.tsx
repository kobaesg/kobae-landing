"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import type { GraphNode, CirclesGraphResponse } from "@/lib/api/types";

// Dynamically import ForceGraph2D to avoid SSR issues
const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
    ),
});

// Archetype color mapping
const ARCHETYPE_COLORS: Record<string, string> = {
    "The Anchor": "#3B82F6", // blue
    "The Diplomat": "#10B981", // emerald
    "The Catalyst": "#F59E0B", // amber
    "The Visionary": "#8B5CF6", // violet
    "The Strategist": "#EF4444", // red
    "The Harmonizer": "#EC4899", // pink
    "The Pioneer": "#F97316", // orange
    "The Sage": "#6366F1", // indigo
    default: "#6B7280", // gray
};

// Extended node type for force graph internal use
interface ForceGraphNode extends GraphNode {
    x?: number;
    y?: number;
    vx?: number;
    vy?: number;
    fx?: number;
    fy?: number;
    __img?: HTMLImageElement;
    __imgLoaded?: boolean;
}

interface NodeGraphProps {
    data: CirclesGraphResponse;
    width?: number;
    height?: number;
}

export function NodeGraph({ data, width = 400, height = 500 }: NodeGraphProps) {
    const router = useRouter();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const graphRef = useRef<any>(null);
    const [hoveredNode, setHoveredNode] = useState<ForceGraphNode | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width, height });

    // Update dimensions on resize
    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                setDimensions({
                    width: rect.width || width,
                    height: rect.height || height,
                });
            }
        };

        updateDimensions();
        window.addEventListener("resize", updateDimensions);
        return () => window.removeEventListener("resize", updateDimensions);
    }, [width, height]);

    // Transform data for force graph
    const graphData = useMemo(() => {
        // Create nodes array with "me" as the first node
        const nodes = [
            { ...data.me, degree: 0 },
            ...data.nodes,
        ];

        // Create links array
        const links = data.links.map((link) => ({
            source: link.source,
            target: link.target,
            type: link.type,
        }));

        return { nodes, links };
    }, [data]);

    // Preload images for nodes
    useEffect(() => {
        graphData.nodes.forEach((node) => {
            const n = node as ForceGraphNode;
            if (n.photo_url && !n.__img) {
                const img = new Image();
                img.crossOrigin = "anonymous";
                img.src = n.photo_url;
                img.onload = () => {
                    n.__img = img;
                    n.__imgLoaded = true;
                };
                img.onerror = () => {
                    n.__imgLoaded = false;
                };
            }
        });
    }, [graphData.nodes]);

    // Configure forces and center graph on load
    useEffect(() => {
        // Add delay to ensure ForceGraph2D is fully mounted before configuring forces
        const configureForces = () => {
            if (graphRef.current) {
                // Configure d3 forces for better node separation
                const linkForce = graphRef.current.d3Force("link");
                if (linkForce) {
                    linkForce.distance(200); // Increase link distance
                }
                
                const chargeForce = graphRef.current.d3Force("charge");
                if (chargeForce) {
                    chargeForce.strength(-800); // Stronger repulsion
                    chargeForce.distanceMax(500); // Max distance for charge effect
                }
                
                // Reheat the simulation to apply new forces
                graphRef.current.d3ReheatSimulation();
                
                setTimeout(() => {
                    graphRef.current?.zoomToFit(400, 50);
                }, 800);
            }
        };
        
        // Small delay to ensure the graph component is fully initialized
        const timer = setTimeout(configureForces, 100);
        
        return () => clearTimeout(timer);
    }, [graphData]);

    // Get node color based on archetype
    const getNodeColor = useCallback((node: ForceGraphNode) => {
        if (node.degree === 0) return "#7C3AED"; // Purple for self
        return ARCHETYPE_COLORS[node.archetype || ""] || ARCHETYPE_COLORS.default;
    }, []);

    // Get node size based on degree
    const getNodeSize = useCallback((node: ForceGraphNode) => {
        if (node.degree === 0) return 20; // Larger for self
        if (node.degree === 1) return 14; // Medium for 1st degree
        return 10; // Smaller for 2nd degree
    }, []);

    // Custom node canvas rendering
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nodeCanvasObject = useCallback(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
            const n = node as ForceGraphNode;
            const size = getNodeSize(n);
            const x = n.x || 0;
            const y = n.y || 0;

            // Draw outer ring for self
            if (n.degree === 0) {
                ctx.beginPath();
                ctx.arc(x, y, size + 3, 0, 2 * Math.PI);
                ctx.strokeStyle = "#7C3AED";
                ctx.lineWidth = 2;
                ctx.stroke();
            }

            // Draw node circle
            ctx.beginPath();
            ctx.arc(x, y, size, 0, 2 * Math.PI);
            ctx.fillStyle = getNodeColor(n);
            ctx.fill();

            // Draw profile image if available, otherwise draw initials
            if (n.__imgLoaded && n.__img) {
                ctx.save();
                ctx.beginPath();
                ctx.arc(x, y, size - 2, 0, 2 * Math.PI);
                ctx.clip();
                ctx.drawImage(
                    n.__img,
                    x - (size - 2),
                    y - (size - 2),
                    (size - 2) * 2,
                    (size - 2) * 2
                );
                ctx.restore();
            } else {
                // Draw initials as fallback
                const initials = `${n.first_name?.[0] || ""}${n.last_name?.[0] || ""}`.toUpperCase();
                const fontSize = Math.max(size * 0.7, 8);
                ctx.font = `bold ${fontSize}px Inter, sans-serif`;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillStyle = "#FFFFFF";
                ctx.fillText(initials, x, y);
            }

            // Draw label for hovered node or self
            if (hoveredNode?.user_id === n.user_id || n.degree === 0) {
                const label = n.first_name;
                const fontSize = Math.max(12 / globalScale, 4);
                ctx.font = `${fontSize}px Inter, sans-serif`;
                ctx.textAlign = "center";
                ctx.textBaseline = "top";
                ctx.fillStyle = "#1F2937";
                ctx.fillText(label, x, y + size + 4);
            }
        },
        [getNodeColor, getNodeSize, hoveredNode]
    );

    // Custom link rendering
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const linkCanvasObject = useCallback(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (link: any, ctx: CanvasRenderingContext2D) => {
            const source = link.source as ForceGraphNode;
            const target = link.target as ForceGraphNode;

            if (!source.x || !source.y || !target.x || !target.y) return;

            ctx.beginPath();
            ctx.moveTo(source.x, source.y);
            ctx.lineTo(target.x, target.y);

            if (link.type === "connected") {
                ctx.strokeStyle = "rgba(124, 58, 237, 0.4)"; // Purple for connected
                ctx.lineWidth = 1.5;
                ctx.setLineDash([]);
            } else {
                ctx.strokeStyle = "rgba(156, 163, 175, 0.3)"; // Gray for potential
                ctx.lineWidth = 1;
                ctx.setLineDash([4, 4]);
            }

            ctx.stroke();
            ctx.setLineDash([]);
        },
        []
    );

    // Handle node click
    const handleNodeClick = useCallback(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (node: any) => {
            const n = node as ForceGraphNode;
            if (n.degree === 0) return; // Don't navigate for self
            router.push(`/connections/${n.user_id}`);
        },
        [router]
    );

    // Handle node hover
    const handleNodeHover = useCallback(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (node: any) => {
            const n = node as ForceGraphNode | null;
            setHoveredNode(n);
            if (typeof document !== "undefined") {
                document.body.style.cursor = n && n.degree !== 0 ? "pointer" : "default";
            }
        },
        []
    );

    return (
        <div ref={containerRef} className="absolute inset-0">
            <ForceGraph2D
                ref={graphRef}
                graphData={graphData}
                width={dimensions.width}
                height={dimensions.height}
                nodeId="user_id"
                nodeCanvasObject={nodeCanvasObject}
                nodePointerAreaPaint={(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    node: any,
                    color: string,
                    ctx: CanvasRenderingContext2D
                ) => {
                    const n = node as ForceGraphNode;
                    const size = getNodeSize(n);
                    ctx.fillStyle = color;
                    ctx.beginPath();
                    ctx.arc(n.x || 0, n.y || 0, size + 5, 0, 2 * Math.PI);
                    ctx.fill();
                }}
                linkCanvasObject={linkCanvasObject}
                onNodeClick={handleNodeClick}
                onNodeHover={handleNodeHover}
                cooldownTicks={100}
                d3AlphaDecay={0.02}
                d3VelocityDecay={0.3}
                enableZoomInteraction={true}
                enablePanInteraction={true}
                minZoom={0.5}
                maxZoom={4}
                backgroundColor="transparent"
            />

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-sm text-xs">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded-full bg-[#7C3AED]" />
                    <span className="text-gray-600">You</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded-full bg-gray-400" />
                    <span className="text-gray-600">Connections</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-300 opacity-60" />
                    <span className="text-gray-600">Friends of friends</span>
                </div>
            </div>

            {/* Hovered node info */}
            {hoveredNode && hoveredNode.degree !== 0 && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-sm rounded-lg px-4 py-2 shadow-md">
                    <p className="font-medium text-gray-900">
                        {hoveredNode.first_name} {hoveredNode.last_name}
                    </p>
                    {hoveredNode.archetype && (
                        <p className="text-xs text-gray-500">{hoveredNode.archetype}</p>
                    )}
                    <p className="text-xs text-primary mt-1">Tap to view profile</p>
                </div>
            )}
        </div>
    );
}