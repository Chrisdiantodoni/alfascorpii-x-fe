export function formatRupiah(n: number | null) {
	if (n == null) return "Cek ketersediaan";
	return new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency: "IDR",
		maximumFractionDigits: 0,
	}).format(n);
}

export function formatDate(iso: string) {
	return new Date(iso).toLocaleDateString("id-ID", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});
}
