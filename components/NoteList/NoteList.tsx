"use client";

import Link from "next/link";
import { MouseEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "@/lib/api";
import { Note } from "@/types/note";
import css from "./NoteList.module.css";

export interface NoteListProps {
    notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
    const qc = useQueryClient();
    const { mutateAsync, isPending } = useMutation({ mutationFn: deleteNote });

    async function onDelete(e: MouseEvent<HTMLButtonElement>, id: string) {
        e.currentTarget.disabled = true;
        await mutateAsync(id);
        await qc.invalidateQueries({ queryKey: ["notes"] });
    }

    return (
        <ul className={css.list}>
            {notes.map((n) => (
                <li key={n.id} className={css.listItem}>
                    <h2 className={css.title}>{n.title}</h2>
                    <p className={css.content}>{n.content}</p>
                    <div className={css.footer}>
                        <span className={css.tag}>{n.tag}</span>
                        <Link href={`/notes/${n.id}`}>View details</Link>
                        <button className={css.button} onClick={(e) => onDelete(e, n.id)} disabled={isPending}>
                            Delete
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    );
}
