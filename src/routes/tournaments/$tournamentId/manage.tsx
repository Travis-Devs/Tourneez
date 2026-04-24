import { createFileRoute } from "@tanstack/react-router";
import { ManageTournamentPage } from "#/pages/ManageTournamentPage";

export const Route = createFileRoute("/tournaments/$tournamentId/manage")({
	component: ManageTournamentPage,
});
