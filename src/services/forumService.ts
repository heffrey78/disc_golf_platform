import axios, { AxiosError } from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

interface ErrorResponse {
  message: string;
  errors?: { [key: string]: string }[];
}

const handleError = (error: AxiosError<ErrorResponse>, context: string) => {
  if (error.response) {
    console.error(`Error in ${context}:`, error.response.data);
    if (error.response.data.errors) {
      const errorMessages = error.response.data.errors.map(err => Object.values(err).join(': ')).join(', ');
      throw new Error(errorMessages);
    }
    throw new Error(error.response.data.message || 'An error occurred');
  }
  console.error(`Unexpected error in ${context}:`, error);
  throw error;
};

const forumService = {
  // User Authentication
  register: async (username: string, email: string, password: string, isAdmin: boolean) => {
    try {
      const response = await axios.post(`${API_URL}/users/register`, { username, email, password, isAdmin });
      return response.data;
    } catch (error) {
      handleError(error as AxiosError<ErrorResponse>, 'register');
    }
  },

  login: async (username: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/users/login`, { username, password });
      return response.data;
    } catch (error) {
      handleError(error as AxiosError<ErrorResponse>, 'login');
    }
  },

  // Categories
  getCategories: async (page: number = 1, limit: number = 10) => {
    try {
      const response = await axios.get(`${API_URL}/forum/categories`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      handleError(error as AxiosError<ErrorResponse>, 'getCategories');
    }
  },

  getCategory: async (id: number) => {
    try {
      const response = await axios.get(`${API_URL}/forum/categories/${id}`);
      return response.data;
    } catch (error) {
      handleError(error as AxiosError<ErrorResponse>, 'getCategory');
    }
  },

  createCategory: async (name: string, description: string) => {
    try {
      const response = await axios.post(`${API_URL}/forum/categories`, { name, description });
      return response.data;
    } catch (error) {
      handleError(error as AxiosError<ErrorResponse>, 'createCategory');
    }
  },

  // Subforums
  getSubforum: async (id: number, page: number = 1, limit: number = 10) => {
    try {
      const response = await axios.get(`${API_URL}/forum/subforums/${id}`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      handleError(error as AxiosError<ErrorResponse>, 'getSubforum');
    }
  },

  createSubforum: async (name: string, description: string, categoryId: number) => {
    try {
      const response = await axios.post(`${API_URL}/forum/subforums`, { name, description, categoryId });
      return response.data;
    } catch (error) {
      handleError(error as AxiosError<ErrorResponse>, 'createSubforum');
    }
  },

  // Threads
  getThread: async (id: number, page: number = 1, limit: number = 10) => {
    try {
      const response = await axios.get(`${API_URL}/forum/threads/${id}`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      handleError(error as AxiosError<ErrorResponse>, 'getThread');
    }
  },

  createThread: async (title: string, content: string, subforumId: number) => {
    try {
      const response = await axios.post(`${API_URL}/forum/threads`, { title, content, subforumId });
      return response.data;
    } catch (error) {
      handleError(error as AxiosError<ErrorResponse>, 'createThread');
    }
  },

  deleteThread: async (id: number) => {
    try {
      const response = await axios.delete(`${API_URL}/forum/threads/${id}`);
      return response.data;
    } catch (error) {
      handleError(error as AxiosError<ErrorResponse>, 'deleteThread');
    }
  },

  // Posts
  createPost: async (content: string, threadId: number) => {
    try {
      const response = await axios.post(`${API_URL}/forum/posts`, { content, threadId });
      return response.data;
    } catch (error) {
      handleError(error as AxiosError<ErrorResponse>, 'createPost');
    }
  },

  updatePost: async (id: number, content: string) => {
    try {
      const response = await axios.put(`${API_URL}/forum/posts/${id}`, { content });
      return response.data;
    } catch (error) {
      handleError(error as AxiosError<ErrorResponse>, 'updatePost');
    }
  },

  deletePost: async (id: number) => {
    try {
      const response = await axios.delete(`${API_URL}/forum/posts/${id}`);
      return response.data;
    } catch (error) {
      handleError(error as AxiosError<ErrorResponse>, 'deletePost');
    }
  },

  // Search
  searchForum: async (query: string, page: number = 1, limit: number = 10) => {
    try {
      const response = await axios.get(`${API_URL}/forum/search`, {
        params: { q: query, page, limit }
      });
      return response.data;
    } catch (error) {
      handleError(error as AxiosError<ErrorResponse>, 'searchForum');
    }
  },
};

export default forumService;