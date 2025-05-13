import React from 'react';
import styled from 'styled-components';

const PaginationContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const PageButton = styled.button`
  background-color: #444;
  color: #eee;
  border: none;
  padding: 0.5rem 0.75rem;
  border-radius: 3px;
  cursor: pointer;

  &:hover {
    background-color: #555;
  }

  &.active {
    background-color: #007bff;
  }
`;

function Pagination({ currentPage, totalPages, onPageChange }) {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <PaginationContainer>
      {pageNumbers.map((number) => (
        <PageButton
          key={number}
          onClick={() => onPageChange(number)}
          className={number === currentPage ? 'active' : ''}
        >
          {number}
        </PageButton>
      ))}
    </PaginationContainer>
  );
}

export default Pagination;