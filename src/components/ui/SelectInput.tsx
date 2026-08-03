import { type ComponentProps, forwardRef } from "react";

export type SelectOption = {
	value: string;
	label: string;
	disabled?: boolean;
};

export type SelectInputProps = Omit<
	ComponentProps<"select">,
	"className" | "ref"
> & {
	label: string;
	error?: string;
	optional?: boolean;
	required?: boolean;
	placeholder?: string;
	options: SelectOption[];
};

const selectCls =
	"appearance-none border-0 border-b border-line bg-transparent outline-none px-[2px] py-[10px] text-[15px] text-ink focus:border-b-blue-bright transition-colors cursor-pointer";

const arrowSvg =
	"url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none' stroke='%235A5F6B' stroke-width='1.6'><path d='M5 7l5 5 5-5'/></svg>\")";

export const SelectInput = forwardRef<HTMLSelectElement, SelectInputProps>(
	function SelectInput(props, ref) {
		const {
			label,
			error,
			optional,
			required,
			placeholder,
			options,
			id: idProp,
			name,
			value,
			...rest
		} = props;

		const id = idProp ?? name;

		return (
			<div className="flex flex-col gap-2">
				<label
					htmlFor={id}
					className="text-[11px] tracking-widest text-ash flex items-center gap-1"
				>
					<span>{label}</span>

					{/* Asterisk (*) untuk field required */}
					{required && (
						<span
							className="text-red-700 font-bold text-[12px] leading-none"
							title="Wajib diisi"
						>
							*
						</span>
					)}

					{/* Label Opsional */}
					{optional && (
						<span className="text-ash/60 text-[10px] lowercase">
							(opsional)
						</span>
					)}
				</label>

				<select
					ref={ref}
					id={id}
					name={name}
					value={value ?? ""}
					required={required}
					className={`${selectCls} ${!value ? "text-ash" : "text-ink"}`}
					style={{
						backgroundImage: arrowSvg,
						backgroundRepeat: "no-repeat",
						backgroundPosition: "right 2px center",
						backgroundSize: "14px",
						paddingRight: "22px",
					}}
					{...rest}
				>
					{/* Option Placeholder (Default) */}
					{placeholder && (
						<option value="" disabled className="bg-paper text-ash">
							{placeholder}
						</option>
					)}

					{/* Option List */}
					{options.map((opt) => (
						<option
							key={opt.value}
							value={opt.value}
							disabled={opt.disabled}
							className="bg-paper text-ink disabled:text-ash/50"
						>
							{opt.label}
						</option>
					))}
				</select>

				{error && (
					<span className="text-[11px] text-red-500 mt-0.5">{error}</span>
				)}
			</div>
		);
	},
);
