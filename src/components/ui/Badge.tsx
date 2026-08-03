import type { ReactNode } from "react";

interface BadgeProps {
	children: ReactNode;
	className?: string;
}

export function Badge({ children, className = "" }: BadgeProps) {
	return (
		<span
			className={`text-[10px] tracking-[.1em] font-bold px-4 pt-4 pb-0 bg-[#0A0A0C] text-white w-fit ${className}`}
		>
			{children}
		</span>
	);
}
