import { Link } from "@tanstack/react-router";
import { type HTMLMotionProps, motion } from "motion/react";
import type { ReactNode } from "react";

type ButtonBaseProps = {
	variant?: "primary" | "light" | "text" | "pill";
	active?: boolean;
	children: ReactNode;
	className?: string;
	disabled?: boolean;
};

// Menggunakan HTMLMotionProps agar tipe event cocok persis dengan <motion.button>
type ButtonAsButton = ButtonBaseProps &
	Omit<HTMLMotionProps<"button">, keyof ButtonBaseProps> & {
		to?: never;
		href?: never;
		external?: never;
	};

type ButtonAsLink = ButtonBaseProps & {
	to: string;
	params?: Record<string, string>;
	href?: never;
	external?: never;
};

type ButtonAsAnchor = ButtonBaseProps & {
	href: string;
	external?: boolean;
	to?: never;
};

type ButtonProps = ButtonAsButton | ButtonAsLink | ButtonAsAnchor;

const base =
	"inline-flex items-center justify-center text-[12px] font-semibold tracking-widest transition-colors select-none disabled:opacity-50 disabled:cursor-not-allowed will-change-transform";

const variants: Record<string, string> = {
	primary: "border border-ink px-8 py-4 text-ink hover:bg-ink hover:text-white",
	light:
		"border border-white px-8 py-4 text-white hover:bg-white hover:text-[#0A0A0C]",
	text: "border-b border-ink pb-1 text-ink hover:text-blue",
	pill: "px-5 py-2 border border-line text-ash hover:text-ink hover:border-ink",
};

const motionFx = {
	whileTap: { scale: 0.97 },
	transition: { duration: 0.12, ease: "easeOut" },
} as const;

export function Button(props: ButtonProps) {
	const {
		variant = "primary",
		active,
		children,
		className = "",
		disabled,
	} = props;

	const activeCls =
		variant === "pill" && active
			? "bg-[#0A0A0C] text-white !border-transparent"
			: "";

	const combinedClasses = `${base} ${variants[variant]} ${activeCls} ${className}`;
	const activeFx = disabled ? undefined : motionFx;

	if ("to" in props && props.to) {
		return (
			<motion.div className="inline-flex" {...activeFx}>
				<Link to={props.to} params={props.params} className={combinedClasses}>
					{children}
				</Link>
			</motion.div>
		);
	}

	if ("href" in props && props.href) {
		return (
			<motion.a
				href={props.href}
				target={props.external ? "_blank" : undefined}
				rel={props.external ? "noopener noreferrer" : undefined}
				className={combinedClasses}
				{...activeFx}
			>
				{children}
			</motion.a>
		);
	}

	// Destrukturisasi tanpa merusak tipe event Motion
	const {
		to: _to,
		href: _href,
		external: _external,
		active: _active,
		variant: _variant,
		className: _className,
		...restButtonProps
	} = props as ButtonAsButton;

	return (
		<motion.button
			type={restButtonProps.type ?? "button"}
			disabled={disabled}
			className={combinedClasses}
			{...activeFx}
			{...restButtonProps}
		>
			{children}
		</motion.button>
	);
}
