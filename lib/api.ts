import axios from "axios";
import type { Note, NoteTag } from "@/types/note";

const LINK = "https://notehub-public.goit.study/api/notes";
const NOTEHUB_KEY = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

export interface NoteListResponse {
    notes: Note[];
    totalPages: number;
}

export interface CreateNotePayload {
    title: string;
    content: string;
    tag: NoteTag;
}

export interface DeleteNoteResponse {
    id: string;
}

function requireToken(): string {
    const key = NOTEHUB_KEY?.trim();
    if (!key) throw new Error("NEXT_PUBLIC_NOTEHUB_TOKEN is missing.");
    return key;
}

function authHeaders() {
    const token = requireToken();
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    } as const;
}

export async function fetchNotes(
    page: number,
    userQuery: string,
    tag?: string
): Promise<NoteListResponse> {
    const q = userQuery.trim();
    const params: Record<string, string | number> = { page, perPage: 12 };
    if (q) params.search = q;
    if (tag && tag !== "All") params.tag = tag;
    const res = await axios.get<NoteListResponse>(LINK, { params, headers: authHeaders() });
    return res.data;
}

export async function fetchNoteById(id: string): Promise<Note | null> {
    const res = await axios.get<Note>(`${LINK}/${id}`, { headers: authHeaders() });
    return res.data ?? null;
}

export async function createNote(payload: CreateNotePayload): Promise<Note> {
    const res = await axios.post<Note>(LINK, payload, { headers: authHeaders() });
    return res.data;
}

export async function deleteNote(id: string): Promise<DeleteNoteResponse> {
    const res = await axios.delete<DeleteNoteResponse>(`${LINK}/${id}`, { headers: authHeaders() });
    return res.data;
}
