import { createFileRoute } from "@tanstack/react-router";
import { JoinTournamentPage } from "#/pages/JoinTournamentPage";

export const Route = createFileRoute("/tournaments/join")({
	component: JoinTournamentPage,
});
