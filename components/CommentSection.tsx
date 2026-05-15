"use client";

import { useState } from "react";
import CommentForm from "./CommentForm";

type Comment = {
  id: string;
  content: string;
  createdAt: string;
  author: { username: string };
};

type Props = {
  postId: string;
  initialComments: Comment[];
};

export default function CommentSection({ postId, initialComments }: Props) {
  const [comments, setComments] = useState<Comment[]>(initialComments);

  function handleCommentAdded(comment: Comment) {
    setComments((prev) => [comment, ...prev]);
  }

  return (
    <div className="bg-white rounded-lg border border-[#edeff1] p-6">
      <h2 className="font-semibold mb-4">Comments ({comments.length})</h2>
      <CommentForm postId={postId} onCommentAdded={handleCommentAdded} />
      {comments.length === 0 ? (
        <p className="text-sm text-[#878a8c]">No comments yet. Be the first to comment!</p>
      ) : (
        <div className="flex flex-col gap-4">
          {comments.map((comment) => (
            <div key={comment.id} className="border-l-2 border-[#edeff1] pl-4">
              <p className="text-xs text-[#878a8c] mb-1">
                u/{comment.author.username} • {new Date(comment.createdAt).toLocaleDateString()}
              </p>
              <p className="text-sm">{comment.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
