import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper/types";
import { Image } from "#/components/ui/Image";
import { MaterialIcon } from "#/components/ui/MaterialIcon";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface GalleryImage {
  id: string;
  url: string;
}

interface ProductGalleryProps {
  files: Array<{ id?: string; url: string | null; role: string }>;
  productName: string;
}

function prepareImages(files: ProductGalleryProps["files"]): GalleryImage[] {
  const valid = files.filter(
    (f): f is { id?: string; url: string; role: string } => Boolean(f.url),
  );

  const thumbnails = valid.filter((f) => f.role === "thumbnail");
  const gallery = valid.filter((f) => f.role === "gallery");

  return [...thumbnails, ...gallery].map((f, index) => ({
    id: f.id || `${f.url}-${index}`,
    url: f.url,
  }));
}

export function ProductGallery({ files, productName }: ProductGalleryProps) {
  const images = useMemo(() => prepareImages(files), [files]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  const handleSelectImage = useCallback(
    (index: number) => {
      setActiveIndex(index);
      if (swiperInstance) {
        swiperInstance.slideTo(index);
      }
    },
    [swiperInstance],
  );

  if (images.length === 0) {
    return (
      <div className="aspect-square bg-paper-dim rounded-md flex items-center justify-center">
        <MaterialIcon
          name="collections"
          className="!text-[64px] text-blue/20"
        />
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <>
        <div className="aspect-square bg-paper-dim rounded-md relative group overflow-hidden">
          <Image
            src={images[0].url}
            alt={productName}
            width={800}
            height={800}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <button
            type="button"
            onClick={() => openLightbox(0)}
            className="absolute bottom-3 right-3 z-10 p-2.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
            aria-label="Lihat gambar fullscreen"
          >
            <MaterialIcon name="visibility" className="!text-[16px]" />
          </button>
        </div>
        <ImageLightbox
          images={images}
          initialIndex={0}
          open={lightboxIndex !== null}
          onClose={closeLightbox}
        />
      </>
    );
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Gambar Utama (Posisi Atas) */}
      <div className="order-1 aspect-square bg-paper-dim rounded-md relative group overflow-hidden w-full min-w-0">
        <Swiper
          modules={[Navigation, Pagination]}
          onSwiper={setSwiperInstance}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          navigation={{
            nextEl: ".gallery-next",
            prevEl: ".gallery-prev",
          }}
          pagination={{
            clickable: true,
            el: ".gallery-pagination",
          }}
          className="h-full w-full"
        >
          {images.map((img, i) => (
            <SwiperSlide key={img.id}>
              <div
                className="w-full h-full cursor-pointer"
                onClick={() => openLightbox(i)}
              >
                <Image
                  src={img.url}
                  alt={`${productName} ${i + 1}`}
                  width={800}
                  height={800}
                  className="w-full h-full object-cover"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation Buttons */}
        <button
          type="button"
          className="gallery-prev absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/85 hover:bg-white shadow-md flex items-center justify-center text-ink transition-all duration-200 opacity-0 group-hover:opacity-100 cursor-pointer disabled:opacity-0 pointer-events-auto"
          aria-label="Gambar sebelumnya"
        >
          <MaterialIcon name="chevron_left" className="!text-[18px]" />
        </button>
        <button
          type="button"
          className="gallery-next absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/85 hover:bg-white shadow-md flex items-center justify-center text-ink transition-all duration-200 opacity-0 group-hover:opacity-100 cursor-pointer disabled:opacity-0 pointer-events-auto"
          aria-label="Gambar berikutnya"
        >
          <MaterialIcon name="chevron_right" className="!text-[18px]" />
        </button>

        {/* Dots hanya di layar kecil jika diperlukan */}
        <div className="gallery-pagination !bottom-3 z-10 md:hidden" />

        <button
          type="button"
          onClick={() => openLightbox(activeIndex)}
          className="absolute bottom-3 right-3 z-10 p-2.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
          aria-label="Lihat gambar fullscreen"
        >
          <MaterialIcon name="visibility" className="!text-[16px]" />
        </button>
      </div>

      {/* Thumbnail Strip Horizontal (Posisi Bawah) */}
      <div className="order-2 flex items-center gap-2.5 overflow-x-auto no-scrollbar p-1.5 -m-1.5 w-[calc(100%+0.75rem)]">
        {images.map((img, i) => {
          const isActive = activeIndex === i;
          return (
            <button
              key={img.id}
              type="button"
              onClick={() => handleSelectImage(i)}
              className={`relative shrink-0 w-16 h-16 rounded-md overflow-hidden transition-all duration-200 cursor-pointer ${
                isActive
                  ? "ring-2 ring-blue ring-offset-1 scale-105 shadow-sm z-10"
                  : "ring-1 ring-black/5 opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={img.url}
                alt={`${productName} thumbnail ${i + 1}`}
                width={100}
                height={100}
                className="w-full h-full object-cover pointer-events-none"
              />
            </button>
          );
        })}
      </div>

      <ImageLightbox
        images={images}
        initialIndex={lightboxIndex ?? 0}
        open={lightboxIndex !== null}
        onClose={closeLightbox}
      />
    </div>
  );
}
interface ImageLightboxProps {
  images: GalleryImage[];
  initialIndex: number;
  open: boolean;
  onClose: () => void;
}

function ImageLightbox({
  images,
  initialIndex,
  open,
  onClose,
}: ImageLightboxProps) {
  const [current, setCurrent] = useState(initialIndex);

  useEffect(() => {
    if (open) {
      setCurrent(initialIndex);
    }
  }, [open, initialIndex]);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setCurrent((c) => (c - 1 + images.length) % images.length);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setCurrent((c) => (c + 1) % images.length);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, images.length, onClose]);

  const prev = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setCurrent((c) => (c - 1 + images.length) % images.length);
    },
    [images.length],
  );

  const next = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setCurrent((c) => (c + 1) % images.length);
    },
    [images.length],
  );

  // Jika hanya 1 gambar, langsung render tanpa navigasi
  if (images.length === 1) {
    return (
      <AnimatePresence>
        {open && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center"
            onClick={onClose}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
              aria-label="Tutup"
            >
              <MaterialIcon name="close" className="!text-[20px]" />
            </button>

            <div
              className="max-w-[90vw] max-h-[90vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[0].url}
                alt=""
                width={1200}
                height={1200}
                className="max-w-[90vw] max-h-[85vh] object-contain"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="lightbox"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center"
          onClick={onClose}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <MaterialIcon name="close" className="!text-[20px]" />
          </button>

          <span className="absolute top-5 left-1/2 -translate-x-1/2 text-white/60 text-[11px] tracking-widest font-semibold select-none">
            {current + 1} / {images.length}
          </span>

          <button
            type="button"
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
            aria-label="Gambar sebelumnya"
          >
            <MaterialIcon name="chevron_left" className="!text-[22px]" />
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
            aria-label="Gambar berikutnya"
          >
            <MaterialIcon name="chevron_right" className="!text-[22px]" />
          </button>

          <div
            className="max-w-[90vw] max-h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Image
                  src={images[current].url}
                  alt=""
                  width={1200}
                  height={1200}
                  className="max-w-[90vw] max-h-[85vh] object-contain"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
