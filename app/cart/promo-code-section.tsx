"use client";

import { ChevronDown, Tag, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { type PromoCode, validatePromoCode } from "@/lib/promo-codes";

export function PromoCodeSection({ onPromoApplied }: { onPromoApplied: (promo: PromoCode | null) => void }) {
	const [isOpen, setIsOpen] = useState(false);
	const [code, setCode] = useState("");
	const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
	const [error, setError] = useState<string | null>(null);

	const handleApply = () => {
		setError(null);
		const promo = validatePromoCode(code);
		if (!promo) {
			setError("Invalid promo code");
			return;
		}
		setAppliedPromo(promo);
		onPromoApplied(promo);
		toast.success(`Promo code applied: ${promo.label}`);
		setCode("");
	};

	const handleRemove = () => {
		setAppliedPromo(null);
		onPromoApplied(null);
		setError(null);
	};

	if (appliedPromo) {
		return (
			<div className="flex items-center justify-between py-2">
				<div className="flex items-center gap-2">
					<Tag className="h-3.5 w-3.5 text-muted-foreground" />
					<Badge variant="secondary" className="gap-1.5">
						{appliedPromo.code}
						<button type="button" onClick={handleRemove} className="hover:text-foreground transition-colors">
							<X className="h-3 w-3" />
						</button>
					</Badge>
				</div>
				<span className="text-sm text-green-600">{appliedPromo.label}</span>
			</div>
		);
	}

	return (
		<Collapsible open={isOpen} onOpenChange={setIsOpen}>
			<CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
				<span className="flex items-center gap-2">
					<Tag className="h-3.5 w-3.5" />
					Have a promo code?
				</span>
				<ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
			</CollapsibleTrigger>
			<CollapsibleContent>
				<div className="flex gap-2 pt-2 pb-1">
					<Input
						value={code}
						onChange={(e) => {
							setCode(e.target.value);
							setError(null);
						}}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								e.preventDefault();
								handleApply();
							}
						}}
						placeholder="Enter code"
						className="h-9 text-sm uppercase"
					/>
					<Button
						variant="outline"
						size="sm"
						onClick={handleApply}
						disabled={!code.trim()}
						className="h-9 shrink-0"
					>
						Apply
					</Button>
				</div>
				{error && <p className="text-xs text-destructive mt-1">{error}</p>}
			</CollapsibleContent>
		</Collapsible>
	);
}
