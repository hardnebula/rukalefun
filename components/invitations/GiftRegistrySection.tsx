"use client";

import { motion } from "framer-motion";
import { Gift, Link as LinkIcon, Bank } from "@phosphor-icons/react";

interface GiftLink {
  name: string;
  url?: string;
  description?: string;
}

interface GiftRegistrySectionProps {
  title?: string;
  message?: string;
  links: GiftLink[];
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
}

export default function GiftRegistrySection({
  title = "Mesa de Regalos",
  message,
  links,
  colors,
}: GiftRegistrySectionProps) {
  if (!links || links.length === 0) {
    return null;
  }

  const getIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("transfer") || lowerName.includes("banco") || lowerName.includes("cuenta")) {
      return <Bank size={28} weight="light" />;
    }
    return <Gift size={28} weight="light" />;
  };

  return (
    <section
      className="py-16 px-4"
      style={{ backgroundColor: colors.background }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-10">
          {/* Decorative line */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12" style={{ backgroundColor: `${colors.primary}40` }} />
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${colors.secondary}25` }}
            >
              <Gift size={28} weight="light" color={colors.primary} />
            </div>
            <div className="h-px w-12" style={{ backgroundColor: `${colors.primary}40` }} />
          </div>

          <h2
            className="font-script text-3xl sm:text-4xl mb-4"
            style={{ color: colors.text }}
          >
            {title}
          </h2>

          {message && (
            <p
              className="text-sm max-w-md mx-auto"
              style={{ color: colors.text, opacity: 0.8 }}
            >
              {message}
            </p>
          )}
        </div>

        {/* Gift Links */}
        <div className="grid gap-4 sm:grid-cols-2">
          {links.map((link, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              {link.url ? (
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-6 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group"
                  style={{
                    backgroundColor: `${colors.secondary}15`,
                    border: `1px solid ${colors.secondary}40`,
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                      style={{
                        backgroundColor: `${colors.secondary}30`,
                        color: colors.primary,
                      }}
                    >
                      {getIcon(link.name)}
                    </div>
                    <div className="flex-1">
                      <h3
                        className="font-medium text-lg mb-1 flex items-center gap-2"
                        style={{ color: colors.text }}
                      >
                        {link.name}
                        <LinkIcon
                          size={16}
                          weight="bold"
                          className="opacity-50 group-hover:opacity-100 transition-opacity"
                        />
                      </h3>
                      {link.description && (
                        <p
                          className="text-sm"
                          style={{ color: colors.text, opacity: 0.7 }}
                        >
                          {link.description}
                        </p>
                      )}
                      <span
                        className="text-xs mt-2 inline-block"
                        style={{ color: colors.primary }}
                      >
                        Visitar tienda →
                      </span>
                    </div>
                  </div>
                </a>
              ) : (
                <div
                  className="p-6 rounded-xl"
                  style={{
                    backgroundColor: `${colors.secondary}15`,
                    border: `1px solid ${colors.secondary}40`,
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: `${colors.secondary}30`,
                        color: colors.primary,
                      }}
                    >
                      {getIcon(link.name)}
                    </div>
                    <div className="flex-1">
                      <h3
                        className="font-medium text-lg mb-1"
                        style={{ color: colors.text }}
                      >
                        {link.name}
                      </h3>
                      {link.description && (
                        <p
                          className="text-sm whitespace-pre-line"
                          style={{ color: colors.text, opacity: 0.7 }}
                        >
                          {link.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Decorative bottom */}
        <div className="flex items-center justify-center gap-3 mt-10">
          <div className="h-px w-16" style={{ backgroundColor: `${colors.primary}40` }} />
          <div
            className="w-2 h-2 rotate-45"
            style={{ backgroundColor: colors.secondary }}
          />
          <div className="h-px w-16" style={{ backgroundColor: `${colors.primary}40` }} />
        </div>
      </motion.div>
    </section>
  );
}
