"use client";

import ReactPaginate from 'react-paginate';
import css from './Pagination.module.css';

export interface PaginationProps {
    pageCount: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

type PageChange = { selected: number };

export default function Pagination({
    pageCount,
    currentPage,
    onPageChange,
}: PaginationProps) {
    function handle(e: PageChange) {
        onPageChange(e.selected + 1);
    }

    return (
        <ReactPaginate
            pageCount={pageCount}
            forcePage={currentPage - 1}
            onPageChange={handle}
            containerClassName={css.pagination}
            activeClassName={css.active}
            previousLabel="‹"
            nextLabel="›"
            renderOnZeroPageCount={null}
        />
    );
}
