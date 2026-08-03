import z from "zod";

export const inquiryFormSchema = z.object({
	name: z.string().min(2, "Nama minimal 2 karakter"),
	whatsapp_number: z.string().min(9, "Nomor WhatsApp tidak valid"),
	email: z.string().email("Format email tidak valid").or(z.literal("")),
	subject: z.string().min(3, "Subjek minimal 3 karakter"),
	message: z.string().min(10, "Pesan minimal 10 karakter"),
});

export const inquirySchema = inquiryFormSchema.extend({
	id: z.string().length(26).optional(),
});

export type InquiryFormValues = z.infer<typeof inquiryFormSchema>;
export type Inquiry = z.infer<typeof inquirySchema>;
