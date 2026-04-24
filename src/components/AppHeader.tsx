import { useRouter } from "@tanstack/react-router";
import { LogOutIcon, UserIcon } from "lucide-react";
import { authClient } from "#/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "#/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";

function getInitials(name: string | null | undefined, email: string | null | undefined): string {
	if (name) {
		return name
			.split(" ")
			.map((part) => part[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	}
	return email?.[0]?.toUpperCase() ?? "?";
}

export function AppHeader() {
	const router = useRouter();
	const { data: session } = authClient.useSession();

	async function handleLogout() {
		await authClient.signOut();
		router.navigate({ to: "/login" });
	}

	const user = session?.user;
	const initials = getInitials(user?.name, user?.email);

	return (
		<header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b bg-background px-6">
			<span className="text-lg font-bold tracking-tight text-foreground">Tourneez</span>

			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<button
						type="button"
						className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
						aria-label="Open account menu"
					>
						<Avatar>
							<AvatarImage src={user?.image ?? undefined} alt={user?.name ?? "User"} />
							<AvatarFallback>{initials}</AvatarFallback>
						</Avatar>
					</button>
				</DropdownMenuTrigger>

				<DropdownMenuContent align="end" className="w-52">
					{user && (
						<>
							<DropdownMenuLabel className="flex flex-col gap-0.5">
								<span className="font-medium">{user.name}</span>
								<span className="text-xs font-normal text-muted-foreground">{user.email}</span>
							</DropdownMenuLabel>
							<DropdownMenuSeparator />
						</>
					)}
					<DropdownMenuItem>
						<UserIcon />
						Account
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem variant="destructive" onSelect={handleLogout}>
						<LogOutIcon />
						Log out
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</header>
	);
}
