import { toast } from "sonner";
import { Section } from "#/components/ui/Section";
import { SectionHeading } from "#/components/ui/SectionHeading";
import { SectionLabel } from "#/components/ui/SectionLabel";
import { cms } from "#/data/cms";
import { useAppForm } from "#/forms";
import { inquiryFormSchema } from "#/schemas/customer";
import { createInquiry } from "#/server/customer";

const defaultValues = {
	name: "",
	whatsapp_number: "",
	email: "",
	subject: "",
	message: "",
};

export default function InquiryForm() {
	const form = useAppForm({
		defaultValues,
		validators: {
			onSubmit: inquiryFormSchema,
		},
		onSubmit: async ({ value }) => {
			const toastId = toast.loading("Mengirim...");

			try {
				await createInquiry({ data: value });

				toast.success("Terkirim — tim kami akan segera menghubungi Anda.", {
					id: toastId,
				});
				form.reset();
			} catch {
				const waDigits = cms.contact.telNumber.replace(/\D/g, "");
				const waText = encodeURIComponent(
					`Halo Alfa Scorpii, saya ${value.name}.\nSubjek: ${value.subject}\n\n${value.message}`,
				);

				toast.error("Gagal mengirim.", {
					id: toastId,
					description: "Coba lagi atau hubungi via WhatsApp.",
					action: {
						label: "WhatsApp",
						onClick: () =>
							window.open(`https://wa.me/${waDigits}?text=${waText}`, "_blank"),
					},
				});
			}
		},
	});

	return (
		<Section animate>
			<div className="flex flex-col items-center text-center mb-12">
				<SectionLabel>HUBUNGI KAMI</SectionLabel>
				<SectionHeading className="mb-4 max-w-xl">
					Ada Pertanyaan?
					<br />
					Kirim ke Kami.
				</SectionHeading>
				<p className="text-ash max-w-md">
					Isi form ini, tim kami akan menghubungi lewat WhatsApp atau email
					secepatnya.
				</p>
			</div>

			<div className="w-full flex justify-center">
				<form.AppForm>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							e.stopPropagation();
							form.handleSubmit();
						}}
						className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8 text-left"
						noValidate
					>
						<form.AppField name="name">
							{(field) => (
								<field.TextField
									label="NAMA"
									type="text"
									required
									placeholder="Nama lengkap"
								/>
							)}
						</form.AppField>

						<form.AppField name="whatsapp_number">
							{(field) => (
								<field.TextField
									label="NO. WHATSAPP"
									type="tel"
									required
									placeholder="08xxxxxxxxxx"
								/>
							)}
						</form.AppField>

						<form.AppField name="email">
							{(field) => (
								<field.TextField
									label="EMAIL"
									type="email"
									optional
									placeholder="nama@email.com"
								/>
							)}
						</form.AppField>

						<form.AppField name="subject">
							{(field) => (
								<field.SelectField
									label="SUBJEK"
									required
									placeholder="Pilih topik"
									options={[
										{ value: "Pembelian Motor", label: "Pembelian Motor" },
										{ value: "Sparepart", label: "Sparepart" },
										{ value: "Servis", label: "Servis" },
										{ value: "Lainnya", label: "Lainnya" },
									]}
								/>
							)}
						</form.AppField>

						<div className="sm:col-span-2">
							<form.AppField name="message">
								{(field) => (
									<field.TextField
										label="PESAN"
										required
										multiline
										rows={4}
										placeholder="Tulis pertanyaan Anda di sini..."
									/>
								)}
							</form.AppField>
						</div>

						<div className="sm:col-span-2 flex items-center justify-start gap-6 flex-wrap">
							<form.SubmitButton
								label="KIRIM PESAN"
								loadingText="MENGIRIM..."
							/>
						</div>
					</form>
				</form.AppForm>
			</div>
		</Section>
	);
}
