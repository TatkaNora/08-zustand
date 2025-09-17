"use client";

import css from "./TagsMenu.module.css";
import Link from "next/link";
import { useState } from "react";

const TAG: string[] = [
    "All",
    "Personal",
    "Work",
    "Shopping",
    "Meeting",
    "Todo",
];

export default function TagsMenu() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    return (
        <div className={css.menuContainer}>
            <button className={css.menuButton} onClick={() => setIsOpen(!isOpen)}>
                Notes {isOpen ? "▴" : "▾"}
            </button>
            {isOpen && (
                <ul className={css.menuList}>
                    {TAG.map((t) => (
                        <li className={css.menuItem} key={t}>
                            <Link
                                href={`/notes/filter/${t}`}
                                className={css.menuLink}
                                onClick={() => setIsOpen(false)}
                            >
                                {t}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}