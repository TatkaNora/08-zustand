import type { Metadata } from "next";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import HydrateClient from "@/components/TanStackProvider/HydrateClient";
import NotesClient from "./Notes.client";

const PER_PAGE = 12;

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const segs = slug?.length ? slug : ["All"];
    const filterTitle = segs.join(" / ");
    const path = `/notes/filter/${segs.join("/")}`;
    return {
        title: `Notes — ${filterTitle} — NoteHub`,
        description: `Browse notes filtered by: ${filterTitle}.`,
        openGraph: {
            title: `Notes — ${filterTitle} — NoteHub`,
            description: `Browse notes filtered by: ${filterTitle}.`,
            url: path,
            images: [
                {
                    url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
                    width: 1200,
                    height: 630,
                    alt: "NoteHub preview",
                },
            ],
        },
        alternates: { canonical: path },
    };
}

export default async function NotesFilteredPage({
    params,
}: {
    params: Promise<{ slug?: string[] }>;
}) {
    const { slug } = await params;
    const tag = slug && slug.length > 0 ? slug[0] : "All";
    const qc = new QueryClient();
    await qc.prefetchQuery({
        queryKey: ["notes", 1, PER_PAGE, "", tag],
        queryFn: () => fetchNotes(1, "", tag),
    });
    const state = dehydrate(qc);
    return (
        <HydrateClient state={state}>
            <NotesClient tag={tag} />
        </HydrateClient>
    );
}
