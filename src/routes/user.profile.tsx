// owned by: italfa:staff
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "#/components/ui/Button";
import { TextInput } from "#/components/ui/TextInput";
import { authClient } from "#/lib/auth-client";
import { useUserSession } from "./user";

export const Route = createFileRoute("/user/profile")({
	component: UserProfile,
});

function UserProfile() {
	const session = useUserSession();
	const [name, setName] = useState(session?.user.name ?? "");
	const [whatsapp, setWhatsapp] = useState(session?.user.whatsapp ?? "");
	const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(
		null,
	);
	const [loading, setLoading] = useState(false);

	if (!session) return null;
	const user = session.user;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setStatus(null);
		setLoading(true);
		const { error } = await authClient.updateUser({
			name,
			whatsapp,
		});
		setLoading(false);

		if (error) {
			setStatus({ ok: false, text: error.message ?? "Gagal menyimpan." });
			return;
		}
		setStatus({ ok: true, text: "Profil berhasil diperbarui." });
	};

	return (
		<div className="space-y-8">
			<div>
				<span className="text-[12px] tracking-[0.25em] text-blue-bright font-semibold mb-2 block">
					AKUN SAYA
				</span>
				<h1 className="font-head font-black text-3xl md:text-4xl tracking-tight text-ink">
					Profil
				</h1>
			</div>

			<form
				onSubmit={handleSubmit}
				className="border border-line bg-paper-dim p-6 md:p-8 flex flex-col gap-6 max-w-lg"
			>
				<TextInput
					label="NAMA LENGKAP"
					name="name"
					type="text"
					required
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder="Nama Anda"
				/>
				<TextInput
					label="EMAIL"
					name="email"
					type="email"
					value={user.email}
					disabled
				/>
				<TextInput
					label="NO. WHATSAPP"
					name="whatsapp"
					type="tel"
					value={whatsapp}
					onChange={(e) => setWhatsapp(e.target.value)}
					placeholder="08xxxxxxxxxx"
					optional
				/>
				<div className="pt-2">
					<Button type="submit" disabled={loading}>
						{loading ? "MENYIMPAN..." : "SIMPAN PERUBAHAN"}
					</Button>
				</div>
				{status && (
					<p
						className={`text-[13px] ${status.ok ? "text-green-600" : "text-red-600"}`}
					>
						{status.text}
					</p>
				)}
			</form>
		</div>
	);
}
