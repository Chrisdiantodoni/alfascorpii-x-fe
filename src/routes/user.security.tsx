// owned by: italfa:staff
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "#/components/ui/Button";
import { TextInput } from "#/components/ui/TextInput";
import { authClient, useSession } from "#/lib/auth-client";

export const Route = createFileRoute("/user/security")({
	component: UserSecurity,
});

type SessionInfo = {
	id: string;
	token: string;
	userAgent?: string | null;
	ipAddress?: string | null;
	createdAt?: Date | string;
	expiresAt?: Date | string;
};

function UserSecurity() {
	const navigate = useNavigate();
	const { data: session } = useSession();

	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [pwStatus, setPwStatus] = useState<{
		ok: boolean;
		text: string;
	} | null>(null);
	const [pwLoading, setPwLoading] = useState(false);

	const [sessions, setSessions] = useState<SessionInfo[]>([]);
	const [sessionsError, setSessionsError] = useState<string | null>(null);

	const [deletePassword, setDeletePassword] = useState("");
	const [deleteStatus, setDeleteStatus] = useState<{
		ok: boolean;
		text: string;
	} | null>(null);
	const [deleteLoading, setDeleteLoading] = useState(false);

	useEffect(() => {
		authClient
			.listSessions()
			.then((res) => {
				if (res.error) {
					setSessionsError(res.error.message ?? "Gagal memuat sesi.");
					return;
				}
				setSessions(res.data ?? []);
			})
			.catch(() => setSessionsError("Gagal memuat sesi."));
	}, []);

	const handleChangePassword = async (e: React.FormEvent) => {
		e.preventDefault();
		if (newPassword.length < 8) {
			setPwStatus({
				ok: false,
				text: "Kata sandi baru minimal 8 karakter.",
			});
			return;
		}
		if (newPassword !== confirmPassword) {
			setPwStatus({ ok: false, text: "Konfirmasi kata sandi tidak cocok." });
			return;
		}

		setPwStatus(null);
		setPwLoading(true);
		const { error } = await authClient.changePassword({
			currentPassword,
			newPassword,
			revokeOtherSessions: true,
		});
		setPwLoading(false);

		if (error) {
			setPwStatus({
				ok: false,
				text:
					error.message === "Invalid password"
						? "Kata sandi saat ini salah."
						: error.message,
			});
			return;
		}
		setPwStatus({ ok: true, text: "Kata sandi berhasil diganti." });
		setCurrentPassword("");
		setNewPassword("");
		setConfirmPassword("");
	};

	const handleRevoke = async (token: string) => {
		await authClient.revokeSession({ token });
		const res = await authClient.listSessions();
		if (!res.error) setSessions(res.data ?? []);
	};

	const handleDelete = async (e: React.FormEvent) => {
		e.preventDefault();
		setDeleteStatus(null);
		setDeleteLoading(true);
		const { error } = await authClient.deleteUser({
			password: deletePassword,
		});
		setDeleteLoading(false);

		if (error) {
			setDeleteStatus({
				ok: false,
				text: error.message ?? "Gagal menghapus akun.",
			});
			return;
		}
		await navigate({ to: "/" });
	};

	const formatDate = (value?: Date | string) =>
		value
			? new Date(value).toLocaleDateString("id-ID", {
					day: "numeric",
					month: "short",
					year: "numeric",
				})
			: "-";

	return (
		<div className="space-y-10">
			<div>
				<span className="text-[12px] tracking-[0.25em] text-blue-bright font-semibold mb-2 block">
					AKUN SAYA
				</span>
				<h1 className="font-head font-black text-3xl md:text-4xl tracking-tight text-ink">
					Keamanan
				</h1>
			</div>

			<section className="max-w-lg">
				<h2 className="font-head font-bold text-lg text-ink mb-4">
					Ganti Kata Sandi
				</h2>
				<form
					onSubmit={handleChangePassword}
					className="border border-line bg-paper-dim p-6 md:p-8 flex flex-col gap-6"
				>
					<TextInput
						label="KATA SANDI SAAT INI"
						name="currentPassword"
						type="password"
						required
						value={currentPassword}
						onChange={(e) => setCurrentPassword(e.target.value)}
						placeholder="••••••••"
					/>
					<TextInput
						label="KATA SANDI BARU"
						name="newPassword"
						type="password"
						required
						minLength={8}
						value={newPassword}
						onChange={(e) => setNewPassword(e.target.value)}
						placeholder="Minimal 8 karakter"
					/>
					<TextInput
						label="KONFIRMASI KATA SANDI BARU"
						name="confirmPassword"
						type="password"
						required
						minLength={8}
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						placeholder="Ulangi kata sandi baru"
					/>
					<div className="pt-2">
						<Button type="submit" disabled={pwLoading}>
							{pwLoading ? "MEMPROSES..." : "GANTI KATA SANDI"}
						</Button>
					</div>
					{pwStatus && (
						<p
							className={`text-[13px] ${pwStatus.ok ? "text-green-600" : "text-red-600"}`}
						>
							{pwStatus.text}
						</p>
					)}
				</form>
			</section>

			<section>
				<h2 className="font-head font-bold text-lg text-ink mb-4">
					Sesi Aktif
				</h2>
				{sessionsError && (
					<p className="text-[13px] text-red-600 mb-4">{sessionsError}</p>
				)}
				<div className="border border-line divide-y divide-line bg-paper-dim">
					{sessions.length === 0 && !sessionsError && (
						<p className="p-6 text-[13px] text-ash">Memuat sesi...</p>
					)}
					{sessions.map((s) => {
						const isCurrent = session?.session.token === s.token;
						return (
							<div
								key={s.id}
								className="p-5 flex items-center justify-between gap-4"
							>
								<div className="min-w-0">
									<p className="text-[13px] font-semibold text-ink flex items-center gap-2 flex-wrap">
										{s.userAgent || "Perangkat tidak dikenal"}
										{isCurrent && (
											<span className="text-[10px] font-bold tracking-widest text-blue-bright uppercase border border-blue-bright/40 px-1.5 py-0.5">
												Sesi ini
											</span>
										)}
									</p>
									<p className="text-[12px] text-ash mt-0.5">
										{s.ipAddress || "-"} &middot; Masuk{" "}
										{formatDate(s.createdAt)}
									</p>
								</div>
								{!isCurrent && (
									<Button variant="pill" onClick={() => handleRevoke(s.token)}>
										CABUT
									</Button>
								)}
							</div>
						);
					})}
				</div>
			</section>

			<section className="max-w-lg">
				<h2 className="font-head font-bold text-lg text-ink mb-4 text-red-600">
					Zona Berbahaya
				</h2>
				<form
					onSubmit={handleDelete}
					className="border border-red-200 bg-red-50/50 p-6 md:p-8 flex flex-col gap-6"
				>
					<p className="text-[13px] text-ash leading-relaxed">
						Menghapus akun akan menghapus seluruh data kamu secara permanen,
						termasuk daftar favorit. Tindakan ini tidak dapat dibatalkan.
					</p>
					<TextInput
						label="KONFIRMASI DENGAN KATA SANDI"
						name="deletePassword"
						type="password"
						required
						value={deletePassword}
						onChange={(e) => setDeletePassword(e.target.value)}
						placeholder="••••••••"
					/>
					<div className="pt-2">
						<Button
							type="submit"
							disabled={deleteLoading}
							className="!border-red-600 !text-red-600 hover:!bg-red-600 hover:!text-white"
						>
							{deleteLoading ? "MEMPROSES..." : "HAPUS AKUN"}
						</Button>
					</div>
					{deleteStatus && (
						<p
							className={`text-[13px] ${deleteStatus.ok ? "text-green-600" : "text-red-600"}`}
						>
							{deleteStatus.text}
						</p>
					)}
				</form>
			</section>
		</div>
	);
}
