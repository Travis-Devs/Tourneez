import { createFileRoute } from "@tanstack/react-router";
import { CreateTournamentPage } from "#/pages/CreateTournamentPage";

export const Route = createFileRoute("/tournaments/create")({
	component: CreateTournamentPage,
});
