"use client";

import { motion } from "framer-motion";

export function Placeholder({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white/50 px-6 py-14 text-center backdrop-blur-sm"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-900 to-gray-700 text-white shadow-lg">
        {icon}
      </div>
      <h3 className="mt-5 text-base font-semibold text-gray-900">{title}</h3>
      <p className="mt-1.5 max-w-md text-sm leading-relaxed text-gray-500">
        {description}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </motion.div>
  );
}
