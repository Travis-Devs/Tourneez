import { useState } from "react";
import { AppHeader } from "#/components/AppHeader";
import { Carousel } from "#/components/carousel/Carousel";
import {
	TournamentCard,
	type Tournament,
} from "#/components/carousel/TournamentCard";
import { cn } from "#/lib/utils";

type FilterStatus = "all" | "active" | "completed";

const MOCK_TOURNAMENTS: Tournament[] = [
	{
		id: "TRN-001",
		name: "Spring Open 2026",
		courseLocation: "Augusta National, Augusta GA",
		date: "April 30, 2026",
		status: "active",
		players: [
			{ id: "1", name: "Alice Martin" },
			{ id: "2", name: "Bob Chen" },
			{ id: "3", name: "Carol Davis" },
			{ id: "4", name: "David Lee" },
			{ id: "5", name: "Eva Wilson" },
			{ id: "6", name: "Frank Torres" },
			{ id: "7", name: "Grace Kim" },
		],
	},
	{
		id: "TRN-002",
		name: "Winter Classic",
		courseLocation: "Pebble Beach Golf Links, Pebble Beach CA",
		date: "December 10, 2025",
		status: "completed",
		players: [
			{ id: "1", name: "Alice Martin" },
			{ id: "2", name: "Bob Chen" },
			{ id: "3", name: "Carol Davis" },
		],
	},
	{
		id: "TRN-003",
		name: "Sunday Club Scramble",
		courseLocation: "Pinehurst No. 2, Pinehurst NC",
		date: "May 15, 2026",
		status: "active",
		players: [
			{ id: "1", name: "Alice Martin" },
			{ id: "2", name: "Bob Chen" },
		],
	},
];

const FILTER_LABELS: Record<FilterStatus, string> = {
	all: "All",
	active: "Active",
	completed: "Completed",
};

export function DashboardPage() {
	const [search, setSearch] = useState("");
	const [filter, setFilter] = useState<FilterStatus>("all");

	const filtered = MOCK_TOURNAMENTS.filter((t) => {
		const matchesStatus = filter === "all" || t.status === filter;
		const query = search.toLowerCase();
		const matchesSearch =
			query === "" ||
			t.name.toLowerCase().includes(query) ||
			t.courseLocation.toLowerCase().includes(query);
		return matchesStatus && matchesSearch;
	});

	return (
		<div className="min-h-screen">
			<AppHeader />
			<main className="mx-auto max-w-lg space-y-5 p-6">
				{/* Search */}
				<input
					type="search"
					placeholder="Search tournaments..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
				/>

				{/* Filter buttons */}
				<div className="flex gap-2">
					{(["all", "active", "completed"] as FilterStatus[]).map((f) => (
						<button
							key={f}
							type="button"
							onClick={() => setFilter(f)}
							className={cn(
								"rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
								filter === f
									? "bg-primary text-primary-foreground"
									: "bg-muted text-muted-foreground hover:bg-muted/80",
							)}
						>
							{FILTER_LABELS[f]}
						</button>
					))}
				</div>

				{/* Action buttons */}
				<div className="grid grid-cols-3 gap-3">
					{["Create Tournament", "Join Tournament", "Manage Tournament"].map(
						(label) => (
							<button
								key={label}
								type="button"
								className="rounded-lg border bg-card px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
							>
								{label}
							</button>
						),
					)}
				</div>

				{/* Carousel */}
				<p className="text-sm font-medium">
					Tournaments ({filtered.length})
				</p>
				{filtered.length > 0 ? (
					<div className="pb-6">
						<Carousel
							items={filtered}
							renderItem={(tournament) => (
								<TournamentCard tournament={tournament} />
							)}
						/>
					</div>
				) : (
					<div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
						No tournaments found
					</div>
				)}
			</main>
		</div>
	);
}
