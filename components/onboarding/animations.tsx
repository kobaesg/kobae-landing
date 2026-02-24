"use client";

import { motion, AnimatePresence, type Variants } from "framer-motion";
import React from "react";

/* ------------------------------------------------------------------ */
/*  Shared transition presets                                         */
/* ------------------------------------------------------------------ */

const EASE = [0.25, 0.1, 0.25, 1] as const; // cubic-bezier — smooth & subtle

/* ------------------------------------------------------------------ */
/*  PageTransition                                                    */
/*  Wraps a page's content with a fade + slide-up entrance.           */
/*  Use `pageKey` to trigger re-animation on route/section change.    */
/* ------------------------------------------------------------------ */

interface PageTransitionProps {
    children: React.ReactNode;
    /** Change this value to re-trigger the entrance animation */
    pageKey?: string;
    className?: string;
}

const pageVariants: Variants = {
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
    exit: { opacity: 0, y: -8, transition: { duration: 0.2, ease: EASE } },
};

export function PageTransition({
    children,
    pageKey,
    className,
}: PageTransitionProps) {
    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={pageKey}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className={className}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}

/* ------------------------------------------------------------------ */
/*  FadeIn                                                            */
/*  Fade + optional slide for a single element.                       */
/* ------------------------------------------------------------------ */

interface FadeInProps {
    children: React.ReactNode;
    /** Delay in seconds */
    delay?: number;
    /** Vertical offset in px (default 10) */
    y?: number;
    /** Duration in seconds */
    duration?: number;
    className?: string;
}

export function FadeIn({
    children,
    delay = 0,
    y = 10,
    duration = 0.4,
    className,
}: FadeInProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration, delay, ease: EASE }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

/* ------------------------------------------------------------------ */
/*  StaggerContainer + StaggerItem                                    */
/*  Use together to stagger children entrances.                       */
/* ------------------------------------------------------------------ */

interface StaggerContainerProps {
    children: React.ReactNode;
    /** Delay between each child (default 0.06s) */
    staggerDelay?: number;
    /** Initial delay before the first child (default 0.1s) */
    delayChildren?: number;
    className?: string;
}

const containerVariants = (
    stagger: number,
    delayChildren: number,
): Variants => ({
    hidden: {},
    visible: {
        transition: {
            staggerChildren: stagger,
            delayChildren,
        },
    },
});

export function StaggerContainer({
    children,
    staggerDelay = 0.06,
    delayChildren = 0.1,
    className,
}: StaggerContainerProps) {
    return (
        <motion.div
            variants={containerVariants(staggerDelay, delayChildren)}
            initial="hidden"
            animate="visible"
            className={className}
        >
            {children}
        </motion.div>
    );
}

interface StaggerItemProps {
    children: React.ReactNode;
    className?: string;
    /** Vertical offset (default 10) */
    y?: number;
}

const itemVariants = (y: number): Variants => ({
    hidden: { opacity: 0, y },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.35, ease: EASE },
    },
});

export function StaggerItem({ children, className, y = 10 }: StaggerItemProps) {
    return (
        <motion.div variants={itemVariants(y)} className={className}>
            {children}
        </motion.div>
    );
}

/* ------------------------------------------------------------------ */
/*  ScaleOnTap                                                        */
/*  Wraps interactive elements with a subtle press scale.             */
/* ------------------------------------------------------------------ */

interface ScaleOnTapProps {
    children: React.ReactNode;
    scale?: number;
    className?: string;
}

export function ScaleOnTap({
    children,
    scale = 0.97,
    className,
}: ScaleOnTapProps) {
    return (
        <motion.div
            whileTap={{ scale }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

/* ------------------------------------------------------------------ */
/*  PopIn                                                             */
/*  A quick scale + fade entrance for cards, results, etc.            */
/* ------------------------------------------------------------------ */

interface PopInProps {
    children: React.ReactNode;
    delay?: number;
    className?: string;
}

export function PopIn({ children, delay = 0, className }: PopInProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
                duration: 0.45,
                delay,
                ease: [0.34, 1.56, 0.64, 1], // slight overshoot
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
