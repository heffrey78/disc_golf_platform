import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import forumService from '../services/forumService';

interface Subforum {
  id: number;
  name: string;
  description: string;
}

interface PaginatedResponse {
  subforums: Subforum[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

interface ForumSubforumsProps {
  categoryId: number;
  isAdmin: boolean;
}

const ForumSubforums: React.FC<ForumSubforumsProps> = ({ categoryId, isAdmin }) => {
  const [subforums, setSubforums] = useState<Subforum[]>([]);
  const [newSubforumName, setNewSubforumName] = useState('');
  const [newSubforumDescription, setNewSubforumDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSubforums = useCallback(async (page: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const response: PaginatedResponse = await forumService.getSubforumsByCategory(categoryId, page);
      setSubforums(response.subforums);
      setTotalPages(response.totalPages);
    } catch (error) {
      setError('Failed to fetch subforums. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    fetchSubforums(currentPage);
  }, [fetchSubforums, currentPage]);

  const handleCreateSubforum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      setError('You do not have permission to create a subforum.');
      return;
    }
    try {
      setError(null);
      await forumService.createSubforum(newSubforumName, newSubforumDescription, categoryId);
      setNewSubforumName('');
      setNewSubforumDescription('');
      fetchSubforums(currentPage);
    } catch (error) {
      setError('Failed to create subforum. Please try again.');
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Subforums</h2>
      {error && <div className="error-message">{error}</div>}
      <ul>
        {subforums.map((subforum) => (
          <li key={subforum.id}>
            <Link to={`/forum/subforum/${subforum.id}`}>
              <h3>{subforum.name}</h3>
            </Link>
            <p>{subforum.description}</p>
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
      {isAdmin && (
        <>
          <h3>Create New Subforum</h3>
          <form onSubmit={handleCreateSubforum}>
            <input
              type="text"
              value={newSubforumName}
              onChange={(e) => setNewSubforumName(e.target.value)}
              placeholder="Subforum Name"
              required
            />
            <input
              type="text"
              value={newSubforumDescription}
              onChange={(e) => setNewSubforumDescription(e.target.value)}
              placeholder="Subforum Description"
              required
            />
            <button type="submit">Create Subforum</button>
          </form>
        </>
      )}
    </div>
  );
};

export default ForumSubforums;