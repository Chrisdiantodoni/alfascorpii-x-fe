// #/components/PageNotFound.tsx
import { Link } from "@tanstack/react-router";

export function PageNotFound() {
  return (
    <section className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <span className="text-[12px] tracking-[0.25em] text-blue-bright font-semibold mb-4">
        404
      </span>
      <h1 className="font-head font-black leading-[0.88] tracking-tighter text-[clamp(2.75rem,10vw,6rem)]">
        Halaman Tidak Ditemukan
      </h1>
      <p className="text-[17px] md:text-[20px] text-ash max-w-lg mt-6">
        Halaman yang kamu cari tidak ada atau sudah dipindahkan.
      </p>
      <Link
        to="/"
        className="inline-block mt-10 text-[12px] font-semibold tracking-widest border-b border-ink pb-1 hover:text-blue transition-colors"
      >
        Kembali ke Beranda →
      </Link>
    </section>
  );
}
