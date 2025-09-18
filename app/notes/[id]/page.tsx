import type { Metadata } from "next";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import HydrateClient from "@/components/TanStackProvider/HydrateClient";
import NoteDetailsClient from "./NoteDetails.client";
import { Note } from "@/types/note";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const { id } = await params;
    const note = await fetchNoteById(id) as Note;
    const src = (note.content ?? "").trim();
    const description = src.length > 140 ? `${src.slice(0, 140)}…` : src || "Note details";
    return {
        title: `${note.title} — NoteHub`,
        description,
        openGraph: {
            title: `${note.title} — NoteHub`,
            description,
            url: `/notes/${id}`,
            images: [
                {
                    url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
                    width: 1200,
                    height: 630,
                    alt: "NoteHub preview",
                },
            ],
        },
        alternates: { canonical: `/notes/${id}` },
    };
}

export default async function NoteDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const qc = new QueryClient();
    await qc.prefetchQuery({
        queryKey: ["note", id],
        queryFn: () => fetchNoteById(id),
    });
    const state = dehydrate(qc);
    return (
        <HydrateClient state={state}>
            <NoteDetailsClient />
        </HydrateClient>
    );
}
