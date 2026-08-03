import {
	SelectInput,
	type SelectInputProps,
} from "#/components/ui/SelectInput";
import { useFieldContext } from "../form-context";

type SelectFieldProps = Omit<
	SelectInputProps,
	"value" | "onChange" | "onBlur" | "error"
>;

export function SelectField(props: SelectFieldProps) {
	const field = useFieldContext<string>();
	const raw = field.state.meta.errors[0];
	const error =
		typeof raw === "string"
			? raw
			: ((raw as { message?: string } | undefined)?.message ?? "");

	return (
		<SelectInput
			{...props}
			name={field.name}
			value={field.state.value ?? ""}
			onChange={(e) => field.handleChange(e.target.value)}
			onBlur={field.handleBlur}
			error={error}
		/>
	);
}
