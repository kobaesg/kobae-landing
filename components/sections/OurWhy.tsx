"use client";

import { motion } from "framer-motion";

export function OurWhy () {
    return (
        <section id="our-why" className="py-32 px-6 lg:px-64 bg-[#f8f7f6]">
            <div className="container mx-auto max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <h2 className="text-4xl md:text-5xl lg:text-[56px] font-normal leading-tight lg:leading-[64px] tracking-tight">
                        Who even likes networking?
                    </h2>
                        <br/>
                        <br/>
                    <p className="mt-5 text-2xl font-normal leading-9 text-[#453933] mx-auto">
                        Many find it pointless, awkward, intimidating or noisy.
                        <br/> 
                        Yet, socialising is a human need that shouldn’t be this hard.   
                        <br />
                        <br />
                        Kobae was created so people can enjoy 
                        <br/>
                        meeting the right people with ease.  
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
