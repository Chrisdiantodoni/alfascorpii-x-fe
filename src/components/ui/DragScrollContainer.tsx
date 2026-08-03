import { motion } from "motion/react";
import type { ReactNode } from "react";
import { useDragScroll } from "#/hooks/useDragScroll";

const listVariants = {
	hidden: {},
	show: { transition: { staggerChildren: 0.05 } },
};

interface DragScrollContainerProps {
	children: ReactNode;
	className?: string;
	stagger?: boolean;
}

export function DragScrollContainer({
	children,
	className = "",
	stagger,
}: DragScrollContainerProps) {
	const ref = useDragScroll<HTMLDivElement>();
	const Tag = stagger ? motion.div : "div";
	const motionProps = stagger
		? {
				variants: listVariants,
				initial: "hidden",
				whileInView: "show",
				viewport: { once: true, margin: "-32px" },
			}
		: {};

	return (
		<Tag
			ref={ref}
			// px & py diperbesar jadi buffer agar shadow/translate hover tidak ter-clip
			// -my kompensasi supaya jarak visual ke elemen lain tetap sama seperti sebelumnya
			className={`grid grid-flow-col items-stretch overflow-x-auto no-scrollbar px-3 py-6 -my-6 cursor-grab active:cursor-grabbing ${className}`}
			{...motionProps}
		>
			{children}
		</Tag>
	);
}
