"use client";

import { motion } from "framer-motion";

type Item = {
  title: string;
  body: string;
};

export function StickyScrollReveal({
  items,
  rightSlot,
}: {
  items: readonly Item[];
  rightSlot?: React.ReactNode;
}) {
  return (
    <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
      <div className="flex flex-col gap-12">
        {items.map((it, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0.001, y: 24, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{
              duration: 0.6,
              delay: i * 0.05,
              ease: [0.2, 0.6, 0.2, 1],
            }}
          >
            {it.title ? (
              <p className="font-mono text-xs uppercase tracking-wider text-[var(--color-fg-subtle)]">
                {it.title}
              </p>
            ) : null}
            <p
              className={`text-lg leading-relaxed text-[var(--color-fg-muted)] md:text-xl ${
                it.title ? "mt-3" : ""
              }`}
            >
              {it.body}
            </p>
          </motion.div>
        ))}
      </div>
      {rightSlot ? (
        <div className="hidden lg:block">
          <div className="sticky top-24">{rightSlot}</div>
        </div>
      ) : null}
    </div>
  );
}
