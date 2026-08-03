import { useEffect, useRef } from "react";

export function useDragScroll<T extends HTMLElement = HTMLDivElement>() {
	const ref = useRef<T>(null);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		let isDown = false;
		let startX = 0;
		let startScroll = 0;
		let startY = 0;
		let isDrag = false;
		let captured = false;
		const dragThreshold = 5;

		const onDown = (e: PointerEvent) => {
			isDown = true;
			startX = e.clientX;
			startY = e.clientY;
			startScroll = el.scrollLeft;
			isDrag = false;
			captured = false;
		};

		const onMove = (e: PointerEvent) => {
			if (!isDown) return;
			const dx = Math.abs(e.clientX - startX);
			const dy = Math.abs(e.clientY - startY);

			if (!isDrag && (dx > dragThreshold || dy > dragThreshold)) {
				isDrag = dx > dy;
				if (isDrag) {
					el.setPointerCapture(e.pointerId);
					captured = true;
				}
			}

			if (isDrag) {
				e.preventDefault();
				el.classList.add("dragging");
				el.scrollLeft = startScroll - (e.clientX - startX);
			}
		};

		const end = () => {
			if (captured) {
				try {
					el.releasePointerCapture(1);
				} catch {
					/* already released */
				}
			}
			isDown = false;
			isDrag = false;
			captured = false;
			el.classList.remove("dragging");
		};

		el.addEventListener("pointerdown", onDown);
		el.addEventListener("pointermove", onMove);
		el.addEventListener("pointerup", end);
		el.addEventListener("pointercancel", end);

		return () => {
			el.removeEventListener("pointerdown", onDown);
			el.removeEventListener("pointermove", onMove);
			el.removeEventListener("pointerup", end);
			el.removeEventListener("pointercancel", end);
		};
	}, []);

	return ref;
}
