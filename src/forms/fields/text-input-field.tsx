import type { ComponentProps } from "react";
import { TextInput } from "#/components/ui/TextInput";
import { useFieldContext } from "../form-context";

type FieldBase = {
	label: string;
	optional?: boolean;
	required?: boolean;
};

type SingleLineProps = Omit<
	ComponentProps<"input">,
	"className" | "ref" | "required" | "value" | "onChange" | "onBlur"
> &
	FieldBase & {
		multiline?: never;
		rows?: never;
	};

type MultiLineProps = Omit<
	ComponentProps<"textarea">,
	"className" | "ref" | "required" | "value" | "onChange" | "onBlur"
> &
	FieldBase & {
		multiline: true;
		rows?: number;
	};

type Props = SingleLineProps | MultiLineProps;

export function TextField(props: Props) {
	const field = useFieldContext<string>();
	const raw = field.state.meta.errors[0];
	const error =
		typeof raw === "string"
			? raw
			: ((raw as { message?: string } | undefined)?.message ?? "");

	return (
		<TextInput
			{...props}
			name={field.name}
			value={field.state.value ?? ""}
			onChange={(e) => field.handleChange(e.target.value)}
			onBlur={field.handleBlur}
			error={error}
		/>
	);
}
