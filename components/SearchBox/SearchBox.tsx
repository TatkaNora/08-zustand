"use client";
import { ChangeEvent } from 'react';
import css from './SearchBox.module.css';

export interface SearchBoxProps {
    value: string;
    onChange: (value: string) => void;
}

export default function SearchBox({ value, onChange }: SearchBoxProps) {
    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        onChange(e.target.value);
    }

    return (
        <input
            className={css.input}
            type="text"
            placeholder="Search notes"
            value={value}
            onChange={handleChange}
        />
    );
}
