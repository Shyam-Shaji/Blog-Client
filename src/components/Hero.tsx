"use client";

import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-[70vh] flex items-center overflow-hidden bg-background">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block mb-6">
            <span className="px-4 py-2 rounded-full bg-card border border-primary/20 text-primary text-sm font-medium">
              ✨ Welcome to Our Blog
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight text-balance">
            Insights, Stories, and Ideas
          </h1>

          <p className="text-xl text-foreground/70 mb-8 leading-relaxed max-w-2xl mx-auto text-balance">
            Explore thoughtfully crafted articles on technology, design, and
            innovation. Stay inspired with our curated collection of content.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-lg px-8 cursor-pointer"
            >
              Start Reading <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-foreground/20 hover:bg-card text-lg px-8 cursor-pointer"
            >
              Subscribe
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
