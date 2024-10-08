import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import forumService from '../services/forumService';

interface Thread {
  id: number;
  title: string;
  author: {
    username: string;
  };
  createdAt: string;
}

interface PaginatedResponse {
  threads: Thread[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

interface ForumThreadsProps {
  subforumId: number;
  isAdmin: boolean;
}

const ForumThreads: React.FC<ForumThreadsProps> = ({ subforumId, isAdmin }) => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [newThreadContent, setNewThreadContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchThreads(currentPage);
  }, [subforumId, currentPage]);

  const fetchThreads = async (page: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const response: PaginatedResponse = await forumService.getSubforum(subforumId, page);
      setThreads(response.threads);
      setTotalPages(response.totalPages);
    } catch (error) {
      setError('Failed to fetch threads. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      await forumService.createThread(newThreadTitle, newThreadContent, subforumId);
      setNewThreadTitle('');
      setNewThreadContent('');
      fetchThreads(currentPage);
    } catch (error) {
      setError('Failed to create thread. Please try again.');
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleDeleteThread = async (threadId: number) => {
    if (!isAdmin) {
      setError('You do not have permission to delete threads.');
      return;
    }
    try {
      setError(null);
      await forumService.deleteThread(threadId);
      fetchThreads(currentPage);
    } catch (error) {
      setError('Failed to delete thread. Please try again.');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Threads</h2>
      {error && <div className="error-message">{error}</div>}
      <ul>
        {threads.map((thread) => (
          <li key={thread.id}>
            <Link to={`/forum/posts/${thread.id}`}>
              <h3>{thread.title}</h3>
            </Link>
            <p>Author: {thread.author.username}</p>
            <p>Created: {new Date(thread.createdAt).toLocaleString()}</p>
            {isAdmin && (
              <button onClick={() => handleDeleteThread(thread.id)}>Delete Thread</button>
            )}
          </li>
        ))}
      </ul>
      <div className="pagination">
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
      <h3>Create New Thread</h3>
      <form onSubmit={handleCreateThread}>
        <input
          type="text"
          value={newThreadTitle}
          onChange={(e) => setNewThreadTitle(e.target.value)}
          placeholder="Thread Title"
          required
        />
        <textarea
          value={newThreadContent}
          onChange={(e) => setNewThreadContent(e.target.value)}
          placeholder="Thread Content"
          required
        />
        <button type="submit">Create Thread</button>
      </form>
    </div>
  );
};

export default ForumThreads;