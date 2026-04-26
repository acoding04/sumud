"use client";

import { LogOut, Package, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { logoutAction } from "@/app/(auth)/actions";
import { AppLink } from "@/components/app-link";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserButton({ user }: { user: { name: string; email: string } | null }) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	if (!user) {
		return (
			<AppLink
				href="/login"
				className="p-2 hover:bg-secondary rounded-full transition-colors"
				aria-label="Sign in"
			>
				<User className="w-6 h-6" />
			</AppLink>
		);
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					type="button"
					className="p-2 hover:bg-secondary rounded-full transition-colors relative"
					aria-label="Account menu"
				>
					<User className="w-6 h-6" />
					<span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#d2ab5a] rounded-full" />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-56">
				<div className="px-2 py-1.5">
					<p className="text-sm font-medium">{user.name}</p>
					<p className="text-xs text-muted-foreground">{user.email}</p>
				</div>
				<DropdownMenuSeparator />
				<DropdownMenuItem onSelect={() => router.push("/account")} className="cursor-pointer">
					<User className="mr-2 h-4 w-4" />
					My Account
				</DropdownMenuItem>
				<DropdownMenuItem onSelect={() => router.push("/account/orders")} className="cursor-pointer">
					<Package className="mr-2 h-4 w-4" />
					Orders
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					disabled={isPending}
					onSelect={() => {
						startTransition(async () => {
							await logoutAction();
						});
					}}
					className="cursor-pointer text-destructive focus:text-destructive"
				>
					<LogOut className="mr-2 h-4 w-4" />
					{isPending ? "Signing out..." : "Sign Out"}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
