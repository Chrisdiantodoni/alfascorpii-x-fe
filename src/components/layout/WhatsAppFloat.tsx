import type { ContactSettings } from "#/types";
import { AnimatePresence, motion } from "motion/react";
import { useState, useEffect } from "react";

interface WhatsAppFloatProps {
  contact: ContactSettings;
}

export default function WhatsAppFloat({ contact }: WhatsAppFloatProps) {
  const [isOpen, setIsOpen] = useState(false);

  const rawNumber = contact?.social_media?.whatsapp ?? "";
  const cleanNumber = rawNumber.replace(/\D/g, "");
  const waUrl = cleanNumber ? `https://wa.me/${cleanNumber}` : "#";

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isOpen && !target.closest(".whatsapp-float")) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isOpen]);

  // Format WhatsApp number for display
  const formatPhoneNumber = (number: string) => {
    if (!number) return "";
    const clean = number.replace(/\D/g, "");
    if (clean.startsWith("62")) {
      return `+${clean.slice(0, 3)} ${clean.slice(3, 6)}-${clean.slice(6, 10)}-${clean.slice(10, 14)}`;
    }
    return number;
  };

  if (!cleanNumber) return null;

  return (
    <div className="whatsapp-float fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* Tooltip Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: 20 }}
            transition={{ duration: 0.2 }}
            className="mb-3 bg-white dark:bg-ink border border-line shadow-2xl rounded-xl px-5 py-4 min-w-[240px] max-w-[280px]"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#25D366]" />
              </span>
              <span className="text-[11px] font-bold tracking-wider text-ink dark:text-paper">
                ADMIN ALFA SCORPII
              </span>
            </div>

            <p className="text-[12px] text-ash dark:text-paper-dim mb-3 flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#25D366]" />
              Online · Balas &lt; 5 menit
            </p>

            {cleanNumber && (
              <p className="text-[11px] text-ash dark:text-paper-dim mb-3 font-mono">
                {formatPhoneNumber(rawNumber)}
              </p>
            )}

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center bg-[#25D366] text-white py-2.5 px-4 rounded-lg text-[11px] font-bold tracking-wider hover:bg-[#1ebe5c] focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 dark:focus:ring-offset-ink transition-all outline-none"
            >
              MULAI CHAT
            </a>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute -top-2 -right-2 w-6 h-6 bg-ink dark:bg-paper text-paper dark:text-ink rounded-full flex items-center justify-center text-xs hover:scale-110 transition-transform shadow-md"
              aria-label="Tutup"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-11 h-11 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl hover:shadow-[#25D366]/30 focus-visible:ring-4 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-ink transition-all duration-300 outline-none group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label={isOpen ? "Tutup WhatsApp" : "Hubungi via WhatsApp"}
        aria-expanded={isOpen}
      >
        <motion.svg
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="w-5 h-5 fill-current"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-hidden="true"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </motion.svg>
      </motion.button>
    </div>
  );
}
