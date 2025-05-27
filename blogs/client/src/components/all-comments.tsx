import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import type { Comment } from "../utls/interfaces";

interface AllCommentsProps {
  initialComments: Comment[];
  postId: string;
}

// Zod schema for comment validation
const commentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(500, "Comment is too long"),
});

type CommentFormData = z.infer<typeof commentSchema>;

export const AllComments = ({ initialComments, postId }: AllCommentsProps) => {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
  });

  // Fetch comments for the post
  const fetchComments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_QUERY_API}/posts/${postId}/comments`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch comments: ${response.status}`);
      }

      const data = await response.json();
      // If the API returns an object, convert it to array
      const commentsArray = Array.isArray(data) ? data : Object.values(data);
      setComments(commentsArray);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect(() => {
  //   fetchComments();
  // }, [postId]);

  // Submit new comment
  const onSubmit = async (data: CommentFormData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_COMMENTSAPI}/posts/${postId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: data.content, status: "pending" }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to post comment: ${response.status}`);
      }

      reset();
      // Refetch comments after successful submission
      await fetchComments();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to post comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Enter key press in textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">Comments</h3>
      {/* Comments List */}
      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : comments.length === 0 ? (
        <div className="p-4 bg-gray-100 text-gray-700 rounded-md">
          No comments yet. Be the first to comment!
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => {
            switch (comment.status) {
              case "pending":
                comment.content = "This comment is awaiting moderation";
                break;
              case "rejected":
                comment.content = "This comment has been rejected";
                break;
              default:
                break;
            }
            return (
              <div
                key={comment.id}
                className="p-4 border border-gray-200 rounded-lg relative"
              >
                <p className="text-gray-800">{comment.content}</p>
                <p className="text-gray-800 absolute -top-3 left-2 px-2 bg-white">
                  {comment.id}
                </p>
              </div>
            );
          })}
        </div>
      )}
      {/* Comment Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700"
          >
            Add a comment
          </label>
          <textarea
            id="content"
            {...register("content")}
            rows={3}
            onKeyDown={handleKeyDown}
            className={`mt-1 block px-2 py-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              errors.content ? "border-red-500" : "border"
            }`}
            disabled={isSubmitting}
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">
              {errors.content.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "Posting..." : "Post Comment"}
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-md">{error}</div>
      )}
    </div>
  );
};
