"use client";

import { useStore } from "@tanstack/react-form";
import { Loader2 } from "lucide-react";
import { Button } from "#/components/ui/Button";
import { useFormContext } from "./form-context";

export function SubmitButton({
	label = "Submit",
	type = "submit",
	loadingText = "Loading...",
	onClick,
}: {
	label?: string;
	loadingText?: string;
	type?: "submit" | "button";
	onClick?: () => void;
}) {
	const form = useFormContext();

	const [canSubmit, isSubmitting] = useStore(form.store, (state) => [
		state.canSubmit,
		state.isSubmitting,
	]);

	return (
		<Button
			type={type ? "submit" : undefined}
			disabled={!canSubmit || isSubmitting}
			className="gap-2"
			onClick={onClick}
		>
			{isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
			<span>{isSubmitting ? loadingText : label}</span>
		</Button>
	);
}
