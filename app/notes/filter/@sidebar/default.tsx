import Link from "next/link";
import css from "./SidebarNotes.module.css";

const TAGS = ["All", "Todo", "Work", "Personal", "Meeting", "Shopping"] as const;

export default function SidebarNotes() {
    return (
        <ul className={css.menuList}>
            {TAGS.map((t) => (
                <li key={t} className={css.menuItem}>
                    <Link className={css.menuLink} href={`/notes/filter/${t}`}>
                        {t}
                    </Link>
                </li>
            ))}
        </ul>
    );
}
