import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboard } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';

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

const CopyNotification = styled.div`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #4CAF50; /* Green background */
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  z-index: 1001; /* Above modals */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  opacity: ${(props) => (props.show ? 1 : 0)};
  transition: opacity 0.5s ease-in-out;
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
  const [currentPage, setCurrentPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [copySuccessMessage, setCopySuccessMessage] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/sign-in');
      return;
    }

    const queryParams = new URLSearchParams(location.search);
    const page = parseInt(queryParams.get('page') || '0', 10);
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  }, [isAuthenticated, navigate, location.search]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.get(`${API_BASE_URL}/submission/get-all?page=${currentPage}&limit=${SUBMISSIONS_PER_PAGE}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setSubmissions(response.data.content);
        setTotalElements(response.data.totalElements);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        console.error('Ошибка при загрузке отправленных решений:', err);
        setError(err.message || 'Не удалось загрузить отправленные решения.');
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [currentPage, isAuthenticated, API_BASE_URL]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    navigate(`?page=${newPage}`);
  };

  const openCodeModal = (submissionId) => {
    const submission = submissions.find((sub) => sub.submissionId === submissionId);
    setSelectedSubmission(submission);
    setCopySuccessMessage('');
  };

  const closeCodeModal = () => {
    setSelectedSubmission(null);
  };

  const copyToClipboard = async () => {
    if (selectedSubmission && selectedSubmission.sourceCode) {
      try {
        await navigator.clipboard.writeText(selectedSubmission.sourceCode);
        setCopySuccessMessage('Скопировано!');
        setTimeout(() => setCopySuccessMessage(''), 2000);
      } catch (err) {
        console.error('Не удалось скопировать код:', err);
        setCopySuccessMessage('Ошибка');
      }
    }
  };

  if (loading) {
    return <Container>Загрузка состояния системы...</Container>;
  }

  if (error) {
    return <Container>Ошибка загрузки состояния системы: {error}</Container>;
  }

  return (
    <Container>
      <Title>Состояние системы</Title>
      {submissions.length > 0 ? (
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
              {submissions.map((submission) => (
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
                disabled={currentPage === 0}
              >
                Назад
              </PageButton>
              {(() => {
                const buttons = [];
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

                if (startPage > 0) {
                  buttons.push(
                    <PageButton key={0} onClick={() => handlePageChange(0)}>
                      1
                    </PageButton>
                  );
                  if (startPage > 1) {
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
                      {i + 1}
                    </PageButton>
                  );
                }

                if (endPage < totalPages - 1) {
                  if (endPage < totalPages - 2) {
                    buttons.push(<span key="end-ellipsis" style={{ margin: '0 0.25rem' }}>...</span>);
                  }
                  buttons.push(
                    <PageButton key={totalPages - 1} onClick={() => handlePageChange(totalPages - 1)}>
                      {totalPages}
                    </PageButton>
                  );
                }
                return buttons;
              })()}
              <PageButton
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
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
                <CopyButton onClick={copyToClipboard} title={copySuccessMessage || 'Копировать'}>
                  <FontAwesomeIcon icon={faClipboard} />
                </CopyButton>
              </CodeBlock>
            </div>
          </Modal>
        </ModalOverlay>
      )}

      {copySuccessMessage && (
        <CopyNotification show={!!copySuccessMessage}>
          {copySuccessMessage}
        </CopyNotification>
      )}
    </Container>
  );
}

export default SystemStatusPage;
