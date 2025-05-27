import { useState, useEffect, type Dispatch, type SetStateAction } from "react";
import type { IPost } from "../utls/interfaces";
import { SimplePostCard } from "./simple-post-card";

export const PostList = ({
  refetchPost,
  setRefetchPost,
}: {
  refetchPost: boolean;
  setRefetchPost: Dispatch<SetStateAction<boolean>>;
}) => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  console.log({ posts });
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_QUERY_API}/posts`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Convert the object of posts to an array
        const postsArray = Object.keys(data).map((key) => ({
          id: key,
          title: data[key].title,
          comments: data[key].comments,
        }));
        setPosts(postsArray);
        setRefetchPost(false);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (refetchPost || posts.length === 0) {
      fetchPosts();
    }
  }, [refetchPost]);
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-md">
        Error loading posts: {error}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="p-4 bg-blue-100 text-blue-700 rounded-md">
        No posts available. Create one to get started!
      </div>
    );
  }
  return (
    <div className="space-y-4 mt-4">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) => (
          <SimplePostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};
