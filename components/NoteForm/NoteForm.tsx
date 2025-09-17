"use client";

import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '@/lib/api';
import { NoteTag } from '@/types/note';
import css from './NoteForm.module.css';

export interface NoteFormProps {
    onDone: () => void;
}

const schema = Yup.object({
    title: Yup.string().min(3).max(50).required(),
    content: Yup.string().max(500),
    tag: Yup.mixed<NoteTag>().oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping']).required(),
});

export default function NoteForm({ onDone }: NoteFormProps) {
    const qc = useQueryClient();
    const { mutateAsync, isPending } = useMutation({ mutationFn: createNote });

    async function handleSubmit(values: { title: string; content: string; tag: NoteTag }) {
        await mutateAsync(values);
        await qc.invalidateQueries({ queryKey: ['notes'] });
        onDone();
    }

    return (
        <Formik
            initialValues={{ title: '', content: '', tag: 'Todo' as NoteTag }}
            validationSchema={schema}
            onSubmit={handleSubmit}
        >
            {({ errors, touched, isValid }) => (
                <Form className={css.form}>
                    <div className={css.formGroup}>
                        <label htmlFor="title">Title</label>
                        <Field id="title" name="title" type="text" className={css.input} />
                        <span className={css.error} role="alert">{touched.title && errors.title ? errors.title : ''}</span>
                    </div>

                    <div className={css.formGroup}>
                        <label htmlFor="content">Content</label>
                        <Field as="textarea" id="content" name="content" rows={8} className={css.textarea} />
                        <span className={css.error} role="alert">{touched.content && errors.content ? errors.content : ''}</span>
                    </div>

                    <div className={css.formGroup}>
                        <label htmlFor="tag">Tag</label>
                        <Field as="select" id="tag" name="tag" className={css.select}>
                            <option value="Todo">Todo</option>
                            <option value="Work">Work</option>
                            <option value="Personal">Personal</option>
                            <option value="Meeting">Meeting</option>
                            <option value="Shopping">Shopping</option>
                        </Field>
                        <span className={css.error} role="alert">{touched.tag && errors.tag ? String(errors.tag) : ''}</span>
                    </div>

                    <div className={css.actions}>
                        <button type="button" className={css.cancelButton} onClick={onDone}>
                            Cancel
                        </button>
                        <button type="submit" className={css.submitButton} disabled={!isValid || isPending}>
                            Create note
                        </button>
                    </div>
                </Form>
            )}
        </Formik>
    );
}
