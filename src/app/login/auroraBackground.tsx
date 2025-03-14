"use client";

import { motion } from "framer-motion";
import React from "react";
import { AuroraBackground } from "../../components/ui/aurora-background";

export function AuroraBackgroundDemo() {
  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="w-[1000px] relative flex flex-col gap-4 items-center justify-center px-4"
      >
        <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-blue-500 to-green-400" />

      </motion.div>
    </AuroraBackground>
  );
}
