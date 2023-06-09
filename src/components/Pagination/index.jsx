import React from 'react'
import ReactPaginate from 'react-paginate'

import styles from './Pagination.module.scss'

export const Pagination = ({ currentPage, onChangePage }) => {
    return (
        <ReactPaginate
            className={styles.root}
            breakLabel="..."
            nextLabel=">"
            previousLabel="<"
            onPageChange={(event) => onChangePage(event.selected + 1)}
            pageRangeDisplayed={4}
            forcePage={currentPage - 1}
            pageCount={3}
            renderOnZeroPageCount={null}
        />
    )
}
