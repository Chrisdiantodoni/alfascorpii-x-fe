import { motion } from "motion/react";
import type { ReactNode } from "react";

const itemVariants = {
	hidden: { opacity: 0, y: 16 },
	show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

interface StaggerItemProps {
	children: ReactNode;
}

export function StaggerItem({ children }: StaggerItemProps) {
	return <motion.div variants={itemVariants}>{children}</motion.div>;
}
