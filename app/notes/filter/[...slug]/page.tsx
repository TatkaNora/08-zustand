import { dehydrate, QueryClient } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import HydrateClient from "@/components/TanStackProvider/HydrateClient";
import NotesClient from "./Notes.client";

const PER_PAGE = 12;

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

