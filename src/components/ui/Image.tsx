import { Image as UnpicImage } from "@unpic/react";

export function Image({
	priority,
	loading,
	...props
}: React.ComponentProps<typeof UnpicImage>) {
	return (
		<UnpicImage
			layout="constrained"
			loading={priority ? "eager" : (loading ?? "lazy")}
			fetchpriority={priority ? "high" : undefined}
			{...props}
		/>
	);
}
