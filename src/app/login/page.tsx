"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FaGoogle } from "react-icons/fa";
import { AuroraBackground } from "@/components/ui/aurora-background";
import LoginForm from "./form";
import Logo from "@/components/logo";

export default function Login() {
  return (
    <AuroraBackground>
      <div className="flex min-h-screen w-full items-center justify-center p-4 sm:p-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="w-full max-w-md space-y-8 rounded-xl border backdrop-blur-sm sm:p-8"
        >
          {/* Logo */}
          <div className="flex justify-center">
            <Logo />
          </div>

          {/* Title and subtitle */}
          <div className="text-center">
            <h2 className="text-3xl font-bold">Entrar</h2>
            <p className="mt-2 text-sm text-gray-600">
              Insira seus dados para iniciar sessão
            </p>
          </div>

          {/* Form */}
          <LoginForm />

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm"></div>
          </div>

          {/* Google login button */}
          <Button variant="outline" className="w-full">
            <FaGoogle className="mr-2" />
            Google
          </Button>
        </motion.div>
      </div>
    </AuroraBackground>
  );
}
