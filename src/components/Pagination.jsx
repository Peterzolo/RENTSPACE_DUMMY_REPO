


// components/Pagination.js
import React from 'react';
import ReactPaginate from 'react-paginate';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export const Pagination = ({ pageCount, onPageChange, currentPage }) => {
    return (
        <ReactPaginate
            previousLabel={
                <span className="flex items-center justify-center p-2 bg-gray-200 rounded-full">
                    <ChevronLeftIcon className="w-5 h-5" />
                </span>
            }
            nextLabel={
                <span className="flex items-center justify-center p-2 bg-gray-200 rounded-full">
                    <ChevronRightIcon className="w-5 h-5" />
                </span>
            }
            breakLabel={"..."}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={onPageChange}
            containerClassName={"flex justify-center items-center space-x-2 mt-4"}
            pageClassName={"flex items-center justify-center rounded-full bg-gray-200 w-8 h-8 cursor-pointer"}
            pageLinkClassName={"text-sm font-medium text-gray-700"}
            previousClassName={"mr-2"}
            nextClassName={"ml-2"}
            activeClassName={"bg-[#145182] text-white"}
            disabledClassName={"opacity-50 cursor-not-allowed"}
            activeLinkClassName={"text-white font-bold"}
        />
    );
};


