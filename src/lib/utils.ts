type ClassValue =
	| string
	| undefined
	| null
	| false
	| Record<string, boolean | undefined | null>;

export function cn(...classes: ClassValue[]): string {
	const result: string[] = [];

	for (const c of classes) {
		if (!c) continue;
		if (typeof c === "string") {
			result.push(c);
		} else if (typeof c === "object") {
			for (const [key, value] of Object.entries(c)) {
				if (value) result.push(key);
			}
		}
	}

	return result.join(" ");
}

export function now(): string {
	return new Date().toISOString();
}

export function storageUrl(path: string | null): string | null {
	if (!path) return null;
	if (path.startsWith("http://") || path.startsWith("https://")) return path;
	const backendUrl =
		import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";
	return `${backendUrl}/storage/${path}`;
}
