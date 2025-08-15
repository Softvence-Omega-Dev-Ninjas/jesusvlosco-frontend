/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Edit, Trash2, Eye, Send } from "lucide-react";
import { useState } from "react";
import user1 from "@/assets/reactionuser2.png";
import user2 from "@/assets/reactionu1.png";
import user3 from "@/assets/reaction user 3.png";
import Swal from "sweetalert2";
import { PiUserCircleLight } from "react-icons/pi";
import { useAddCommentMutation } from "@/store/api/admin/recognation/recognationApi";

interface SendReactionModalProps {
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recognation?: any;
}

interface Reaction {
  emoji: string;
  count: number;
  users: string[];
}

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  reactions: Reaction[];
  image: string;
}

const EMOJI_OPTIONS = ["👍", "❤️", "😊", "🎉", "👏"];

const SendReactionModal: React.FC<SendReactionModalProps> = ({
  onClose,
  recognation,
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "leslie-comment",
      author: "Leslie Alexander",
      content: "Well-done! Keep it up.",
      timestamp: "2 days ago",
      reactions: [],
      image: user2,
    },
    {
      id: "cody-comment",
      author: "Cody Fisher",
      content: "Thanks",
      timestamp: "2 days ago",
      reactions: [],
      image: user3,
    },
  ]);

  const [postReactions] = useState<Reaction[]>([
    { emoji: "😊", count: 1, users: ["Current User"] },
  ]);

  const handleEmojiSelect = (commentId: string, emoji: string) => {
    setComments((prevComments) =>
      prevComments.map((comment) => {
        if (comment.id === commentId) {
          const existingReaction = comment.reactions.find(
            (r) => r.emoji === emoji
          );
          if (existingReaction) {
            // If user already reacted with this emoji, remove it
            if (existingReaction.users.includes("Current User")) {
              return {
                ...comment,
                reactions: comment.reactions
                  .map((r) =>
                    r.emoji === emoji
                      ? {
                          ...r,
                          count: r.count - 1,
                          users: r.users.filter((u) => u !== "Current User"),
                        }
                      : r
                  )
                  .filter((r) => r.count > 0),
              };
            } else {
              // Add user to existing reaction
              return {
                ...comment,
                reactions: comment.reactions.map((r) =>
                  r.emoji === emoji
                    ? {
                        ...r,
                        count: r.count + 1,
                        users: [...r.users, "Current User"],
                      }
                    : r
                ),
              };
            }
          } else {
            // Create new reaction
            return {
              ...comment,
              reactions: [
                ...comment.reactions,
                { emoji, count: 1, users: ["Current User"] },
              ],
            };
          }
        }
        return comment;
      })
    );
    setShowEmojiPicker(null);
  };

  const [addComment] = useAddCommentMutation();
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      recognitionId: recognation?.id,
      data: { comment: commentText },
    });
    if (commentText.trim()) {
      const result = await addComment({
        recognitionId: recognation?.id,
        data: commentText,
      });
      console.log({ result });
      return;
      const newComment: Comment = {
        id: `comment-${Date.now()}`,
        author: "Current User",
        content: commentText.trim(),
        timestamp: "just now",
        reactions: [],
        image: user1, // or another default user image
      };
      setComments((prev) => [...prev, newComment]);
      setCommentText("");
    }
  };

  const EmojiPicker = ({
    onSelect,
    isVisible,
  }: {
    onSelect: (emoji: string) => void;
    isVisible: boolean;
  }) => {
    if (!isVisible) return null;

    return (
      <div className="absolute bottom-full mb-2 bg-black border border-gray-200 rounded-full shadow-lg p-2 flex gap-2 z-10">
        {EMOJI_OPTIONS.map((emoji) => (
          <button
            key={emoji}
            onClick={() => onSelect(emoji)}
            className="w-8 h-8 flex items-center cursor-pointer justify-center hover:bg-gray-100 rounded text-lg transition-colors"
          >
            {emoji}
          </button>
        ))}
      </div>
    );
  };

  const ReactionDisplay = ({ reactions }: { reactions: Reaction[] }) => {
    if (reactions.length === 0) return null;

    return (
      <div className="flex items-center gap-2 mb-2">
        {reactions.map((reaction) => (
          <div
            key={reaction.emoji}
            className="flex items-center gap-1 bg-gray-100 rounded-full px-2 py-1"
          >
            <span className="text-sm cursor-pointer">{reaction.emoji}</span>
            <span className="text-xs text-gray-600">{reaction.count}</span>
          </div>
        ))}
      </div>
    );
  };

  const Avatar = ({
    children,
    className = "",
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div
      className={`relative inline-flex items-center justify-center overflow-hidden ${className}`}
    >
      {children}
    </div>
  );

  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      position: "top-end",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // ✅ Proceed with delete
        console.log("Item deleted");
        // Example: deleteComment(comment.id);
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-40 z-50 flex justify-end">
      {/* Clickable backdrop to close modal */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Right-side panel with full height and desired width */}
      <div className="relative z-60 h-screen w-full max-w-lg shadow-lg ">
        {/* ✅ Your content goes here */}
        <div className="overflow-y-auto h-full  ">
          <div className="  p-6  h-full bg-white  ">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 border-b pb-3 border-[#C5C5C5]">
              <h1 className="text-xl font-semibold text-gray-800">
                Sent recognition
              </h1>
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.preventDefault(); // prevent form submission
                    window.location.href = "/admin/badge-library";
                  }}
                  className="p-2 hover:bg-gray-100 border cursor-pointer rounded-full transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 hover:bg-gray-100 border rounded-full cursor-pointer transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Recognition Card */}
            <div className="mb-4 bg-[#FFEFD9] border-none  rounded-2xl">
              <div className="p-6">
                <h2 className="text-center text-gray-700 font-medium mb-6">
                  XYZ Company recognized Cody, Leslie & Robert
                </h2>

                <div className="flex items-center justify-between">
                  {/* Company Name */}
                  <div className="text-gray-700 font-medium">
                    {recognation?.message}
                  </div>

                  {/* Lightbulb Icon */}
                  <div className="relative cursor-pointer">
                    <img
                      src={recognation?.badge?.iconImage}
                      alt=""
                      className="max-w-[50px]"
                    />
                  </div>

                  {/* Recognized People */}
                  <div className="space-y-3">
                    {recognation?.recognitionUsers?.map(
                      ({ user }: { user: any }) => (
                        <div className="flex items-center gap-2 ">
                          <div className="flex-shrink-0 h-10 w-10">
                            {user?.profile?.profileUrl ? (
                              <img
                                className="h-10 w-10 rounded-full"
                                src={user?.profile?.profileUrl}
                                alt={`Avatar of ${user?.profile?.firstName}`}
                                onError={(e) => {
                                  (e.target as HTMLImageElement).onerror = null;
                                  (
                                    e.target as HTMLImageElement
                                  ).src = `https://placehold.co/40x40/cccccc/000000?text=${user.name
                                    .charAt(0)
                                    .toUpperCase()}`;
                                }}
                              />
                            ) : (
                              <PiUserCircleLight size={36} />
                            )}
                          </div>
                          <span className="text-gray-700 truncate max-w-[130px] text-sm">
                            {user?.profile?.firstName + user?.profile?.lastName}
                          </span>
                        </div>
                      )
                    )}

                    <div className="flex items-center gap-3 ">
                      <Avatar className="w-8 h-8 rounded-full">
                        <img src={user2} alt="" />
                      </Avatar>
                      <span className="text-gray-700 text-sm">
                        Leslie Alexander
                      </span>
                    </div>
                    <div className="flex items-center gap-3 ">
                      <Avatar className="w-8 h-8 rounded-full">
                        <img src={user3} alt="" />
                      </Avatar>
                      <span className="text-gray-700 text-sm">Robert Fox</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Post Info */}
            <div className="flex items-center justify-between text-xs text-gray-500 mb-4  px-4">
              <span>19/06/2025 at 14:46</span>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>10 people can see this</span>
              </div>
            </div>

            {/* Post Reactions */}
            <div className="flex items-center justify-between mb-6 border-b border-[#C5C5C5] px-2 cursor-pointer">
              <ReactionDisplay reactions={postReactions} />
              <span className="text-xs text-gray-500 cursor-pointer">
                {comments.reduce(
                  (total, comment) =>
                    total +
                    comment.reactions.reduce((sum, r) => sum + r.count, 0),
                  0
                ) + postReactions.reduce((sum, r) => sum + r.count, 0)}{" "}
                reactions • {comments.length} comments
              </span>
            </div>

            {/* Comments */}
            <div className="space-y-6 mb-8 cursor-pointer">
              {comments.map((comment) => (
                <div key={comment.id} className=" ">
                  {/* Comment Content */}
                  <div
                    className={`${
                      comment.author === "Leslie Alexander"
                        ? "bg-[#EDEEF7] border-b border-[#C5C5C5]"
                        : "border-b border-[#C5C5C5]"
                    } ${comment.author === "Cody Fisher" ? "ml-6" : ""} ${
                      comment.author === "Current User" ? "bg-blue-50" : ""
                    } rounded-lg p-4 `}
                  >
                    <div className="flex items-start gap-3 ">
                      <Avatar className="w-8 h-8 rounded-full">
                        <img src={comment.image} alt={comment.author} />
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium text-gray-800 text-sm mb-1">
                          {comment.author}
                        </div>
                        <div className="text-gray-700 text-sm mb-2">
                          {comment.content}
                        </div>
                        <ReactionDisplay reactions={comment.reactions} />
                      </div>
                    </div>
                  </div>

                  {/* Comment Actions */}
                  <div
                    className={`${
                      comment.author === "Cody Fisher" ? "ml-6" : ""
                    } flex items-center justify-between text-sm text-gray-500 relative mt-2 mb-4`}
                  >
                    <span>{comment.timestamp}</span>
                    <div className="flex gap-4">
                      <button
                        className="text-red-500 hover:text-red-600 transition-colors cursor-pointer"
                        onClick={() =>
                          setShowEmojiPicker(
                            showEmojiPicker === comment.id ? null : comment.id
                          )
                        }
                      >
                        Like
                      </button>
                      <button className="text-blue-500 hover:text-blue-600 transition-colors cursor-pointer">
                        Comment
                      </button>
                    </div>
                    <EmojiPicker
                      onSelect={(emoji) => handleEmojiSelect(comment.id, emoji)}
                      isVisible={showEmojiPicker === comment.id}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Comment Input Section */}
            <div className="border-t border-gray-200 pt-6">
              <form
                onSubmit={handleSubmitComment}
                className="flex items-center gap-3"
              >
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write Something..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="p-3 bg-gray-100 cursor-pointer hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  <Send className="w-4 h-4 text-gray-600" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendReactionModal;
