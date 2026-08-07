import { Marquee } from "#/components/ui/Marquee";
import { Section } from "#/components/ui/Section";
import { SectionHeading } from "#/components/ui/SectionHeading";

const PARTNERS = ["YAMAHA", "YAMALUBE", "DUNLOP", "PHILIPS"];

export default function Partners() {
  return (
    <Section animate className="overflow-hidden">
      <SectionHeading className="mb-14" as="h2">
        Mitra <span className="text-blue">&amp; Brand Resmi</span>
      </SectionHeading>

      <div className="relative w-full [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]">
        <Marquee pauseOnHover className="[--duration:20s] [--gap:4rem]">
          {PARTNERS.map((partner) => (
            <span
              key={partner}
              className="text-2xl md:text-3xl font-head font-extrabold text-ash/50 hover:text-blue transition-colors"
            >
              {partner}
            </span>
          ))}
        </Marquee>
      </div>
    </Section>
  );
}
