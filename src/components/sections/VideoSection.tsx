import { MaterialIcon } from "#/components/ui/MaterialIcon";
import { Section } from "#/components/ui/Section";
import { SectionLabel } from "#/components/ui/SectionLabel";
import { cms } from "#/data/cms";

export default function VideoSection() {
	const v = cms.video;
	return (
		<Section animate>
			<SectionLabel>TONTON ALFA SCORPII</SectionLabel>
			<h2
				className="font-head font-bold text-2xl sm:text-3xl md:text-5xl tracking-tighter mb-10 max-w-2xl"
				dangerouslySetInnerHTML={{ __html: v.title }}
			/>
			<div className="relative w-full aspect-video bg-[#0A0A0C] overflow-hidden group cursor-pointer">
				{v.embedUrl ? (
					<iframe
						src={v.embedUrl}
						className="absolute inset-0 w-full h-full border-0"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowFullScreen
					/>
				) : (
					<>
						<div className="absolute inset-0 flex items-center justify-center">
							<svg
								viewBox="0 0 200 120"
								className="w-1/2 opacity-[0.12]"
								fill="none"
								stroke="#fff"
								strokeWidth="2.2"
							>
								<circle cx="40" cy="92" r="24" />
								<circle cx="160" cy="92" r="24" />
								<path d="M40 92 L84 44 H122 L160 92" strokeLinejoin="round" />
							</svg>
						</div>
						<div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
							<div className="w-[76px] h-[76px] rounded-full bg-[rgba(255,255,255,.12)] border border-white/50 flex items-center justify-center text-white transition-all duration-250 group-hover:scale-110 group-hover:bg-blue-bright group-hover:border-blue-bright">
								<MaterialIcon name="play_arrow" className="!text-[34px]" />
							</div>
							<p className="text-white/50 text-[11px] tracking-widest text-center max-w-xs px-6">
								{v.placeholderNote}
							</p>
						</div>
					</>
				)}
			</div>
			{v.caption && (
				<p className="text-[13px] text-ash mt-4 max-w-lg">{v.caption}</p>
			)}
		</Section>
	);
}
