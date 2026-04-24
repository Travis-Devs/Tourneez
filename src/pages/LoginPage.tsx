import { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { authClient } from "#/lib/auth-client";

type Mode = "signin" | "signup";

const PASSWORD_RULES = [
	{ label: "At least 8 characters", test: (p: string) => p.length >= 8 },
	{ label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
	{ label: "One lowercase letter", test: (p: string) => /[a-z]/.test(p) },
	{ label: "One number", test: (p: string) => /[0-9]/.test(p) },
];

export function LoginPage() {
	const router = useRouter();
	const [mode, setMode] = useState<Mode>("signin");
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	function switchMode(next: Mode) {
		setMode(next);
		setError(null);
	}

	const passwordRulesMet = PASSWORD_RULES.every((r) => r.test(password));

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (isSignUp && !passwordRulesMet) return;
		setError(null);
		setLoading(true);

		if (mode === "signin") {
			const { error } = await authClient.signIn.email({ email, password });
			if (error) {
				setError(error.message ?? "Sign in failed");
				setLoading(false);
			} else {
				router.navigate({ to: "/dashboard" });
			}
		} else {
			const { error } = await authClient.signUp.email({ name, email, password });
			if (error) {
				setError(error.message ?? "Registration failed");
				setLoading(false);
			} else {
				router.navigate({ to: "/dashboard" });
			}
		}
	}

	async function handleGoogleLogin() {
		setError(null);
		const { error } = await authClient.signIn.social({
			provider: "google",
			callbackURL: "/dashboard",
		});
		if (error) {
			setError(error.message ?? "Google sign-in failed");
		}
	}

	const isSignUp = mode === "signup";

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<div className="w-full max-w-sm bg-white rounded-2xl shadow-md p-8 space-y-6">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">
						{isSignUp ? "Create a Tourneez account" : "Sign in to your Tourneez account"}
					</h1>
				</div>

				{/* Mode toggle */}
				<div className="flex rounded-lg border border-gray-200 p-1 gap-1">
					<button
						type="button"
						onClick={() => switchMode("signin")}
						className={`flex-1 rounded-md py-1.5 text-sm font-medium transition-colors ${
							!isSignUp
								? "bg-indigo-600 text-white shadow-sm"
								: "text-gray-500 hover:text-gray-700"
						}`}
					>
						Sign in
					</button>
					<button
						type="button"
						onClick={() => switchMode("signup")}
						className={`flex-1 rounded-md py-1.5 text-sm font-medium transition-colors ${
							isSignUp
								? "bg-indigo-600 text-white shadow-sm"
								: "text-gray-500 hover:text-gray-700"
						}`}
					>
						Register
					</button>
				</div>

				{error && (
					<div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-4">
					{isSignUp && (
						<div className="space-y-1">
							<label htmlFor="name" className="block text-sm font-medium text-gray-700">
								Name
							</label>
							<input
								id="name"
								type="text"
								autoComplete="name"
								required
								value={name}
								onChange={(e) => setName(e.target.value)}
								className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
								placeholder="Your name"
							/>
						</div>
					)}

					<div className="space-y-1">
						<label htmlFor="email" className="block text-sm font-medium text-gray-700">
							Email
						</label>
						<input
							id="email"
							type="email"
							autoComplete="email"
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
							placeholder="you@example.com"
						/>
					</div>

					<div className="space-y-1">
						<label htmlFor="password" className="block text-sm font-medium text-gray-700">
							Password
						</label>
						<input
							id="password"
							type="password"
							autoComplete={isSignUp ? "new-password" : "current-password"}
							required
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
							placeholder="••••••••"
						/>
						{isSignUp && (
							<ul className="mt-2 space-y-1.5">
								{PASSWORD_RULES.map((rule) => {
									const met = rule.test(password);
									return (
										<li
											key={rule.label}
											className={`flex items-center gap-1.5 text-xs font-medium ${met ? "text-green-600" : "text-red-500"}`}
										>
											{met ? <CheckIcon /> : <CrossIcon />}
											{rule.label}
										</li>
									);
								})}
							</ul>
						)}
					</div>

					<button
						type="submit"
						disabled={loading || (isSignUp && !passwordRulesMet)}
						className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
					>
						{loading
							? isSignUp
								? "Creating account…"
								: "Signing in…"
							: isSignUp
								? "Create account"
								: "Sign in"}
					</button>
				</form>

				<div className="relative">
					<div className="absolute inset-0 flex items-center">
						<div className="w-full border-t border-gray-200" />
					</div>
					<div className="relative flex justify-center text-xs text-gray-400">
						<span className="bg-white px-2">or</span>
					</div>
				</div>

				<button
					type="button"
					onClick={handleGoogleLogin}
					className="w-full flex items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
				>
					<GoogleIcon />
					Continue with Google
				</button>
			</div>
		</div>
	);
}

function CheckIcon() {
	return (
		<svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
			<circle cx="6.5" cy="6.5" r="6.5" fill="currentColor" opacity=".15" />
			<path
				d="M3.5 6.5l2 2 4-4"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

function CrossIcon() {
	return (
		<svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
			<circle cx="6.5" cy="6.5" r="6.5" fill="currentColor" opacity=".15" />
			<path
				d="M4.5 4.5l4 4M8.5 4.5l-4 4"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
		</svg>
	);
}

function GoogleIcon() {
	return (
		<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
			<path
				fill="#4285F4"
				d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
			/>
			<path
				fill="#34A853"
				d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
			/>
			<path
				fill="#FBBC05"
				d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"
			/>
			<path
				fill="#EA4335"
				d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58Z"
			/>
		</svg>
	);
}
