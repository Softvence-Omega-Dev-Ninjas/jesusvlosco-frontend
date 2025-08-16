/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Edit, Trash2, Eye, Send } from "lucide-react";
import { useState } from "react";
import user2 from "@/assets/reactionu1.png";
import user3 from "@/assets/reaction user 3.png";
import Swal from "sweetalert2";
// import { PiUserCircleLight } from "react-icons/pi";
import {
  useAddCommentMutation,
  useGetAllCommentQuery,
} from "@/store/api/admin/recognation/recognationApi";
import { toast } from "sonner";
import CommentCard from "./CommentCard";

interface SendReactionModalProps {
  onClose: () => void;
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

const reactionsWithEmoji = [
  { label: "LIKE", emoji: "👍" },
  { label: "LOVE_FACE", emoji: "❤️" },
  { label: "SMILE_FACE", emoji: "😊" },
  { label: "WOW_FACE", emoji: "😮" },
  { label: "SAD_FACE", emoji: "😢" },
  { label: "CELEBRATION", emoji: "🎉" },
];

const SendReactionModal: React.FC<SendReactionModalProps> = ({
  onClose,
  recognation,
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState<string | null>(null);
  console.log({ showEmojiPicker });
  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);

  const [addComment] = useAddCommentMutation();

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
  console.log({ setComments });
  const handleReplyComment = async (commentId: string) => {
    console.log({ commentId });

    if (replyText.trim()) {
      try {
        const result = await addComment({
          recognitionId: recognation?.id,
          data: { comment: replyText, parentCommentId: commentId },
        }).unwrap();
        console.log({ result });
        if (result?.success) {
          toast.success(result?.message || "Comment added successfully");
        }
      } catch (error: any) {
        console.log({ error });
        toast.error(error?.message || "Something went wrong");
      } finally {
        setActiveReplyId(null);
        setReplyText("");
      }
      return;
    }
  };
  const { data } = useGetAllCommentQuery({ id: recognation?.id });
  const commentss = data?.data?.comments;
  console.log({ commentss });
  const [postReactions] = useState<Reaction[]>([
    { emoji: "😊", count: 1, users: ["Current User"] },
  ]);
  console.log({ recognation });
  const handleEmojiSelect = async (commentId: string, emoji: string) => {
    console.log({ commentId, emoji });
    //  return;

    try {
      const result = await addComment({
        recognitionId: recognation?.id,
        data: { reaction: emoji, parentCommentId: commentId },
      }).unwrap();
      console.log({ result });
      if (result?.success) {
        toast.success(result?.message || "Reaction added successfully");
      }
    } catch (error: any) {
      console.log({ error });
      toast.error(error?.message || "Something went wrong");
    }

    setShowEmojiPicker(null);
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      recognitionId: recognation?.id,
      data: { comment: commentText },
    });
    if (commentText.trim()) {
      try {
        const result = await addComment({
          recognitionId: recognation?.id,
          data: { comment: commentText },
        }).unwrap();
        console.log({ result });
        if (result?.success) {
          toast.success(result?.message || "Comment added successfully");
        }
      } catch (error: any) {
        console.log({ error });
        toast.error(error?.message || "Something went wrong");
      }
      return;
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
        {reactionsWithEmoji.map((emoji) => (
          <button
            key={emoji.label}
            onClick={() => onSelect(emoji.label)}
            className="w-8 h-8 flex items-center cursor-pointer justify-center hover:bg-gray-100 rounded text-lg transition-colors"
          >
            {emoji.emoji}
          </button>
        ))}
      </div>
    );
  };

  const ReactionDisplay = ({ reactions }: { reactions: Reaction[] }) => {
    if (reactions.length === 0) return null;
    const reactionSummary = reactions?.reduce((acc, curr: any) => {
      const match = reactionsWithEmoji.find(
        (item) => item.label === curr.reaction
      );
      if (!match) return acc;

      const existing = acc.find((item) => item.label === curr.reaction);
      if (existing) {
        existing.count += 1;
      } else {
        acc.push({
          label: curr.reaction,
          emoji: match.emoji,
          count: 1,
        });
      }

      return acc;
    }, [] as { label: string; emoji: string; count: number }[]);

    console.log(reactionSummary);
    return (
      <div className="flex h-6  items-center  gap-2 mb-2">
        {reactionSummary.map((reaction) => (
          <div
            key={reaction.emoji}
            className="flex items-center gap-1 bg-gray-100 rounded-full px-2 py-1"
          >
            <span className="text-sm cursor-pointer lowercase">
              {reaction.emoji}
            </span>
            <span className="text-xs text-gray-600">{reaction.count}</span>
          </div>
        ))}
      </div>
    );
  };

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
    <div className="fixed inset-0 bg-black/50  bg-opacity-40 z-50 flex justify-end">
      {/* Clickable backdrop to close modal */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Right-side panel with full height and desired width */}
      <div className="relative z-60 min-h-screen w-full max-w-lg shadow-lg ">
        {/* ✅ Your content goes here */}
        <div className="overflow-y-auto h-full bg-white ">
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
                          {/* <div className="flex-shrink-0 h-10 w-10">
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
                          </div> */}
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="w-10 h-10 rounded-full font-medium bg-gray-300 flex items-center justify-center">
                              {user?.profile?.firstName[0]}
                            </div>
                          </div>
                          <span className="text-gray-700 truncate max-w-[130px] text-sm">
                            {(user?.profile?.firstName || "") +
                              " " +
                              (user?.profile?.lastName || "")}
                          </span>
                        </div>
                      )
                    )}
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
            <div className="space-y-6  mb-8 cursor-pointer">
              {commentss?.map((comment: any) => (
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
                    <div className="flex  items-start gap-3 ">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="w-10 h-10 rounded-full font-medium bg-gray-300 flex items-center justify-center">
                          {comment.user.firstName[0]}
                        </div>
                      </div>
                      <div className="flex-1 ">
                        <div className="font-medium text-gray-800 text-sm mb-1">
                          {comment.user?.firstName +
                            " " +
                            comment?.user?.lastName}
                        </div>
                        <div className="text-gray-700 text-sm mb-2">
                          {comment?.comment}
                        </div>
                        <ReactionDisplay reactions={comment?.reactions} />
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
                      <button
                        onClick={() => {
                          if (activeReplyId === comment.id) {
                            // Closing the reply input — clear the text
                            console.log("serfgs");
                            setActiveReplyId(null);
                            setReplyText("");
                          } else {
                            // Opening the reply input for this comment
                            setActiveReplyId(comment.id);
                          }
                        }}
                        className="text-blue-500 hover:text-blue-600 transition-colors cursor-pointer"
                      >
                        Comment
                      </button>
                    </div>
                    <EmojiPicker
                      onSelect={(emoji) => handleEmojiSelect(comment.id, emoji)}
                      isVisible={showEmojiPicker === comment.id}
                    />
                  </div>
                  {activeReplyId === comment.id && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleReplyComment(comment.id);
                      }}
                      className="flex mb-3 items-center gap-3"
                    >
                      <input
                        type="text"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write Something..."
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                      <button
                        type="submit"
                        disabled={!replyText.trim()}
                        className="p-3 bg-gray-100 cursor-pointer hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                      >
                        <Send className="w-4 h-4 text-gray-600" />
                      </button>
                    </form>
                  )}

                  <div className="ml-8 space-y-4 ">
                    {comment?.replies?.map((el: any) => (
                      <CommentCard comment={el} />
                    ))}
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
