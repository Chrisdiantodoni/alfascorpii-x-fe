import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/$slug/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/_public/$slug/"!</div>;
}
