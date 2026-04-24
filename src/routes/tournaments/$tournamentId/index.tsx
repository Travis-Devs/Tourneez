import { createFileRoute } from "@tanstack/react-router";
import { TournamentViewPage } from "#/pages/TournamentViewPage";

export const Route = createFileRoute("/tournaments/$tournamentId/")({
	component: TournamentViewPage,
});
