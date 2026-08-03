import { motion } from "motion/react";
import { MaterialIcon } from "#/components/ui/MaterialIcon";
import { cms } from "#/data/cms";

export default function UspStrip() {
	return (
		<motion.section
			className="py-16 border-t border-line grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10"
			initial={{ opacity: 0, y: 24 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.4 }}
		>
			{cms.usp.map((u) => (
				<div key={u.icon} className="flex items-start gap-4">
					<MaterialIcon name={u.icon} className="text-blue !text-[28px]" />
					<div>
						<h3 className="font-head font-bold text-base mb-1">{u.title}</h3>
						<p className="text-[13px] text-ash">{u.description}</p>
					</div>
				</div>
			))}
		</motion.section>
	);
}
