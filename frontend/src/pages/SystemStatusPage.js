import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboard } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';

const Container = styled.div`
  padding: 2rem;
  background-color: #111;
  color: #eee;
`;

const Title = styled.h1`
  margin-bottom: 1rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 2rem;
`;

const TableHead = styled.thead`
  background-color: #333;
`;

const TableHeader = styled.th`
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #555;
`;

const TableBody = styled.tbody`
  tr:nth-child(even) {
    background-color: #222;
  }
`;

const TableRow = styled.tr`
  &:hover {
    background-color: #444;
  }
`;

const TableCell = styled.td`
  padding: 0.75rem;
  border-bottom: 1px solid #555;
`;

const SubmissionIdLink = styled.span`
  color: #007bff;
  text-decoration: underline;
  cursor: pointer;

  &:hover {
    color: #0056b3;
  }
`;

const ProblemIdLink = styled(Link)`
  color: #007bff;
  text-decoration: underline;

  &:hover {
    color: #0056b3;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  flex-wrap: wrap; /* Added for better responsiveness */
  gap: 0.25rem;
`;

const PageButton = styled.button`
  background-color: #444;
  color: #eee;
  border: none;
  padding: 0.5rem 1rem;
  margin: 0 0.25rem;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #555;
  }

  &[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  min-width: 2.5rem; /* Ensure buttons have a minimum width */
  text-align: center; /* Center the page number */
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background-color: #333;
  color: #eee;
  padding: 2rem;
  border-radius: 5px;
  max-width: 80%;
  max-height: 80%;
  overflow-y: auto;
  position: relative;
`;

const ModalTitle = styled.h2`
  margin-top: 0;
  margin-bottom: 1rem;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  color: #eee;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;

  &:hover {
    color: #aaa;
  }
`;

const CodeBlock = styled.pre`
  background-color: #222;
  padding: 1rem;
  border-radius: 5px;
  overflow-x: auto;
  white-space: pre-wrap;
  position: relative; /* Для позиционирования кнопки копирования */
`;

const CopyButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #5cb85c;
  color: #fff;
  border: none;
  padding: 0.3rem 0.5rem; /* Уменьшаем padding */
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.8rem;
  line-height: 1; /* Убираем лишнюю высоту из-за текста */
  width: auto; /* Автоматическая ширина под иконку */
  height: auto; /* Автоматическая высота под иконку */
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: #4cae4c;
  }

  svg {
    font-size: 1rem; /* Размер иконки */
  }
`;

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const SUBMISSIONS_PER_PAGE = 50;

const compilerIdToLanguage = {
  63: 'JavaScript',
  54: 'C++',
  62: 'Java',
  71: 'Python',
};

function SystemStatusPage({ isAuthenticated }) {
  const [submissions, setSubmissions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalSubmissions, setTotalSubmissions] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [copySuccess, setCopySuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/sign-in');
      return;
    }

    const fetchSubmissions = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.get(`${API_BASE_URL}/submission/get-all`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setSubmissions(response.data.submissions);
        setTotalSubmissions(response.data.submissions.length);
      } catch (err) {
        console.error('Ошибка при загрузке отправленных решений:', err);
        setError(err.message || 'Не удалось загрузить отправленные решения.');
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [isAuthenticated, navigate]);

  const startIndex = (currentPage - 1) * SUBMISSIONS_PER_PAGE;
  const endIndex = startIndex + SUBMISSIONS_PER_PAGE;
  const currentSubmissions = submissions.slice(startIndex, endIndex);
  const totalPages = Math.ceil(totalSubmissions / SUBMISSIONS_PER_PAGE);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const openCodeModal = (submissionId) => {
    const submission = submissions.find((sub) => sub.submissionId === submissionId);
    setSelectedSubmission(submission);
    setCopySuccess('');
  };

  const closeCodeModal = () => {
    setSelectedSubmission(null);
  };

  const copyToClipboard = async () => {
    if (selectedSubmission && selectedSubmission.sourceCode) {
      try {
        await navigator.clipboard.writeText(selectedSubmission.sourceCode);
        setCopySuccess('Скопировано!');
        setTimeout(() => setCopySuccess(''), 2000);
      } catch (err) {
        console.error('Не удалось скопировать код:', err);
        setCopySuccess('Ошибка');
      }
    }
  };

  if (loading) {
    return <div>Загрузка состояния системы...</div>;
  }

  if (error) {
    return <div>Ошибка загрузки состояния системы: {error}</div>;
  }

  return (
    <Container>
      <Title>Состояние системы</Title>
      {currentSubmissions.length > 0 ? (
        <>
          <Table>
            <TableHead>
              <tr>
                <TableHeader>ID отправки</TableHeader>
                <TableHeader>Язык</TableHeader>
                <TableHeader>Автор</TableHeader>
                <TableHeader>ID задачи</TableHeader>
                <TableHeader>Статус</TableHeader>
                <TableHeader>Тест</TableHeader>
                <TableHeader>Время</TableHeader>
                <TableHeader>Память</TableHeader>
                <TableHeader>Время отправки</TableHeader>
              </tr>
            </TableHead>
            <TableBody>
              {currentSubmissions.map((submission) => (
                <TableRow key={submission.submissionId}>
                  <TableCell>
                    <SubmissionIdLink onClick={() => openCodeModal(submission.submissionId)}>
                      {submission.submissionId}
                    </SubmissionIdLink>
                  </TableCell>
                  <TableCell>{compilerIdToLanguage[submission.compilerId] || 'N/A'}</TableCell>
                  <TableCell>{submission.username || 'N/A'}</TableCell>
                  <TableCell>
                    <ProblemIdLink to={`/problem/${submission.problemId}`}>
                      {submission.problemId || 'N/A'}
                    </ProblemIdLink>
                  </TableCell>
                  <TableCell>{submission.status}</TableCell>
                  <TableCell>{submission.numberOfTestcase !== null ? submission.numberOfTestcase : 'N/A'}</TableCell>
                  <TableCell>{submission.time !== null ? submission.time.toFixed(3) : 'N/A'}</TableCell>
                  <TableCell>{submission.memory !== null ? submission.memory.toFixed(0) : 'N/A'}</TableCell>
                  <TableCell>{new Date(submission.created).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {totalPages > 1 && (
            <Pagination>
              <PageButton
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Назад
              </PageButton>
              {/* Dynamic page buttons */}
              {(() => {
                const buttons = [];
                const maxButtons = 5;
                let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
                let endPage = Math.min(totalPages, currentPage + Math.ceil(maxButtons / 2) - 1);

                if (endPage - startPage + 1 < maxButtons) {
                  if (startPage === 1) {
                    endPage = Math.min(totalPages, maxButtons);
                  } else {
                    startPage = Math.max(1, totalPages - maxButtons + 1);
                  }
                }

                if (startPage > 1) {
                  buttons.push(
                    <PageButton key={1} onClick={() => handlePageChange(1)}>
                      1
                    </PageButton>
                  );
                  if (startPage > 2) {
                    buttons.push(<span key="start-ellipsis" style={{ margin: '0 0.25rem' }}>...</span>);
                  }
                }

                for (let i = startPage; i <= endPage; i++) {
                  buttons.push(
                    <PageButton
                      key={i}
                      onClick={() => handlePageChange(i)}
                      aria-current={currentPage === i ? 'page' : undefined}
                      style={{ fontWeight: currentPage === i ? 'bold' : 'normal' }}
                    >
                      {i}
                    </PageButton>
                  );
                }

                if (endPage < totalPages) {
                  if (endPage < totalPages - 1) {
                    buttons.push(<span key="end-ellipsis" style={{ margin: '0 0.25rem' }}>...</span>);
                  }
                  buttons.push(
                    <PageButton key={totalPages} onClick={() => handlePageChange(totalPages)}>
                      {totalPages}
                    </PageButton>
                  );
                }
                return buttons;
              })()}
              <PageButton
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Вперед
              </PageButton>
            </Pagination>
          )}
        </>
      ) : (
        <p>Нет отправленных решений.</p>
      )}

      {selectedSubmission && (
        <ModalOverlay onClick={closeCodeModal}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Код решения</ModalTitle>
            <CloseButton onClick={closeCodeModal}>&times;</CloseButton>
            <p><strong>ID задачи:</strong> {selectedSubmission.problemId || 'N/A'}</p>
            <p><strong>ID отправки:</strong> {selectedSubmission.submissionId}</p>
            <p><strong>Пользователь:</strong> {selectedSubmission.username || 'N/A'}</p>
            <p><strong>Язык:</strong> {compilerIdToLanguage[selectedSubmission.compilerId] || 'N/A'}</p>
            <p><strong>Статус:</strong> {selectedSubmission.status}</p>
            <p><strong>Время (сек):</strong> {selectedSubmission.time !== null ? selectedSubmission.time.toFixed(3) : 'N/A'}</p>
            <p><strong>Память (КБ):</strong> {selectedSubmission.memory !== null ? selectedSubmission.memory.toFixed(0) : 'N/A'}</p>
            {selectedSubmission.numberOfTestcase !== null && (
              <p><strong>Результаты тестирования:</strong> {selectedSubmission.status === 'ACCEPTED' ? 'Все тесты пройдены' : `Тест #${selectedSubmission.numberOfTestcase} завершился с ошибкой`}</p>
            )}
            <div>
              <strong>Исходный код:</strong>
              <CodeBlock>
                {selectedSubmission.sourceCode}
                <CopyButton onClick={copyToClipboard} title={copySuccess || 'Копировать'}>
                  <FontAwesomeIcon icon={faClipboard} />
                </CopyButton>
              </CodeBlock>
            </div>
          </Modal>
        </ModalOverlay>
      )}
    </Container>
  );
}

export default SystemStatusPage;
