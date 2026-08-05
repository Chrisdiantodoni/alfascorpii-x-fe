import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "#/components/ui/Button";
import { TextInput } from "#/components/ui/TextInput";
import { signUp } from "#/lib/auth-client";

export const Route = createFileRoute("/_public/signup/")({
	component: Signup,
});

function Signup() {
	const navigate = useNavigate();
	const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(
		null,
	);
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

			<button
				type="button"
				onClick={handleGoogle}
				className="flex items-center justify-center gap-3 w-full p-[13px] border border-line text-[14px] font-semibold text-ink bg-white hover:border-ink hover:bg-paper-dim transition-colors"
			>
				<svg
					width="18"
					height="18"
					viewBox="0 0 48 48"
					role="img"
					aria-label="Google"
				>
					<path
						fill="#FFC107"
						d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
					/>
					<path
						fill="#FF3D00"
						d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"
					/>
					<path
						fill="#4CAF50"
						d="M24 44c5.4 0 10.3-2.1 14-5.5l-6.5-5.5C29.4 34.9 26.8 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.6 5.1C9.5 39.6 16.2 44 24 44z"
					/>
					<path
						fill="#1976D2"
						d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6.5 5.5C40.5 36.7 44 30.9 44 24c0-1.3-.1-2.7-.4-3.5z"
					/>
				</svg>
				Daftar dengan Google
			</button>

			<div className="flex items-center gap-[14px] my-[26px] text-[#9CA3AF] text-[11px] tracking-[.1em]">
				<span className="flex-1 h-px bg-line" />
				<span>ATAU</span>
				<span className="flex-1 h-px bg-line" />
			</div>

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
					Saya menyetujui Syarat &amp; Ketentuan serta Kebijakan Privasi.
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
		</section>
	);
}
