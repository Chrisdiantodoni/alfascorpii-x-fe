import { useTheme } from "#/hooks/useTheme";

export function ThemeToggle() {
	const { theme, setTheme } = useTheme();

	return (
		<div className="flex items-center gap-5">
			<span className="text-[12px] tracking-widest text-white/40">
				TAMPILAN
			</span>
			<div className="flex border border-white/30 overflow-hidden">
				<button
					type="button"
					onClick={() => setTheme("light")}
					className={`px-[10px] py-[6px] text-[10px] tracking-[.12em] font-semibold transition-colors ${
						theme === "light"
							? "bg-white text-[#0A0A0C]"
							: "bg-transparent text-white/70 hover:bg-white/20 hover:text-white"
					}`}
				>
					TERANG
				</button>
				<button
					type="button"
					onClick={() => setTheme("dark")}
					className={`px-[10px] py-[6px] text-[10px] tracking-[.12em] font-semibold transition-colors ${
						theme === "dark"
							? "bg-white"
							: "bg-transparent text-white/70 hover:bg-white/20 hover:text-white"
					}`}
				>
					GELAP
				</button>
			</div>
		</div>
	);
}
