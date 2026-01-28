"use client";

import { Prompt } from "@/context/chatContext";
import { cn } from "@/utils/cn";
import { PromptIcon } from "@/utils/prompt-icon";
import { motion } from "framer-motion";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";

interface PromptsCarouselProps {
  prompts: Prompt[];
  onSelectPrompt: (prompt: Prompt) => void;
  selectedPromptId?: string;
}

export function PromptsCarousel({
  prompts,
  onSelectPrompt,
  selectedPromptId,
}: PromptsCarouselProps) {
  if (prompts.length === 0) {
    return null;
  }

  const styles = {
    iconGradient: "bg-gradient-to-r from-neutral-500 to-neutral-900",
    border: "border-gray-500",
  };

  return (
    <div className="w-full">
      <Swiper
        spaceBetween={16}
        slidesPerView="auto"
        className="!px-0"
        breakpoints={{
          320: {
            slidesPerView: 1.1,
            spaceBetween: 12,
          },
          640: {
            slidesPerView: 2,
            spaceBetween: 16,
          },
          1024: {
            slidesPerView: 2.5,
            spaceBetween: 16,
          },
          1280: {
            slidesPerView: 3,
            spaceBetween: 16,
          },
        }}
      >
        {prompts.map((prompt, index) => (
          <SwiperSlide key={prompt.id} className="!w-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
              onClick={() => onSelectPrompt(prompt)}
              className={cn(
                "group relative cursor-pointer overflow-hidden rounded-xl border bg-white px-3 py-2 shadow-sm transition-all duration-300 hover:shadow-md hover:shadow-black/5 min-w-[240px]",
                selectedPromptId === prompt.id
                  ? "border-gray-600 bg-gray-50"
                  : styles.border,
              )}
            >
              {/* Background decoration - Removido para visual mais minimalista */}

              <div className="relative flex items-center gap-2.5">
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-300 group-hover:scale-105",
                    selectedPromptId === prompt.id
                      ? "bg-gray-600"
                      : styles.iconGradient,
                  )}
                >
                  <PromptIcon
                    icon={prompt.icon}
                    className="text-white"
                    size={16}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3
                    className={cn(
                      "text-sm leading-tight font-medium truncate",
                      selectedPromptId === prompt.id
                        ? "text-gray-900"
                        : "text-gray-800",
                    )}
                  >
                    {prompt.name}
                  </h3>
                </div>
              </div>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
