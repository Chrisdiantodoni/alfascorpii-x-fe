// components/ui/PageHeader.tsx
import { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";

interface PageHeaderProps {
  /** Label di atas judul (contoh: "Wishlist", "Profil") */
  label: string;
  /** Judul utama halaman */
  title: string;
  /** Subtitle/deskripsi di bawah judul */
  subtitle?: string | ReactNode;
  /** Elemen di sisi kanan header (tombol aksi, dll) */
  action?: ReactNode;
  /** Tambahan class untuk container */
  className?: string;
  /** Tampilkan breadcrumb/back button */
  showBack?: boolean;
  /** URL untuk back button */
  backTo?: string;
  /** Label untuk back button */
  backLabel?: string;
  /** Variasi ukuran (default: 'default') */
  size?: "default" | "small" | "large";
}

const sizeStyles = {
  small: {
    label: "text-[10px]",
    title: "text-2xl md:text-3xl",
    subtitle: "text-[12px]",
  },
  default: {
    label: "text-[11px]",
    title: "text-3xl md:text-4xl",
    subtitle: "text-[13px]",
  },
  large: {
    label: "text-[12px]",
    title: "text-4xl md:text-5xl",
    subtitle: "text-[14px]",
  },
};

export function PageHeader({
  label,
  title,
  subtitle,
  action,
  className = "",
  showBack = false,
  backTo = "/user",
  backLabel = "Kembali",
  size = "default",
}: PageHeaderProps) {
  const styles = sizeStyles[size];

  return (
    <div
      className={`flex flex-col md:flex-row md:items-end md:justify-between gap-4 ${className}`}
    >
      {/* Left Side */}
      <div className="flex-1 min-w-0">
        {/* Back Button */}
        {showBack && backTo && (
          <Link
            to={backTo}
            className="inline-flex items-center gap-1.5 text-[12px] text-ash/70 hover:text-ink transition-colors mb-2 group"
          >
            <ChevronLeft
              size={14}
              className="group-hover:-translate-x-0.5 transition-transform"
            />
            {backLabel}
          </Link>
        )}

        {/* Label */}
        <span
          className={`${styles.label} tracking-[0.3em] text-blue-bright font-semibold uppercase block mb-1.5`}
        >
          {label}
        </span>

        {/* Title */}
        <h1
          className={`font-head font-black ${styles.title} tracking-tight text-ink`}
        >
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <div className={`${styles.subtitle} text-ash mt-2`}>{subtitle}</div>
        )}
      </div>

      {/* Right Side - Action */}
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
