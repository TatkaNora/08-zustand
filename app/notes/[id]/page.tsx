import { QueryClient, dehydrate } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import HydrateClient from "@/components/TanStackProvider/HydrateClient";
import NoteDetailsClient from "./NoteDetails.client";

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
