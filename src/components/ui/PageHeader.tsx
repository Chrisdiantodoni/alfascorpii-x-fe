import React from "react";

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  badgeAccent?: boolean; // Tampilkan pill badge atau text biasa
}

export default function PageHeader({
  title,
  subtitle,
  description,
  align = "left",
  className = "",
  badgeAccent = false,
}: PageHeaderProps) {
  const isCenter = align === "center";

  return (
    <section
      className={`relative flex flex-col justify-center overflow-hidden py-12 pt-32 ${
        isCenter ? "items-center text-center" : "items-start text-left"
      } ${className}`}
    >
      <div
        className={`relative z-10 flex w-full max-w-4xl flex-col ${isCenter ? "items-center" : "items-start"}`}
      >
        {/* 1. SUBTITLE / OVERLINE */}
        {subtitle &&
          (badgeAccent ? (
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-current/15 bg-current/5 px-3.5 py-1 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
              <span className="text-[11px] md:text-[12px] font-bold tracking-[0.2em] uppercase">
                {subtitle}
              </span>
            </div>
          ) : (
            <span className="mb-4 text-[12px] tracking-[0.25em] font-bold tracking-[0.25em] text-blue-bright uppercase">
              {subtitle}
              {/*<span className="text-[12px] tracking-[0.25em] text-blue-bright font-semibold mb-6">*/}
            </span>
          ))}

        {/* 2. TITLE */}
        <h1 className="font-head uppercase text-[clamp(2.25rem,6vw,4.75rem)] font-black tracking-tight leading-[1.05] text-balance">
          {title}
        </h1>

        {/* 3. DESCRIPTION */}
        {description && (
          <p className="mt-5 max-w-2xl text-[15px] md:text-[18px] leading-relaxed opacity-80 text-pretty">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
