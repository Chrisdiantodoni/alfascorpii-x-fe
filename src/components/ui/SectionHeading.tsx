import type { ReactNode } from "react";

interface SectionHeadingProps {
	children: ReactNode;
	className?: string;
	as?: "h1" | "h2" | "h3";
}

export function SectionHeading({
	children,
	className = "",
	as: Tag = "h2",
}: SectionHeadingProps) {
	return (
		<Tag
			className={`font-head font-bold text-2xl sm:text-3xl md:text-5xl tracking-tighter ${className}`}
		>
			{children}
		</Tag>
	);
}
