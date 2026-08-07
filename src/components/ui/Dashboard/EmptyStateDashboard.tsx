// components/ui/EmptyState.tsx
import { Link } from "@tanstack/react-router";
import { ArrowRight, Heart, ShoppingBag, type LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface EmptyStateProps {
  /** Icon utama yang ditampilkan */
  icon?: LucideIcon;
  /** Warna icon (default: pink-400) */
  iconColor?: string;
  /** Background color untuk circle icon (default: pink-50) */
  iconBgColor?: string;
  /** Border color untuk circle icon (default: pink-100) */
  iconBorderColor?: string;
  /** Judul utama */
  title: string;
  /** Deskripsi pendukung, bisa string atau ReactNode */
  description: string | ReactNode;
  /** Teks tombol CTA */
  ctaText?: string;
  /** URL tujuan CTA */
  ctaTo?: string;
  /** Icon untuk CTA (default: ShoppingBag) */
  ctaIcon?: LucideIcon;
  /** Variant tombol (default: 'primary') */
  ctaVariant?: "primary" | "secondary" | "outline";
  /** ClassName tambahan untuk container */
  className?: string;
  /** Children tambahan di bawah CTA */
  children?: ReactNode;
}

const ctaVariantStyles = {
  primary:
    "bg-ink text-white hover:bg-ink/90 hover:shadow-lg hover:shadow-ink/10",
  secondary:
    "bg-blue-bright text-white hover:bg-blue-bright/90 hover:shadow-lg hover:shadow-blue-bright/10",
  outline:
    "border-2 border-ink text-ink hover:bg-ink hover:text-white transition-colors",
};

export function EmptyStateDashboard({
  icon: Icon = Heart,
  iconColor = "text-pink-400",
  iconBgColor = "bg-pink-50",
  iconBorderColor = "border-pink-100",
  title,
  description,
  ctaText = "Jelajahi Toko",
  ctaTo = "/store",
  ctaIcon: CtaIcon = ShoppingBag,
  ctaVariant = "primary",
  className = "",
  children,
}: EmptyStateProps) {
  return (
    <div
      className={`border-2 border-dashed border-line/60 bg-paper-dim/50 p-12 md:p-16 text-center rounded-lg ${className}`}
    >
      {/* Icon Container */}
      <div className="relative inline-block">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-200/30 to-red-200/30 blur-2xl -z-10" />
        <div
          className={`w-20 h-20 mx-auto rounded-full ${iconBgColor} flex items-center justify-center mb-5 border ${iconBorderColor}`}
        >
          <Icon size={32} className={iconColor} fill="currentColor" />
        </div>
      </div>

      {/* Title */}
      <h3 className="font-head font-bold text-xl text-ink mb-2">{title}</h3>

      {/* Description */}
      <div className="text-[14px] text-ash/80 max-w-sm mx-auto mb-8 leading-relaxed">
        {description}
      </div>

      {/* CTA Button */}
      {ctaTo && ctaText && (
        <Link
          resetScroll={false}

          to={ctaTo}
          className={`group inline-flex items-center gap-2.5 px-8 py-3.5 text-[13px] font-semibold tracking-wider transition-all rounded-full ${ctaVariantStyles[ctaVariant]}`}
        >
          <CtaIcon size={16} />
          {ctaText}
          <ArrowRight
            size={14}
            className="group-hover:translate-x-0.5 transition-transform"
          />
        </Link>
      )}

      {/* Additional Children */}
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}
