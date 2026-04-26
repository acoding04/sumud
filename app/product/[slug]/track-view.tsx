"use client";

import { useEffect, useRef } from "react";
import { trackRecentlyViewedAction } from "./track-view-action";

export function TrackView({ slug }: { slug: string }) {
	const tracked = useRef(false);
	useEffect(() => {
		if (!tracked.current) {
			tracked.current = true;
			trackRecentlyViewedAction(slug);
		}
	}, [slug]);
	return null;
}
