"use client";

import { PropsWithChildren, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import css from "./Modal.module.css";

export interface ModalProps {
    onClose: () => void;
}

export default function Modal({ children, onClose }: PropsWithChildren<ModalProps>) {
    const [container, setContainer] = useState<HTMLElement | null>(null);

    useEffect(() => {
        if (typeof document === "undefined") return;
        let el = document.getElementById("modal-root") as HTMLElement | null;
        if (!el) {
            el = document.createElement("div");
            el.id = "modal-root";
            document.body.appendChild(el);
        }
        setContainer(el);
        function onKey(e: KeyboardEvent) {
            if (e.key === "Escape") onClose();
        }
        window.addEventListener("keydown", onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = prev;
        };
    }, [onClose]);

    function onBackdrop(e: React.MouseEvent<HTMLDivElement>) {
        if (e.target === e.currentTarget) onClose();
    }

    if (!container) return null;

    return createPortal(
        <div className={css.backdrop} role="dialog" aria-modal="true" onClick={onBackdrop}>
            <div className={css.modal}>{children}</div>
        </div>,
        container
    );
}
