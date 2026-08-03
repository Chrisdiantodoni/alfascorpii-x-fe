import { useEffect, useState } from "react";
import { Button } from "./ui/Button";

export function ThemeToggle() {
	const [theme, setTheme] = useState<"light" | "dark">("dark");

	// Sync state dengan DOM / localStorage saat komponen di-mount
	useEffect(() => {
		const isDark = document.documentElement.classList.contains("dark");
		setTheme(isDark ? "dark" : "light");
	}, []);

	const changeTheme = (newTheme: "light" | "dark") => {
		setTheme(newTheme);
		localStorage.setItem("theme", newTheme);

		if (newTheme === "dark") {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	};

	return (
		<div className="flex items-center gap-5">
			<span className="text-[12px] tracking-widest text-white/40">
				TAMPILAN
			</span>
			<div className="flex border border-white/30 overflow-hidden">
				<button
					type="button"
					onClick={() => changeTheme("light")}
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
					onClick={() => changeTheme("dark")}
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
