import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import forumService from '../services/forumService';

interface Category {
  id: number;
  name: string;
  description: string;
}

interface PaginatedResponse {
  categories: Category[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

interface ForumCategoriesProps {
  isAdmin: boolean;
}

const ForumCategories: React.FC<ForumCategoriesProps> = ({ isAdmin }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCategories(currentPage);
  }, [currentPage]);

  const fetchCategories = async (page: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const response: PaginatedResponse = await forumService.getCategories(page);
      setCategories(response.categories);
      setTotalPages(response.totalPages);
    } catch (error) {
      setError('Failed to fetch categories. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      setError('You do not have permission to create a category.');
      return;
    }
    try {
      setError(null);
      await forumService.createCategory(newCategoryName, newCategoryDescription);
      setNewCategoryName('');
      setNewCategoryDescription('');
      fetchCategories(currentPage);
    } catch (error) {
      setError('Failed to create category. Please try again.');
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
      <h1>Forum Categories</h1>
      {error && <div className="error-message">{error}</div>}
      <ul>
        {categories.map((category) => (
          <li key={category.id}>
            <Link to={`/forum/subforum/${category.id}`}>
              <h2>{category.name}</h2>
            </Link>
            <p>{category.description}</p>
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
          <h2>Create New Category</h2>
          <form onSubmit={handleCreateCategory}>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Category Name"
              required
            />
            <input
              type="text"
              value={newCategoryDescription}
              onChange={(e) => setNewCategoryDescription(e.target.value)}
              placeholder="Category Description"
              required
            />
            <button type="submit">Create Category</button>
          </form>
        </>
      )}
    </div>
  );
};

export default ForumCategories;