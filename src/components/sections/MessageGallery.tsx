import { DragScrollContainer } from "#/components/ui/DragScrollContainer";
import { MaterialIcon } from "#/components/ui/MaterialIcon";
import { Section } from "#/components/ui/Section";
import { SectionLabel } from "#/components/ui/SectionLabel";

export default function MessageGallery() {
	return (
		<Section animate>
			<SectionLabel>PESAN DARI ALFA SCORPII</SectionLabel>
			<p className="font-head font-bold text-2xl sm:text-3xl md:text-5xl leading-tight max-w-4xl mb-16">
				<span className="text-blue">Presisi</span> di setiap komponen,{" "}
				<span className="text-blue">kepercayaan</span> di setiap perjalanan.
				Melayani pengendara Yamaha di Sumatera bagian utara selama lebih dari
				tiga dekade.
			</p>
			<DragScrollContainer className="auto-cols-[300px] gap-8">
				{(
					[
						["two_wheeler", "Medan, 2026"],
						["handshake", "Serah Terima Unit, 2026"],
						["build_circle", "Bengkel Resmi, 2025"],
						["inventory_2", "Gudang Sparepart, 2025"],
						["groups", "Komunitas Rider, 2025"],
					] as const
				).map(([icon, caption]) => (
					<div
						key={caption}
						className="min-w-[240px] md:min-w-[300px] flex-none"
					>
						<div className="aspect-[3/4] bg-paper-dim mb-4 flex items-center justify-center">
							<MaterialIcon name={icon} className="text-blue !text-[46px]" />
						</div>
						<p className="text-[12px] tracking-widest text-ash">{caption}</p>
					</div>
				))}
			</DragScrollContainer>
		</Section>
	);
}
