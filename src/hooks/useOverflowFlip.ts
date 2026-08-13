import { useRef, useState, useEffect, type RefObject } from "react";

export function useOverflowFlip<T extends HTMLElement>(
	deps: unknown[] = [],
): [RefObject<T | null>, boolean] {
	const ref = useRef<T | null>(null);
	const [overflow, setOverflow] = useState(false);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;

		const check = () => {
			const rect = el.getBoundingClientRect();
			setOverflow(rect.right > window.innerWidth);
		};

		check();
		window.addEventListener("resize", check);
		return () => window.removeEventListener("resize", check);
	}, deps);

	return [ref, overflow];
}
