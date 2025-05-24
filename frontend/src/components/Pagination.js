import React from 'react';
import styled from 'styled-components';

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
  flex-wrap: wrap;
`;

const PageButton = styled.button`
  background-color: #444;
  color: #eee;
  border: none;
  padding: 0.5rem 0.75rem;
  border-radius: 3px;
  cursor: pointer;
  min-width: 2.5rem;
  text-align: center;

  &:hover {
    background-color: #555;
  }

  &.active {
    background-color: #007bff;
    font-weight: bold;
  }

  &[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

function Pagination({ currentPage, totalPages, onPageChange }) {
  const maxButtons = 5;
  let startPage = Math.max(0, currentPage - Math.floor(maxButtons / 2));
  let endPage = Math.min(totalPages - 1, currentPage + Math.ceil(maxButtons / 2) - 1);

  if (endPage - startPage + 1 < maxButtons) {
    if (startPage === 0) {
      endPage = Math.min(totalPages - 1, maxButtons - 1);
    } else {
      startPage = Math.max(0, totalPages - maxButtons);
    }
  }

  const pageNumbersToDisplay = [];
  pageNumbersToDisplay.push(
    <PageButton
      key="prev"
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 0}
    >
      Назад
    </PageButton>
  );

  if (startPage > 0) {
    pageNumbersToDisplay.push(
      <PageButton key={0} onClick={() => onPageChange(0)} className={0 === currentPage ? 'active' : ''}>
        1
      </PageButton>
    );
    if (startPage > 1) {
      pageNumbersToDisplay.push(<span key="start-ellipsis" style={{ margin: '0 0.25rem' }}>...</span>);
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbersToDisplay.push(
      <PageButton
        key={i}
        onClick={() => onPageChange(i)}
        className={i === currentPage ? 'active' : ''}
      >
        {i + 1}
      </PageButton>
    );
  }

  if (endPage < totalPages - 1) {
    if (endPage < totalPages - 2) {
      pageNumbersToDisplay.push(<span key="end-ellipsis" style={{ margin: '0 0.25rem' }}>...</span>);
    }
    pageNumbersToDisplay.push(
      <PageButton key={totalPages - 1} onClick={() => onPageChange(totalPages - 1)} className={totalPages - 1 === currentPage ? 'active' : ''}>
        {totalPages}
      </PageButton>
    );
  }

  pageNumbersToDisplay.push(
    <PageButton
      key="next"
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === totalPages - 1}
    >
      Вперед
    </PageButton>
  );

  return (
    <PaginationContainer>
      {pageNumbersToDisplay}
    </PaginationContainer>
  );
}

export default Pagination;
