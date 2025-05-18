import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import ProblemItem from '../components/ProblemItem';
import Pagination from '../components/Pagination';

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
const PROBLEMS_PER_PAGE = 50;

function ProblemsPage() {
  const [allProblems, setAllProblems] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {

	const fetchProblems = async () => {
	  setLoading(true);
	  setError('');
	  try {
		const response = await axios.get(`${API_BASE_URL}/problems`);
		setAllProblems(response.data.problems);
		setTotalCount(response.data.totalCount);
	  } catch (error) {
		console.error('Ошибка при загрузке задач:', error);
		setError('Не удалось загрузить список задач.');
	  } finally {
		setLoading(false);
	  }
	};

	fetchProblems();
  }, []);

  const startIndex = (currentPage - 1) * PROBLEMS_PER_PAGE;
  const endIndex = startIndex + PROBLEMS_PER_PAGE;
  const currentProblems = allProblems.slice(startIndex, endIndex);
  const totalPages = Math.ceil(allProblems.length / PROBLEMS_PER_PAGE);

  const handlePageChange = (pageNumber) => {
	setCurrentPage(pageNumber);
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
		{currentProblems.map((problem) => (
		  <ProblemItem key={problem.problemId} problem={problem} />
		))}
	  </ProblemsList>
	  {totalPages > 1 && (
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