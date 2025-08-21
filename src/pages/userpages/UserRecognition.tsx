/* eslint-disable react-refresh/only-export-components */
import down from "@/assets/arrow_drop_down.svg";
import comment from "@/assets/comment.png";
import {
  useGetAllCommentLikeQuery,
  usePostCommentMutation,
  usePostLikeMutation,
  usePostReplyMutation,
} from "@/store/api/user/userRecognition";
import { Eye, Send, ThumbsUp } from "lucide-react";
import { createContext, useContext, useEffect, useState } from "react";

// ==================== CONSTANTS & UTILS ====================
const FALLBACK_AVATAR = "https://avatar.iran.liara.run/public";
const safeAvatar = (url?: string) => (url && url.trim() ? url : FALLBACK_AVATAR);
const formatDate = (date?: string) => (date ? new Date(date).toLocaleString() : new Date().toLocaleString());

// ==================== TYPES ====================
interface ApiUser {
  id: string;
  name?: string;
  profileUrl?: string;
  firstName?: string;
  lastName?: string;
  jobTitle?: string;
}

interface ApiComment {
  id: string;
  comment: string;
  user: ApiUser;
  replies: ApiComment[];
  reactions?: { id: string; reaction: string; user: ApiUser }[];
  createdAt?: string;
}

interface ApiPost {
  id: string;
  badgeId: string;
  message: string;
  visibility: string;
  shouldNotify: boolean;
  isAllowedToLike: boolean;
  createdAt: string;
  updatedAt: string;
  recognitionUsers: ApiUser[];
  badge: { id: string; title: string; category: string; iconImage: string };
  comments: ApiComment[];
  reactions: { id: string; reaction: string; user: ApiUser }[];
}

interface TransformedReply {
  id: string;
  author: string;
  authorProfileUrl: string;
  authorColor: string;
  content: string;
  timestamp: string;
  likes: number;
  liked: boolean;
}

interface TransformedComment extends TransformedReply {
  replies: TransformedReply[];
  showReplyInput?: boolean;
}

interface TransformedPost {
  id: string;
  recognizer: string;
  recognizerProfileUrl: string;
  emoji: string;
  recipients: { name: string; profileUrl: string }[];
  recognitionType: string;
  message: string;
  timestamp: string;
  visibility: string;
  liked: boolean;
  likeCount: number;
  comments: TransformedComment[];
}

interface RecognitionType {
  id: string;
  title: string;
  emoji: string;
  bgColor: string;
}

// ==================== API CONTEXT ====================
export const ApiContext = createContext<{
  postComment: (postId: string, commentContent: string) => Promise<void>;
  postReply: (postId: string, commentId: string, replyContent: string) => Promise<void>;
  postLike: (postId: string) => Promise<void>;
}>({
  postComment: async () => {},
  postReply: async () => {},
  postLike: async () => {},
});

// ==================== INPUT COMPONENT ====================
function InputBox({
  placeholder,
  value,
  setValue,
  onSubmit,
  onCancel,
  submitting,
  submitLabel,
}: {
  placeholder: string;
  value: string;
  setValue: (v: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  submitting: boolean;
  submitLabel: string;
}) {
  return (
    <div className="flex gap-3">
      <img src={FALLBACK_AVATAR} alt="User" className="w-8 h-8 rounded-full object-cover" />
      <div className="flex-1">
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
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
            onClick={onSubmit}
            disabled={!value.trim() || submitting}
          >
            <Send className="w-4 h-4" />
            {submitting ? `${submitLabel}...` : submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== DATA TRANSFORM HELPERS ====================
const transformComment = (c: ApiComment, isReply = false): TransformedComment | TransformedReply => ({
  id: c.id,
  author: `${c.user.firstName ?? ""} ${c.user.lastName ?? ""}`.trim() || "Unknown",
  authorProfileUrl: safeAvatar(c.user.profileUrl),
  authorColor: isReply ? "bg-orange-500" : "bg-blue-500",
  content: c.comment,
  timestamp: formatDate(c.createdAt),
  likes: c.reactions?.length ?? 0,
  liked: false,
  ...(isReply ? {} : { replies: c.replies.map((r) => transformComment(r, true) as TransformedReply) }),
});

const transformApiData = (apiPosts: ApiPost[]): TransformedPost[] => {
  return apiPosts
    .filter((post) => post.visibility.toLowerCase() !== "managers")
    .map((post) => ({
      id: post.id,
      recognizer: post.recognitionUsers[0]?.name || "Unknown",
      recognizerProfileUrl: safeAvatar(post.recognitionUsers[0]?.profileUrl),
      emoji: post.badge.iconImage,
      recipients: post.recognitionUsers.map((user) => ({
        name: user.name ?? "Unknown",
        profileUrl: safeAvatar(user.profileUrl),
      })),
      recognitionType: post.badge.title,
      message: post.message,
      timestamp: formatDate(post.createdAt),
      visibility: post.visibility,
      liked: false,
      likeCount: post.reactions.length,
      comments: post.comments.map((c) => transformComment(c) as TransformedComment),
    }));
};

// ==================== MAIN COMPONENT ====================
export default function App() {
  const [posts, setPosts] = useState<TransformedPost[]>([]);
  const [recognitionTypes, setRecognitionTypes] = useState<RecognitionType[]>([]);
  const [selectedFilter, setSelectedFilter] = useState("All Recognitions");

  const filterMap: { [key: string]: string } = {
    "All Recognitions": "all",
    "My Recognitions": "my",
  };

  const { data: apiData, error, isLoading, refetch } = useGetAllCommentLikeQuery({
    filter: filterMap[selectedFilter],
  });
  console.log(apiData);
  
  const [postCommentMutation] = usePostCommentMutation();
  const [postReplyMutation] = usePostReplyMutation();
  const [postLikeMutation] = usePostLikeMutation();

  // ==================== API ACTIONS ====================
  const postComment = async (postId: string, commentContent: string) => {
    try {
      await postCommentMutation({ recognitionId: postId, comment: commentContent }).unwrap();
      refetch();
    } catch (err) {
      console.error("Failed to post comment:", err);
    }
  };

  const postReply = async (postId: string, commentId: string, replyContent: string) => {
    try {
      await postReplyMutation({ recognitionId: postId, parentCommentId: commentId, comment: replyContent }).unwrap();
      refetch();
    } catch (err) {
      console.error("Failed to post reply:", err);
    }
  };

  const postLike = async (postId: string) => {
    try {
      await postLikeMutation({ recognitionId: postId }).unwrap();
      refetch();
    } catch (err) {
      console.error("Failed to post like:", err);
    }
  };

  // ==================== DATA TRANSFORM EFFECT ====================
  useEffect(() => {
    if (apiData?.data) {
      const transformed = transformApiData(apiData.data);
      setPosts(transformed);

      const types: RecognitionType[] = apiData.data.reduce((acc: RecognitionType[], post) => {
        if (!acc.some((t) => t.id === post.badge.id)) {
          acc.push({
            id: post.badge.id,
            title: post.badge.title,
            emoji: post.badge.iconImage,
            bgColor: `bg-${post.badge.category.toLowerCase()}-100`,
          });
        }
        return acc;
      }, []);
      setRecognitionTypes(types);
    }
  }, [apiData, selectedFilter]);

  return (
    <ApiContext.Provider value={{ postComment, postReply, postLike }}>
      <div className="min-h-screen bg-gray-50">
        {/* HEADER */}
        <div className="bg-[#FFFFFF] max-w-lg mx-auto px-6 py-6">
          <h1 className="text-2xl font-bold text-[#484848] mb-6">My Recognitions</h1>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recognitionTypes.map((type) => (
              <div key={type.id} className="flex flex-col items-center cursor-pointer hover:bg-gray-50 rounded-lg transition-colors">
                <div className="w-24 h-24 rounded-full flex items-center justify-center mb-2">
                  <img src={type.emoji} alt={type.title} className="object-contain h-20" />
                </div>
                <span className="text-xs font-medium text-gray-700">{type.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* MAIN FEED */}
        <div className="max-w-lg mx-auto py-10">
          {/* Feed Header */}
          <div className="flex flex-col gap-4 md:flex-row items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-[#484848]">Recognitions Feed</h2>
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
              <img src={down} alt="Dropdown icon" className="w-2 h-2 absolute right-6 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {isLoading && <p className="text-center">Loading recognitions...</p>}
          {error && <p className="text-center text-red-500">Error loading recognitions. Please try again.</p>}

          {!isLoading && !error && (
            <div className="space-y-6">
              {posts.map((post) => (
                <RecognitionPostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>
    </ApiContext.Provider>
  );
}

// ==================== POST CARD ====================
function RecognitionPostCard({ post }: { post: TransformedPost }) {
  const { postComment, postLike } = useContext(ApiContext);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(post.comments);
  const [isCommenting, setIsCommenting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [localLiked, setLocalLiked] = useState(post.liked);
  const [localLikeCount, setLocalLikeCount] = useState(post.likeCount);

  useEffect(() => {
    setComments(post.comments);
    setLocalLikeCount(post.likeCount);
  }, [post]);

  const handlePostLike = async () => {
    if (localLiked) return;
    setIsLiking(true);
    setLocalLiked(true);
    setLocalLikeCount((prev) => prev + 1);
    await postLike(post.id);
    setIsLiking(false);
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    setIsCommenting(true);
    await postComment(post.id, newComment);
    setNewComment("");
    setShowCommentInput(false);
    setShowComments(true);
    setIsCommenting(false);
  };

  const totalComments = comments.reduce((total, c) => total + 1 + c.replies.length, 0);

  return (
    <div className="max-w-lg mx-auto rounded-xl bg-white p-4 border-gray-200">
      {/* POST CONTENT */}
      <div className="relative rounded-2xl bg-[#FFF6DC] p-8 overflow-hidden text-center mb-6">
        <h2 className="text-lg font-semibold text-[#484848]">{post.recognizer} is Recognized</h2>
        <p className="text-gray-600 mt-2">{post.message}</p>
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-8 mt-4">
          <img src={post.recognizerProfileUrl} alt={post.recognizer} className="w-14 h-14 rounded-full object-cover" onError={(e) => (e.currentTarget.src = FALLBACK_AVATAR)} />
          <div className="w-26 h-26 p-4 bg-[#FFFBEFB8] rounded-full flex items-center justify-center">
            <img src={post.emoji} alt="badge" className="object-contain h-16" />
          </div>
          {post.recipients.slice(0, 1).map((r, i) => (
            <img key={i} src={r.profileUrl} alt={r.name} className="w-14 h-14 rounded-full object-cover" onError={(e) => (e.currentTarget.src = FALLBACK_AVATAR)} />
          ))}
        </div>
        <h3 className="text-2xl font-bold text-[#484848] mt-4">{post.recognitionType}</h3>
      </div>

      {/* POST METADATA */}
      <div className="px-4 py-3 flex items-center justify-between text-sm text-gray-500">
        <span>{post.timestamp}</span>
        <div className="flex items-center gap-1">
          <Eye className="w-4 h-4" />
          <span>{post.visibility.replace(/_/g, " ")}</span>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="py-3 flex gap-4">
        <button
          onClick={handlePostLike}
          disabled={isLiking || localLiked}
          className={`flex items-center border rounded-full gap-2 flex-1 justify-center py-2 px-4 transition-colors cursor-pointer hover:bg-gray-50 ${
            localLiked ? "text-[#FFA000]" : "text-gray-600"
          }`}
        >
          <ThumbsUp className={`w-4 h-4 ${localLiked ? "fill-current" : ""}`} />
          {isLiking ? "Liking..." : "Like"}
        </button>
        <button
          onClick={() => {
            setShowCommentInput(!showCommentInput);
            setShowComments(true);
          }}
          className="flex items-center gap-2 flex-1 justify-center text-gray-600 py-2 px-4 border rounded-full transition-colors cursor-pointer hover:bg-gray-50"
        >
          <img src={comment} alt="" className="w-4 h-4" />
          Comment
        </button>
      </div>

      {/* ENGAGEMENT STATS */}
      {(localLikeCount > 0 || totalComments > 0) && (
        <div className="px-6 py-2 border-b border-t border-gray-100 flex items-center justify-between text-sm text-gray-600">
          {localLikeCount > 0 && (
            <div className="flex items-center gap-1">
              <ThumbsUp className="w-4 h-4 text-[#FFA000] fill-current" />
              <span>{localLikeCount}</span>
            </div>
          )}
          {totalComments > 0 && (
            <button className="hover:underline" onClick={() => setShowComments(!showComments)}>
              {showComments ? "Hide Comments" : `${totalComments} ${totalComments === 1 ? "Comment" : "Comments"}`}
            </button>
          )}
        </div>
      )}

      {/* COMMENT INPUT */}
      {showCommentInput && (
        <div className="px-6 py-4 border-b border-gray-100">
          <InputBox
            placeholder="Write a comment..."
            value={newComment}
            setValue={setNewComment}
            onSubmit={handleAddComment}
            onCancel={() => {
              setShowCommentInput(false);
              setNewComment("");
            }}
            submitting={isCommenting}
            submitLabel="Post"
          />
        </div>
      )}

      {/* COMMENTS */}
      {showComments && comments.length > 0 && (
        <div className="px-6 py-4 space-y-4">
          {comments.map((c) => (
            <CommentCard key={c.id} comment={c} postId={post.id} />
          ))}
        </div>
      )}
    </div>
  );
}

// ==================== COMMENT CARD ====================
function CommentCard({ comment, postId }: { comment: TransformedComment; postId: string }) {
  const { postReply } = useContext(ApiContext);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [newReply, setNewReply] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  const handleAddReply = async () => {
    if (!newReply.trim()) return;
    setIsReplying(true);
    await postReply(postId, comment.id, newReply);
    setNewReply("");
    setShowReplyInput(false);
    setIsReplying(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-3">
        <img src={comment.authorProfileUrl} alt={comment.author} className="w-8 h-8 rounded-full object-cover" />
        <div className="flex-1">
          <div className="bg-gray-100 rounded-xl p-3 text-sm text-gray-700">
            <span className="font-semibold">{comment.author}:</span> {comment.content}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
            <span>{comment.timestamp}</span>
            <button className="hover:underline" onClick={() => setShowReplyInput(!showReplyInput)}>
              Reply
            </button>
          </div>

          {showReplyInput && (
            <div className="mt-2">
              <InputBox
                placeholder="Write a reply..."
                value={newReply}
                setValue={setNewReply}
                onSubmit={handleAddReply}
                onCancel={() => {
                  setShowReplyInput(false);
                  setNewReply("");
                }}
                submitting={isReplying}
                submitLabel="Reply"
              />
            </div>
          )}

          {comment.replies.length > 0 && (
            <div className="pl-10 mt-2 space-y-2">
              {comment.replies.map((r) => (
                <div key={r.id} className="flex gap-3">
                  <img src={r.authorProfileUrl} alt={r.author} className="w-7 h-7 rounded-full object-cover" />
                  <div className="bg-gray-50 rounded-xl p-2 text-sm text-gray-700">
                    <span className="font-semibold">{r.author}:</span> {r.content}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
