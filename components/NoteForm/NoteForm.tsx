'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import css from './NoteForm.module.css'
import { useNoteStore, initialDraft } from '@/lib/store/noteStore'
import { createNote, CreateNotePayload } from '@/lib/api'
import type { NoteTag } from '@/types/note'

export interface NoteFormProps {
    onDone?: () => void
}

const TAG_OPTIONS: NoteTag[] = ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping']

export default function NoteForm({ onDone }: NoteFormProps) {
    const router = useRouter()
    const queryClient = useQueryClient()

    const draft = useNoteStore(s => s.draft)
    const setDraft = useNoteStore(s => s.setDraft)
    const clearDraft = useNoteStore(s => s.clearDraft)

    const [title, setTitle] = useState(draft.title ?? initialDraft.title)
    const [content, setContent] = useState(draft.content ?? initialDraft.content)
    const [tag, setTag] = useState<NoteTag>((draft.tag as NoteTag) ?? (initialDraft.tag as NoteTag))
    const [errors, setErrors] = useState<{ title?: string; content?: string; tag?: string }>({})

    useEffect(() => {
        setDraft({ title, content, tag })
    }, [title, content, tag, setDraft])

    const isValid = useMemo(() => {
        const e: typeof errors = {}
        const t = title.trim()
        if (!t) e.title = 'Title is required'
        else if (t.length < 3) e.title = 'Title must be at least 3 characters'
        else if (t.length > 50) e.title = 'Title must be at most 50 characters'
        if (content.length > 500) e.content = 'Content must be at most 500 characters'
        if (!TAG_OPTIONS.includes(tag)) e.tag = 'Invalid tag'
        setErrors(e)
        return Object.keys(e).length === 0
    }, [title, content, tag])

    const goBack = () => {
        if (onDone) onDone()
        else router.push('/notes/filter/All')
    }

    const mutation = useMutation({
        mutationFn: (payload: CreateNotePayload) => createNote(payload),
        onSuccess: async () => {
            clearDraft()
            await queryClient.invalidateQueries({ queryKey: ['notes'] })
            goBack()
        },
    })

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!isValid || mutation.isPending) return
        const payload: CreateNotePayload = {
            title: title.trim(),
            content: content.trim(),
            tag,
        }
        mutation.mutate(payload)
    }

    return (
        <form className={css.form} onSubmit={onSubmit} noValidate>
            <div className={css.formGroup}>
                <label htmlFor="title">Title</label>
                <input
                    id="title"
                    name="title"
                    className={css.input}
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                    minLength={3}
                    maxLength={50}
                />
                <span className={css.error} role="alert">{errors.title || ''}</span>
            </div>

            <div className={css.formGroup}>
                <label htmlFor="content">Content</label>
                <textarea
                    id="content"
                    name="content"
                    className={css.textarea}
                    rows={8}
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    maxLength={500}
                />
                <span className={css.error} role="alert">{errors.content || ''}</span>
            </div>

            <div className={css.formGroup}>
                <label htmlFor="tag">Tag</label>
                <select
                    id="tag"
                    name="tag"
                    className={css.select}
                    value={tag}
                    onChange={e => setTag(e.target.value as NoteTag)}
                >
                    {TAG_OPTIONS.map(t => (
                        <option key={t} value={t}>{t}</option>
                    ))}
                </select>
                <span className={css.error} role="alert">{errors.tag || ''}</span>
            </div>

            <div className={css.actions}>
                <button type="button" className={css.cancelButton} onClick={goBack} disabled={mutation.isPending}>
                    Cancel
                </button>
                <button type="submit" className={css.submitButton} disabled={mutation.isPending || !isValid}>
                    {mutation.isPending ? 'Creating…' : 'Create note'}
                </button>
            </div>
        </form>
    )
}
