"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useDebounce } from "use-debounce";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import SearchBox from "@/components/SearchBox/SearchBox";
import css from "./NotesClient.module.css";

const PER_PAGE = 12;

export default function NotesClient({ tag }: { tag: string }) {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [debouncedSearch] = useDebounce(search, 400);

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, tag]);

    const q = debouncedSearch.trim();

    const { data } = useQuery({
        queryKey: ["notes", page, PER_PAGE, q, tag],
        queryFn: () => fetchNotes(page, q, tag),
        placeholderData: keepPreviousData,
        refetchOnMount: false,
    });

    const totalPages = data?.totalPages ?? 0;
    const hasList = (data?.notes?.length ?? 0) > 0;

    return (
        <div className={css.app}>
            <header className={css.toolbar}>
                <SearchBox value={search} onChange={setSearch} />
                {totalPages > 1 && (
                    <Pagination
                        currentPage={page}
                        pageCount={totalPages}
                        onPageChange={(p) => setPage(p)}
                    />
                )}
                <Link href="/notes/action/create" className={css.button}>
                    Create note +
                </Link>
            </header>
            {hasList && <NoteList notes={data!.notes} />}
        </div>
    );
}

