"use client";

import { Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
	const [isPending, setIsPending] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsPending(true);

		// Simulate submission — wire up to a real endpoint when ready
		await new Promise((resolve) => setTimeout(resolve, 1000));

		setIsPending(false);
		toast.success("Message sent! We'll get back to you soon.");
		e.currentTarget.reset();
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
				<div className="space-y-2">
					<Label htmlFor="name">Name</Label>
					<Input id="name" name="name" placeholder="Your name" required />
				</div>
				<div className="space-y-2">
					<Label htmlFor="email">Email</Label>
					<Input id="email" name="email" type="email" placeholder="you@example.com" required />
				</div>
			</div>

			<div className="space-y-2">
				<Label htmlFor="subject">Subject</Label>
				<Input id="subject" name="subject" placeholder="What is this regarding?" required />
			</div>

			<div className="space-y-2">
				<Label htmlFor="message">Message</Label>
				<Textarea id="message" name="message" placeholder="Tell us more..." rows={6} required />
			</div>

			<Button type="submit" disabled={isPending} className="h-12 px-8 text-base">
				{isPending ? (
					"Sending..."
				) : (
					<>
						<Send className="mr-2 h-4 w-4" />
						Send Message
					</>
				)}
			</Button>
		</form>
	);
}
