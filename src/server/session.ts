// owned by: italfa:staff
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { auth } from "#/lib/auth";

export const getSession = createServerFn({ method: "GET" }).handler(
	async () => {
		const headers = getRequest()?.headers;
		if (!headers) return null;
		const session = await auth.api.getSession({ headers });
		return session ?? null;
	},
);
