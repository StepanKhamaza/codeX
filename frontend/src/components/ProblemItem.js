import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Problem = styled.div`
  background-color: #333;
  color: #eee;
  padding: 1rem;
  margin-bottom: 0.5rem;
  border-radius: 5px;
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const ProblemId = styled.span`
  font-weight: bold;
  color: #007bff;
`;

const ProblemTitle = styled(Link)`
  flex-grow: 1;
  color: #eee;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
    color: #00aaff;
  }
`;

function ProblemItem({ problem }) {
  return (
    <Problem key={problem.problemId}>
      <ProblemId>{problem.problemId}.</ProblemId>
      <ProblemTitle to={`/problem/${problem.problemId}`}>{problem.title}</ProblemTitle>
    </Problem>
  );
}

export default ProblemItem;