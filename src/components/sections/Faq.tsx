import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { MarkdownPreview } from "#/components/ui/MarkdownPreview";
import { Section } from "#/components/ui/Section";
import { SectionHeading } from "#/components/ui/SectionHeading";
import { StaggerItem } from "#/components/ui/StaggerItem";
import { StaggerList } from "#/components/ui/StaggerList";
import { cms } from "#/data/cms";

export interface FaqProps {
  question: string;
  answer: string;
}

export default function Faq({ faqs }: { faqs: FaqProps[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <Section animate>
      {/* Tambahkan w-full max-w-[800px] agar lebar FAQ stabil & tidak bergeser */}
      <div className="flex flex-col items-center text-center mb-12 w-full max-w-4xl mx-auto">
        <SectionHeading className="mb-12">Pertanyaan Umum</SectionHeading>

        {/* Tambahkan w-full di sini */}
        <div className="w-full text-left">
          <StaggerList>
            {faqs.map((f, i) => (
              <StaggerItem key={f.question ?? i}>
                <div className="border-b border-line w-full">
                  <button
                    type="button"
                    onClick={() => setOpenIdx(openIdx === i ? null : i)}
                    className="w-full flex justify-between items-center text-left bg-transparent border-0 py-5 px-[2px] font-head font-bold text-[17px] cursor-pointer"
                  >
                    <MarkdownPreview content={f.question} />
                    <motion.span
                      animate={{ rotate: openIdx === i ? 45 : 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className={`text-[20px] shrink-0 ml-4 ${
                        openIdx === i ? "text-blue-bright" : ""
                      }`}
                    >
                      +
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {openIdx === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          duration: 0.3,
                          ease: [0.04, 0.62, 0.23, 0.98],
                        }}
                        className="overflow-hidden"
                      >
                        <div className="px-[2px] pb-5 text-ash text-[14px] leading-relaxed">
                          <MarkdownPreview content={f.answer} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </StaggerItem>
            ))}
          </StaggerList>
        </div>
      </div>
    </Section>
  );
}
