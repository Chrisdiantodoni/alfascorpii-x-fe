import createDOMPurify from "dompurify";

const sanitizer = await (async () => {
	if (import.meta.env.SSR) {
		const { JSDOM } = await import("jsdom");
		return createDOMPurify(new JSDOM("").window);
	}
	return createDOMPurify(globalThis.window);
})();

export default sanitizer;
