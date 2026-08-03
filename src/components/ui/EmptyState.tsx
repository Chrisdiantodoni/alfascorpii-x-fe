import { Link } from "@tanstack/react-router";
import { type LucideIcon, PackageOpen } from "lucide-react";

interface EmptyStateProps {
	icon?: LucideIcon;
	title: string;
	description: string;
	action?: {
		label: string;
		to: string;
	};
}

export function EmptyState({
	icon: Icon = PackageOpen,
	title,
	description,
	action,
}: EmptyStateProps) {
	return (
		<div className="flex flex-col items-center justify-center text-center py-24 px-6">
			<Icon size={64} className="text-blue/20 mb-6" strokeWidth={1} />
			<h3 className="font-head font-bold text-xl mb-3 text-ink">{title}</h3>
			<p className="text-ash max-w-md text-[15px] leading-relaxed">
				{description}
			</p>
			{action && (
				<Link
					to={action.to}
					className="inline-flex items-center gap-2 mt-8 px-6 py-3 border border-line bg-paper text-ink hover:border-blue hover:text-blue transition-colors duration-300 text-[13px] font-bold tracking-wider uppercase"
				>
					{action.label}
				</Link>
			)}
		</div>
	);
}
