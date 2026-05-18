"use client";

import { useState } from "react";
import CommentForm from "./CommentForm";

type Comment = {
  id: string;
  content: string;
  createdAt: string;
  authorId: string;
  author: { username: string };
};

type Props = {
  postId: string;
  initialComments: Comment[];
  currentUserId?: string | null;
};

export default function CommentSection({ postId, initialComments, currentUserId }: Props) {
  const [comments, setComments] = useState<Comment[]>(initialComments);

  function handleCommentAdded(comment: Comment) {
    setComments((prev) => [comment, ...prev]);
  }

  async function handleDelete(commentId: string) {
    if (!confirm("Delete this comment?")) return;
    const res = await fetch(`/api/posts/${postId}/comments`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ commentId }),
    });
    if (res.ok) setComments((prev) => prev.filter((c) => c.id !== commentId));
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
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-[#878a8c]">
                  u/{comment.author.username} • {new Date(comment.createdAt).toLocaleDateString()}
                </p>
                {currentUserId && currentUserId === comment.authorId && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="text-xs text-[#878a8c] hover:text-red-500 transition"
                    title="Delete comment"
                  >
                    🗑️
                  </button>
                )}
              </div>
              <p className="text-sm">{comment.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
