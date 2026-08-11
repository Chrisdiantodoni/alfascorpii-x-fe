import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "#/components/ui/Button";
import { TextInput } from "#/components/ui/TextInput";
import { signUp } from "#/lib/auth-client";
import { getSiteSettings } from "#/server/master";
import { Modal } from "#/components/ui/Modal"; // Import Modal Reusable
import { MarkdownPreview } from "#/components/ui/MarkdownPreview";

export const Route = createFileRoute("/_public/signup/")({
  component: Signup,
  loader: async () => {
    const res = await getSiteSettings({
      data: {
        key: "privacy-policy",
      },
    });
    return { res };
  },
});

function Signup() {
  const { res } = Route.useLoaderData();
  const navigate = useNavigate();

  // State untuk mengontrol Modal Privacy Policy
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  const [status, setStatus] = useState<{
    ok: boolean;
    text: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGoogle = () => {
    alert(
      '"Daftar dengan Google" akan aktif setelah terhubung ke Google OAuth di backend. Ini masih tampilan contoh.',
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const name = String(formData.get("name") ?? "");
    const email = String(formData.get("email") ?? "");
    const whatsapp = String(formData.get("whatsapp") ?? "");
    const password = String(formData.get("password") ?? "");

    setStatus(null);
    setLoading(true);
    const { error } = await signUp.email({ name, email, password, whatsapp });
    setLoading(false);

    if (error) {
      setStatus({
        ok: false,
        text:
          error.message === "Email is not valid"
            ? "Format email tidak valid."
            : error.message,
      });
      return;
    }

    await navigate({ to: "/user" });
  };

  return (
    <section className="min-h-[85vh] flex flex-col justify-center max-w-md mx-auto w-full pt-28 md:pt-32">
      <span className="text-[12px] tracking-[0.25em] text-blue-bright font-semibold mb-4">
        BERGABUNG DENGAN KAMI
      </span>

      <h1 className="font-head font-black text-4xl md:text-5xl tracking-tight mb-10">
        Buat Akun
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
        <TextInput
          label="NAMA LENGKAP"
          name="name"
          type="text"
          required
          placeholder="Nama Anda"
        />
        <TextInput
          label="EMAIL"
          name="email"
          type="email"
          required
          placeholder="nama@email.com"
        />
        <TextInput
          label="NO. WHATSAPP"
          name="whatsapp"
          type="tel"
          required
          placeholder="08xxxxxxxxxx"
        />
        <TextInput
          label="KATA SANDI"
          name="password"
          type="password"
          required
          placeholder="Minimal 8 karakter"
          minLength={8}
        />
        <label className="flex items-start gap-2 text-[12px] text-ash">
          <input type="checkbox" required className="accent-blue mt-0.5" />
          <span>
            Saya menyetujui Syarat &amp; Ketentuan serta{" "}
            <button
              type="button"
              onClick={() => setIsPrivacyModalOpen(true)}
              className="text-blue underline font-semibold hover:text-blue-bright transition-colors"
            >
              Kebijakan Privasi
            </button>
            .
          </span>
        </label>
        <Button type="submit" disabled={loading}>
          {loading ? "MEMPROSES..." : "DAFTAR AKUN"}
        </Button>
        {status && (
          <p
            className={`text-[13px] ${status.ok ? "text-green-600" : "text-red-600"}`}
          >
            {status.text}
          </p>
        )}
      </form>

      <p className="text-[13px] text-ash my-10">
        Sudah punya akun?{" "}
        <Link to="/login" className="text-blue hover:underline font-semibold">
          Masuk di sini
        </Link>
      </p>

      {/* Modal Reusable untuk Privacy Policy */}
      <Modal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        title="Kebijakan Privasi"
        maxWidth="max-w-2xl"
      >
        <div className="max-h-[60vh] overflow-y-auto pr-2">
          {res?.settings ? (
            <MarkdownPreview content={res.settings} />
          ) : (
            <p className="text-sm text-gray-500 italic">
              Kebijakan privasi belum tersedia.
            </p>
          )}
        </div>
      </Modal>
    </section>
  );
}
