// export default function UserRecognition() {
//     return (
//         <div>UserRecognition</div>
//     )
// }



import { useState } from "react";
import { MessageCircle, Eye, ThumbsUp, Send } from "lucide-react";
import Creative from "@/assets/creative.png";
import WellDone from "@/assets/Well Done!.png";
import GreatLea from "@/assets/Great Lea.png";
import TeamPlayer from "@/assets/Team Player.png";
import down from "@/assets/arrow_drop_down.svg";

interface Comment {
  id: string;
  author: string;
  authorInitials: string;
  authorColor: string;
  content: string;
  timestamp: string;
  likes: number;
  liked: boolean;
  replies: Reply[];
  showReplyInput?: boolean;
}

interface Reply {
  id: string;
  author: string;
  authorInitials: string;
  authorColor: string;
  content: string;
  timestamp: string;
  likes: number;
  liked: boolean;
}

interface RecognitionPost {
  id: string;
  recognizer: string;
  recognizerInitials: string;
  recipient: string;
  emoji: string;
  recipientInitials: string;
  recognitionType: string;
  timestamp: string;
  liked: boolean;
  likeCount: number;
  comments: Comment[];
}

const recognitionTypes = [
  {
    id: "creative",
    title: "Creative",
    emoji: Creative,
    bgColor: "bg-yellow-100",
  },
  {
    id: "well-done",
    title: "Well Done!",
    emoji: WellDone,
    bgColor: "bg-pink-100",
  },
  {
    id: "great-leadership",
    title: "Great Leadership",
    emoji: GreatLea,
    bgColor: "bg-blue-100",
  },
  {
    id: "team-player",
    title: "Team Player",
    emoji: TeamPlayer,
    bgColor: "bg-orange-100",
  },
];

const samplePosts: RecognitionPost[] = [
  {
    id: "1",
    recognizer: "Sarah Johnson",
    recognizerInitials: "SJ",
    emoji: Creative,
    recipient: "Alex Chen",
    recipientInitials: "AC",
    recognitionType: "Creative",
    timestamp: "22/06/2025 at 09:30",
    liked: false,
    likeCount: 0,
    comments: [],
  },
  {
    id: "2",
    recognizer: "Michael Davis",
    recognizerInitials: "MD",
    emoji: WellDone,
    recipient: "Emma Wilson",
    recipientInitials: "EW",
    recognitionType: "Well Done!",
    timestamp: "21/06/2025 at 16:45",
    liked: true,
    likeCount: 0,
    comments: [],
  },
  {
    id: "3",
    recognizer: "Sharmin Rahman",
    recognizerInitials: "SR",
    recipient: "Sahida Akter",
    emoji: GreatLea,
    recipientInitials: "SA",
    recognitionType: "Great Leadership",
    timestamp: "21/06/2025 at 15:25",
    liked: false,
    likeCount: 0,
    comments: [],
  },
  {
    id: "4",
    recognizer: "David Kim",
    recognizerInitials: "DK",
    recipient: "Lisa Rodriguez",
    emoji: TeamPlayer,
    recipientInitials: "LR",
    recognitionType: "Team Player",
    timestamp: "20/06/2025 at 11:20",
    liked: true,
    likeCount: 0,
    comments: [],
  },
  {
    id: "5",
    recognizer: "Jennifer Lee",
    recognizerInitials: "JL",
    recipient: "Mark Thompson",
    recipientInitials: "MT",
    emoji: Creative,
    recognitionType: "Creative",
    timestamp: "19/06/2025 at 14:15",
    liked: false,
    likeCount: 9,
    comments: [],
  },
  {
    id: "6",
    recognizer: "Robert Brown",
    recognizerInitials: "RB",
    recipient: "Anna Garcia",
    recipientInitials: "AG",
    emoji: Creative,
    recognitionType: "Well Done!",
    timestamp: "18/06/2025 at 10:30",
    liked: true,
    likeCount: 18,
    comments: [],
  },
];

export default function UserRecognition() {
  const [posts, setPosts] = useState<RecognitionPost[]>(samplePosts);
  const [selectedFilter, setSelectedFilter] = useState("All recognitions");

  const handlePostLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            liked: !post.liked,
            likeCount: post.liked ? post.likeCount - 1 : post.likeCount + 1,
          };
        }
        return post;
      })
    );
  };

  const handlePostComment = (postId: string, commentContent: string) => {
    if (commentContent.trim()) {
      const newComment: Comment = {
        id: Date.now().toString(),
        author: "You",
        authorInitials: "YU",
        authorColor: "bg-blue-500",
        content: commentContent,
        timestamp: "now",
        likes: 0,
        liked: false,
        replies: [],
      };

      setPosts((prev) =>
        prev.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              comments: [...post.comments, newComment],
            };
          }
          return post;
        })
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-[#FFFFFF] max-w-lg mx-auto ">
        <div className="max-w-2xl mx-auto px-6 py-6 ">
          <h1 className="text-2xl font-bold text-[#484848] mb-6">
            My Recognitions
          </h1>

          {/* Recognition Type Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 ">
            {recognitionTypes.map((type) => (
              <div
                key={type.id}
                className="flex   flex-col items-start cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="w-24 h-24 rounded-full flex items-center justify-center mb-2">
                    <img src={type.emoji} alt="" />
                  </div>
                  <span className="text-xs font-medium text-gray-700">
                    {type.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-lg mx-auto  py-10 ">
        {/* Feed Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-[#484848]">
            Recognitions Feed
          </h2>
          <div className="relative w-fit">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="text-sm text-[#4E53B1] appearance-none border border-[#4E53B1] bg-white px-6 py-3 pr-10 rounded-full cursor-pointer outline-none"
            >
              <option>All Recognitions</option>
              <option>My Recognitions</option>
              <option>Shared with me</option>
            </select>

            {/* Custom down arrow icon */}
            <img
              src={down}
              alt="Dropdown icon"
              className="w-2 h-2 absolute right-6 top-1/2 transform -translate-y-1/2 pointer-events-none"
            />
          </div>
        </div>

        {/* Recognition Posts Feed */}
        <div className="space-y-6  ">
          {posts.map((post) => (
            <RecognitionPostCard
              key={post.id}
              post={post}
              onLike={() => handlePostLike(post.id)}
              onComment={(content) => handlePostComment(post.id, content)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Individual Recognition Post Component
function RecognitionPostCard({
  post,
  onLike,
  onComment,
}: {
  post: RecognitionPost;
  onLike: () => void;
  onComment: (content: string) => void;
}) {
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>(post.comments);

  const handleCommentLike = (commentId: string) => {
    setComments((prev) =>
      prev.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            liked: !comment.liked,
            likes: comment.liked ? comment.likes - 1 : comment.likes + 1,
          };
        }
        return comment;
      })
    );
  };

  const handleReplyLike = (commentId: string, replyId: string) => {
    setComments((prev) =>
      prev.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: comment.replies.map((reply) => {
              if (reply.id === replyId) {
                return {
                  ...reply,
                  liked: !reply.liked,
                  likes: reply.liked ? reply.likes - 1 : reply.likes + 1,
                };
              }
              return reply;
            }),
          };
        }
        return comment;
      })
    );
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      onComment(newComment);
      const comment: Comment = {
        id: Date.now().toString(),
        author: "You",
        authorInitials: "YU",
        authorColor: "bg-blue-500",
        content: newComment,
        timestamp: "now",
        likes: 0,
        liked: false,
        replies: [],
      };
      setComments((prev) => [...prev, comment]);
      setNewComment("");
      setShowCommentInput(false);
    }
  };

  const handleAddReply = (commentId: string, replyContent: string) => {
    if (replyContent.trim()) {
      const reply: Reply = {
        id: Date.now().toString(),
        author: "Sahida Akter",
        authorInitials: "SA",
        authorColor: "bg-orange-500",
        content: replyContent,
        timestamp: "now",
        likes: 0,
        liked: false,
      };

      setComments((prev) =>
        prev.map((comment) => {
          if (comment.id === commentId) {
            return {
              ...comment,
              replies: [...comment.replies, reply],
              showReplyInput: false,
            };
          }
          return comment;
        })
      );
    }
  };

  const toggleReplyInput = (commentId: string) => {
    setComments((prev) =>
      prev.map((comment) => ({
        ...comment,
        showReplyInput:
          comment.id === commentId ? !comment.showReplyInput : false,
      }))
    );
  };

  const totalComments = comments.reduce(
    (total, comment) => total + 1 + comment.replies.length,
    0
  );

  return (
    <div className="max-w-lg mx-auto rounded-lg shadow-sm border bg-white p-4 border-gray-200">
      {/* Main Post Content */}
      <div className="relative rounded-2xl bg-[#FFF6DC] p-8 rounded-t-lg overflow-hidden">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-lg font-semibold text-[#484848]">
            {post.recognizer} Recognized {post.recipient}
          </h2>
        </div>

        {/* ✅ Responsive Profile Section */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-6">
          {/* Recognizer */}
          <div className="flex flex-col items-center">
            <div
              className={`w-14 h-14 text-white font-bold text-lg rounded-full flex items-center justify-center bg-[#FDD835]`}
            >
              {post.recognizerInitials}
            </div>
          </div>

          {/* Icon */}
          <div className="flex flex-col items-center">
            <div className="w-26 h-26 p-4 bg-[#FFFBEFB8] rounded-full flex items-center justify-center">
              <div>
                <img src={post.emoji} alt="emoji" className="" />
              </div>
            </div>
          </div>

          {/* Recipient */}
          <div className="flex flex-col items-center">
            <div
              className={`w-14 h-14 text-white font-bold text-lg rounded-full flex items-center justify-center bg-[#FFA000]`}
            >
              {post.recipientInitials}
            </div>
          </div>
        </div>

        {/* Recognition Text */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-[#484848]">
            {post.recognitionType}
          </h3>
        </div>
      </div>

      {/* Post Metadata */}
      <div className="px-4 py-3  ">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{post.timestamp}</span>
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>Everyone can see this</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 py-3 ">
        <div className="flex gap-4">
          <button
            onClick={onLike}
            className={`flex items-center border rounded-full gap-2 flex-1 justify-center py-2 px-4  transition-colors cursor-pointer hover:bg-gray-50 ${
              post.liked ? "text-[#FFA000]" : "text-gray-600"
            }`}
          >
            <ThumbsUp
              className={`w-4 h-4 ${post.liked ? "fill-current" : ""}`}
            />
            Like
          </button>
          <button
            className="flex items-center gap-2 flex-1 justify-center text-gray-600 py-2 px-4 border rounded-full  transition-colors cursor-pointer hover:bg-gray-50"
            onClick={() => setShowCommentInput(!showCommentInput)}
          >
            <MessageCircle className="w-4 h-4" />
            Comment
          </button>
        </div>
      </div>

      {/* Engagement Stats */}
      {post.likeCount > 0 && (
        <div className="px-6 py-2 border-b border-gray-100">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <ThumbsUp className="w-4 h-4 text-[#FFA000] fill-current" />
              <span>{post.likeCount}</span>
            </div>
            <span>
              {totalComments} {totalComments === 1 ? "Comment" : "Comments"}
            </span>
          </div>
        </div>
      )}

      {/* Comment Input */}
      {showCommentInput && (
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-blue-500 text-white font-semibold text-sm rounded-full flex items-center justify-center">
              YU
            </div>
            <div className="flex-1">
              <textarea
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full min-h-[80px] p-3 border border-gray-200 rounded-md resize-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
                  onClick={() => {
                    setShowCommentInput(false);
                    setNewComment("");
                  }}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                >
                  <Send className="w-4 h-4" />
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comments Section */}
      {comments.length > 0 && (
        <div className="px-6 py-4">
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="space-y-3">
                {/* Main Comment */}
                <div className="flex gap-3">
                  <div
                    className={`w-8 h-8 ${comment.authorColor} text-white font-semibold text-sm rounded-full flex items-center justify-center`}
                  >
                    {comment.authorInitials}
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-100 rounded-2xl px-4 py-2">
                      <div className="font-semibold text-sm text-gray-800 mb-1">
                        {comment.author}
                      </div>
                      <div className="text-gray-700">{comment.content}</div>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                      <span>{comment.timestamp}</span>
                      <button
                        className={`hover:underline cursor-pointer ${
                          comment.liked ? "text-blue-600 font-semibold" : ""
                        }`}
                        onClick={() => handleCommentLike(comment.id)}
                      >
                        Like {comment.likes > 0 && `(${comment.likes})`}
                      </button>
                      <button
                        className="hover:underline cursor-pointer"
                        onClick={() => toggleReplyInput(comment.id)}
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                </div>

                {/* Reply Input */}
                {comment.showReplyInput && (
                  <div className="ml-11">
                    <ReplyInput
                      onSubmit={(content) =>
                        handleAddReply(comment.id, content)
                      }
                      onCancel={() => toggleReplyInput(comment.id)}
                    />
                  </div>
                )}

                {/* Replies */}
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="flex gap-3 ml-11">
                    <div
                      className={`w-8 h-8 ${reply.authorColor} text-white font-semibold text-sm rounded-full flex items-center justify-center`}
                    >
                      {reply.authorInitials}
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-100 rounded-2xl px-4 py-2">
                        <div className="font-semibold text-sm text-gray-800 mb-1">
                          {reply.author}
                        </div>
                        <div className="text-gray-700">{reply.content}</div>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                        <span>{reply.timestamp}</span>
                        <button
                          className={`hover:underline cursor-pointer ${
                            reply.liked ? "text-blue-600 font-semibold" : ""
                          }`}
                          onClick={() => handleReplyLike(comment.id, reply.id)}
                        >
                          Like {reply.likes > 0 && `(${reply.likes})`}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Reply Input Component
function ReplyInput({
  onSubmit,
  onCancel,
}: {
  onSubmit: (content: string) => void;
  onCancel: () => void;
}) {
  const [replyContent, setReplyContent] = useState("");

  const handleSubmit = () => {
    onSubmit(replyContent);
    setReplyContent("");
  };

  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 bg-orange-500 text-white font-semibold text-sm rounded-full flex items-center justify-center">
        SA
      </div>
      <div className="flex-1">
        <textarea
          placeholder="Write a reply..."
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
          className="w-full min-h-[60px] p-3 border border-gray-200 rounded-md resize-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        <div className="flex justify-end gap-2 mt-2">
          <button
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            onClick={handleSubmit}
            disabled={!replyContent.trim()}
          >
            <Send className="w-4 h-4" />
            Reply
          </button>
        </div>
      </div>
    </div>
  );
}
