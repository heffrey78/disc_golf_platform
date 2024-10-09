import React, { useState, useEffect, useCallback } from 'react';
import forumService from '../services/forumService';

interface Post {
  id: number;
  content: string;
  author: {
    username: string;
  };
  createdAt: string;
}

interface Thread {
  id: number;
  title: string;
  posts: Post[];
}

interface ForumPostsProps {
  threadId: number;
  isAdmin: boolean;
}

const ForumPosts: React.FC<ForumPostsProps> = ({ threadId, isAdmin }) => {
  const [thread, setThread] = useState<Thread | null>(null);
  const [newPostContent, setNewPostContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fetchThread = useCallback(async () => {
    try {
      const fetchedThread = await forumService.getThread(threadId);
      setThread(fetchedThread);
    } catch (error) {
      setError('Error fetching thread. Please try again.');
      console.error('Error fetching thread:', error);
    }
  }, [threadId]);

  useEffect(() => {
    fetchThread();
  }, [fetchThread]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await forumService.createPost(newPostContent, threadId);
      setNewPostContent('');
      fetchThread();
    } catch (error) {
      setError('Error creating post. Please try again.');
      console.error('Error creating post:', error);
    }
  };

  const handleUpdatePost = async (postId: number, content: string) => {
    try {
      await forumService.updatePost(postId, content);
      fetchThread();
    } catch (error) {
      setError('Error updating post. Please try again.');
      console.error('Error updating post:', error);
    }
  };

  const handleDeletePost = async (postId: number) => {
    try {
      await forumService.deletePost(postId);
      fetchThread();
    } catch (error) {
      setError('Error deleting post. Please try again.');
      console.error('Error deleting post:', error);
    }
  };

  if (!thread) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{thread.title}</h2>
      {error && <div className="error-message">{error}</div>}
      <h3>Posts</h3>
      <ul>
        {thread.posts.map((post) => (
          <li key={post.id}>
            <p>{post.content}</p>
            <p>Author: {post.author.username}</p>
            <p>Created: {new Date(post.createdAt).toLocaleString()}</p>
            {isAdmin && (
              <>
                <button onClick={() => handleUpdatePost(post.id, prompt('Enter new content') || '')}>
                  Edit
                </button>
                <button onClick={() => handleDeletePost(post.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
      <h3>Create New Post</h3>
      <form onSubmit={handleCreatePost}>
        <textarea
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          placeholder="Post Content"
          required
        />
        <button type="submit">Create Post</button>
      </form>
    </div>
  );
};

export default ForumPosts;