import type { ReactNode } from "react";

interface SectionLabelProps {
	children: ReactNode;
	className?: string;
}

export function SectionLabel({ children, className = "" }: SectionLabelProps) {
	return (
		<span
			className={`block text-[12px] tracking-widest text-ash mb-4 ${className}`}
		>
			{children}
		</span>
	);
}
