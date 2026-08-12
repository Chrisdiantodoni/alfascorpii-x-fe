"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

interface ThemeContextValue {
	theme: "light" | "dark";
	setTheme: (theme: "light" | "dark") => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
	const [theme, setThemeState] = useState<"light" | "dark">("light");

	useEffect(() => {
		const isDark = document.documentElement.classList.contains("dark");
		setThemeState(isDark ? "dark" : "light");
	}, []);

	const setTheme = (newTheme: "light" | "dark") => {
		setThemeState(newTheme);
		localStorage.setItem("theme", newTheme);
		if (newTheme === "dark") {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	};

	return (
		<ThemeContext value={{ theme, setTheme }}>
			{children}
		</ThemeContext>
	);
}

export function useTheme(): ThemeContextValue {
	const ctx = useContext(ThemeContext);
	if (!ctx) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return ctx;
}
