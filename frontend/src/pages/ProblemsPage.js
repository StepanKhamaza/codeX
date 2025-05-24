import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import ProblemItem from '../components/ProblemItem';
import Pagination from '../components/Pagination';
import { useNavigate, useLocation } from 'react-router-dom';

const Container = styled.div`
  padding: 2rem;
  background-color: #111;
  color: #eee;
  min-height: 100vh;
`;

const ProblemsList = styled.div`
  margin-top: 1rem;
`;

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const PROBLEMS_PER_PAGE = 10;

function ProblemsPage() {
  const [problems, setProblems] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const page = parseInt(queryParams.get('page') || '0', 10);
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  }, [location.search]);

  useEffect(() => {
    const fetchProblems = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get(`${API_BASE_URL}/problems?page=${currentPage}&limit=${PROBLEMS_PER_PAGE}`);
        
        setProblems(response.data.content);
        setTotalElements(response.data.totalElements);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error('Ошибка при загрузке задач:', error);
        setError('Не удалось загрузить список задач.');
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, [currentPage, API_BASE_URL]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    navigate(`?page=${pageNumber}`);
  };

  if (loading) {
    return <Container>Загрузка списка задач...</Container>;
  }

  if (error) {
    return <Container>Ошибка: {error}</Container>;
  }

  return (
    <Container>
      <h1>Список задач</h1>
      <ProblemsList>
        {problems.length > 0 ? (
          problems.map((problem) => (
            <ProblemItem key={problem.problemId} problem={problem} />
          ))
        ) : (
          <p>Задачи не найдены.</p>
        )}
      </ProblemsList>
      {totalPages > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </Container>
  );
}

export default ProblemsPage;
