import { createServerFn } from "@tanstack/react-start";
import { ulid } from "ulid";
import { db } from "#/db";
import { inquiries } from "#/drizzle/schema";
import { now } from "#/lib/utils";
import { inquiryFormSchema } from "#/schemas/customer";

export const createInquiry = createServerFn({ method: "POST" })
	.validator(inquiryFormSchema)
	.handler(async ({ data }) => {
		const currentTime = now();

		const [newInquiry] = await db
			.insert(inquiries)
			.values({
				id: ulid(),
				name: data.name,
				whatsappNumber: data.whatsapp_number,
				email: data.email || null,
				subject: data.subject,
				message: data.message,
				createdAt: currentTime,
				updatedAt: currentTime,
			})
			.returning();

		return newInquiry;
	});
