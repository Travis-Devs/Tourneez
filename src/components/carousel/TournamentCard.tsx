import { cn } from "#/lib/utils";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	AvatarGroup,
	AvatarGroupCount,
} from "#/components/ui/avatar";

export type Player = {
	id: string;
	name: string;
	avatarUrl?: string;
};

export type Tournament = {
	id: string;
	name: string;
	courseLocation: string;
	date: string;
	status: "active" | "completed";
	players: Player[];
};

function getInitials(name: string): string {
	return name
		.split(" ")
		.map((p) => p[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);
}

export function TournamentCard({ tournament }: { tournament: Tournament }) {
	const maxVisible = 5;
	const visiblePlayers = tournament.players.slice(0, maxVisible);
	const remainingCount = tournament.players.length - maxVisible;

	return (
		<div className="overflow-hidden rounded-xl border bg-card shadow-sm">
			{/* Course photo */}
			<div className="flex h-36 items-center justify-center bg-green-600">
				<span className="text-sm font-medium tracking-wide text-white/80">
					photo
				</span>
			</div>

			{/* Body */}
			<div className="space-y-3 p-4">
				<div className="flex items-start justify-between gap-2">
					<div>
						<h3 className="text-base font-semibold leading-tight">
							{tournament.name}
						</h3>
						<p className="mt-0.5 text-xs text-muted-foreground">
							ID: {tournament.id}
						</p>
					</div>
					<span
						className={cn(
							"shrink-0 rounded-full px-2 py-0.5 text-xs font-medium",
							tournament.status === "active"
								? "bg-green-100 text-green-700"
								: "bg-zinc-100 text-zinc-500",
						)}
					>
						{tournament.status === "active" ? "Active" : "Completed"}
					</span>
				</div>

				<div className="space-y-0.5 text-sm text-muted-foreground">
					<p>{tournament.courseLocation}</p>
					<p>{tournament.date}</p>
				</div>

				<hr className="border-border" />

				{/* Players + Open button */}
				<div className="flex items-center justify-between">
					<AvatarGroup>
						{visiblePlayers.map((player) => (
							<Avatar key={player.id} size="sm">
								<AvatarImage src={player.avatarUrl} alt={player.name} />
								<AvatarFallback>{getInitials(player.name)}</AvatarFallback>
							</Avatar>
						))}
						{remainingCount > 0 && (
							<AvatarGroupCount>+{remainingCount}</AvatarGroupCount>
						)}
					</AvatarGroup>

					<button
						type="button"
						className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
					>
						Open
					</button>
				</div>
			</div>
		</div>
	);
}
