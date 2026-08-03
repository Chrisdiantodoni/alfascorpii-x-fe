import { motion } from "motion/react";
import type { ReactNode } from "react";

const listVariants = {
	hidden: {},
	show: { transition: { staggerChildren: 0.05 } },
};

interface StaggerListProps {
	children: ReactNode;
	className?: string;
}

export function StaggerList({ children, className }: StaggerListProps) {
	return (
		<motion.div
			variants={listVariants}
			initial="hidden"
			whileInView="show"
			viewport={{ once: true, margin: "-32px" }}
			className={className}
		>
			{children}
		</motion.div>
	);
}
