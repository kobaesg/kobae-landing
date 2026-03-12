import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Testimonial } from "@/components/sections/Testimonial";
import { Events } from "@/components/sections/Events";
import { OurWhy } from "@/components/sections/OurWhy";
import { CTA } from "@/components/sections/CTA";
import { Footer } from "@/components/sections/Footer";
import { OurSolution ] from "@/components/sections/OurSolution";

export default function Home() {
    return (
        <>
            <Header />
            <main>
                <Hero />
                <OurWhy />
                <OurSolution />
                <HowItWorks/>
                <Testimonial />
                <Events />
                <CTA />
            </main>
            <Footer />
        </>
    );
}
