import { createFileRoute } from "@tanstack/react-router";
import { TournamentResultsPage } from "#/pages/TournamentResultsPage";

export const Route = createFileRoute("/tournaments/$tournamentId/results")({
	component: TournamentResultsPage,
});
