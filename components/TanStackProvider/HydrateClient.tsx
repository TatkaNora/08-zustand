"use client";

import { HydrationBoundary, type DehydratedState } from "@tanstack/react-query";

export default function HydrateClient({
    state,
    children,
}: {
    state: DehydratedState;
    children: React.ReactNode;
}) {
    return <HydrationBoundary state={state}>{children}</HydrationBoundary>;
}
