"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function Lamp({ children }: { children: ReactNode }) {
  return (
    <div className="relative isolate flex min-h-[60vh] flex-col items-center justify-center overflow-hidden rounded-3xl bg-[var(--color-bg)]/40 px-4 py-24">
      <div className="absolute inset-0 isolate flex w-full items-center justify-center">
        <motion.div
          initial={{ opacity: 0.5, width: "12rem" }}
          whileInView={{ opacity: 1, width: "32rem" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-auto right-1/2 h-56 overflow-visible w-[32rem] bg-gradient-conic from-cyan-400 via-transparent to-transparent text-white [--conic-position:from_70deg_at_center_top]"
          style={{
            backgroundImage:
              "conic-gradient(from 70deg at center top, rgba(34,211,238,0.6), transparent, transparent)",
          }}
        >
          <div className="absolute w-[100%] left-0 bg-[var(--color-bg)] h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
          <div className="absolute w-40 h-[100%] left-0 bg-[var(--color-bg)] bottom-0 z-20 [mask-image:linear-gradient(to_right,white,transparent)]" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0.5, width: "12rem" }}
          whileInView={{ opacity: 1, width: "32rem" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-auto left-1/2 h-56 w-[32rem] bg-gradient-conic from-transparent via-transparent to-fuchsia-400 text-white [--conic-position:from_290deg_at_center_top]"
          style={{
            backgroundImage:
              "conic-gradient(from 290deg at center top, transparent, transparent, rgba(244,114,182,0.55))",
          }}
        >
          <div className="absolute w-40 h-[100%] right-0 bg-[var(--color-bg)] bottom-0 z-20 [mask-image:linear-gradient(to_left,white,transparent)]" />
          <div className="absolute w-[100%] right-0 bg-[var(--color-bg)] h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
        </motion.div>
        <div className="absolute top-1/2 h-44 w-full translate-y-12 scale-x-150 bg-[var(--color-bg)] blur-2xl" />
        <div className="absolute top-1/2 z-50 h-44 w-full bg-transparent opacity-10 backdrop-blur-md" />
        <div
          className="absolute inset-auto z-50 h-32 w-[24rem] -translate-y-1/2 rounded-full opacity-50 blur-3xl"
          style={{
            background:
              "radial-gradient(closest-side, rgba(167,139,250,0.6), transparent)",
          }}
        />
        <motion.div
          initial={{ width: "8rem" }}
          whileInView={{ width: "16rem" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-auto z-30 h-32 -translate-y-[6rem] rounded-full bg-gradient-to-r from-cyan-300 via-violet-300 to-pink-300 opacity-40 blur-2xl"
        />
        <motion.div
          initial={{ width: "12rem" }}
          whileInView={{ width: "24rem" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-auto z-50 h-1 -translate-y-[7rem] bg-gradient-to-r from-cyan-300 via-violet-300 to-pink-300"
        />
        <div className="absolute inset-auto z-40 h-44 w-full -translate-y-[12.5rem] bg-[var(--color-bg)]" />
      </div>
      <div className="relative z-50 flex -translate-y-32 flex-col items-center px-5 md:-translate-y-40">
        {children}
      </div>
    </div>
  );
}
