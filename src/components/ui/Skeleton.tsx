import { type HTMLMotionProps, motion } from "motion/react";
import type { CSSProperties, ReactNode } from "react";

function cn(...classes: (string | undefined | false)[]) {
	return classes.filter(Boolean).join(" ");
}

const shimmerStyle: CSSProperties = {
	backgroundImage:
		"linear-gradient(90deg, var(--color-paper-mute) 25%, var(--color-paper-dim) 50%, var(--color-paper-mute) 75%)",
	backgroundSize: "200% 100%",
};

interface SkeletonBoxProps extends HTMLMotionProps<"div"> {
	className?: string;
	children?: ReactNode;
}

function SkeletonBox({
	className,
	children,
	style,
	...rest
}: SkeletonBoxProps) {
	return (
		<motion.div
			className={cn("rounded-md overflow-hidden", className)}
			style={{ ...shimmerStyle, ...style }}
			animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
			transition={{
				duration: 1.6,
				repeat: Number.POSITIVE_INFINITY,
				ease: "linear",
			}}
			{...rest}
		>
			{children}
		</motion.div>
	);
}

export function SkeletonText({
	width = "100%",
	className,
}: {
	width?: string;
	className?: string;
}) {
	return <SkeletonBox className={cn("h-4", className)} style={{ width }} />;
}

export function SkeletonTitle({
	width = "60%",
	className,
}: {
	width?: string;
	className?: string;
}) {
	return <SkeletonBox className={cn("h-7", className)} style={{ width }} />;
}

export function SkeletonCard({ className }: { className?: string }) {
	return <SkeletonBox className={cn("aspect-[3/4] rounded-xl", className)} />;
}

export function SkeletonBanner({ className }: { className?: string }) {
	return (
		<SkeletonBox
			className={cn("w-full rounded-xl", className)}
			style={{ height: "clamp(300px, 50vh, 600px)" }}
		/>
	);
}

export function SkeletonGrid({
	cols = 3,
	itemHeight = 280,
	className,
}: {
	cols?: number;
	itemHeight?: number;
	className?: string;
}) {
	return (
		<div
			className={cn("grid gap-6", className)}
			style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
		>
			{Array.from({ length: cols }).map(() => {
				const key = crypto.randomUUID();
				return (
					<SkeletonBox
						key={key}
						className="rounded-xl"
						style={{ height: itemHeight }}
					/>
				);
			})}
		</div>
	);
}

export function SkeletonPage() {
	return (
		<div className="space-y-10 py-8">
			<SkeletonBanner className="h-[400px]" />
			<div className="space-y-4">
				<SkeletonTitle />
				<SkeletonText width="75%" />
			</div>
			<SkeletonGrid cols={3} />
			<div className="space-y-4">
				<SkeletonTitle width="40%" />
				<SkeletonGrid cols={4} className="mt-4" />
			</div>
		</div>
	);
}
