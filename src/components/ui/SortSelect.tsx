import { SelectInput, type SelectOption } from "#/components/ui/SelectInput";

const SORT_OPTIONS: SelectOption[] = [
	{ value: "recommended", label: "Rekomendasi" },
	{ value: "price_asc", label: "Harga Terendah" },
	{ value: "price_desc", label: "Harga Tertinggi" },
	{ value: "name_asc", label: "Nama A–Z" },
	{ value: "name_desc", label: "Nama Z–A" },
];

interface SortSelectProps {
	value: string | undefined;
	onChange: (value: string) => void;
}

export function SortSelect({ value, onChange }: SortSelectProps) {
	return (
		<SelectInput
			label="URUTKAN"
			value={value}
			options={SORT_OPTIONS}
			onChange={(e) => onChange(e.target.value)}
			placeholder="Rekomendasi"
		/>
	);
}
