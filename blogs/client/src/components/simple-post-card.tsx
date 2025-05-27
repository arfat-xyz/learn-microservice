import React from "react";
import type { IPost } from "../utls/interfaces";
import { AllComments } from "./all-comments";

interface SimplePostCardProps {
  post: IPost;
}

export const SimplePostCard: React.FC<SimplePostCardProps> = ({ post }) => {
  return (
    <div className="p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <p className="text-sm text-gray-500/60">ID: {post.id}</p>
      <h3 className="text-lg font-medium text-gray-800">{post.title}</h3>
      <hr className="mt-3" />
      <AllComments postId={post?.id} initialComments={post?.comments} />
    </div>
  );
};
