/* eslint-disable react-refresh/only-export-components */
import down from "@/assets/arrow_drop_down.svg";
import comment from "@/assets/comment.png";
import { useGetUserProfileQuery } from "@/store/api/auth/authApi";
import {
  useGetAllCommentLikeQuery,
  usePostCommentMutation,
  usePostReplyMutation,
  usePostReactionMutation,
  useDeleteReactionMutation,
} from "@/store/api/user/userRecognition";
import { Eye, Send, ThumbsUp } from "lucide-react";
import { createContext, useContext, useEffect, useState } from "react";

// ==================== CONSTANTS & UTILS ====================
const FALLBACK_AVATAR = "https://avatar.iran.liara.run/public";
const safeAvatar = (url?: string) => (url && url.trim() ? url : FALLBACK_AVATAR);
const formatDate = (date?: string) => (date ? new Date(date).toLocaleString() : new Date().toLocaleString());

// ==================== TYPES ====================
enum Reaction {
  LIKE = "LIKE",
  LOVE_FACE = "LOVE_FACE",
  SMILE_FACE = "SMILE_FACE",
  WOW_FACE = "WOW_FACE",
  SAD_FACE = "SAD_FACE",
  CELEBRATION = "CELEBRATION",
}

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
  reactions: { id: string; reaction: Reaction; user: ApiUser }[];
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
  reactions: { id: string; reaction: Reaction; user: ApiUser }[];
}

interface TransformedReply {
  id: string;
  author: string;
  authorProfileUrl: string;
  authorColor: string;
  content: string;
  timestamp: string;
  reactions: { [key in Reaction]?: number };
  userReaction: Reaction | null;
  userReactionId: string | null;
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
  isAllowedToLike: boolean;
  reactions: { [key in Reaction]?: number };
  userReaction: Reaction | null;
  userReactionId: string | null;
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
  postReaction: (postId: string, commentId: string | null, reaction: Reaction) => Promise<void>;
  deleteReaction: (postId: string, commentId: string | null, reactionId: string) => Promise<void>;
}>({
  postComment: async () => {},
  postReply: async () => {},
  postReaction: async () => {},
  deleteReaction: async () => {},
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

// ==================== REACTION MENU ====================
function ReactionMenu({
  onSelect,
  disabled,
}: {
  onSelect: (reaction: Reaction) => void;
  disabled: boolean;
}) {
  const reactions = Object.values(Reaction);
  const reactionIcons: { [key in Reaction]: string } = {
    [Reaction.LIKE]: "👍",
    [Reaction.LOVE_FACE]: "❤️",
    [Reaction.SMILE_FACE]: "😊",
    [Reaction.WOW_FACE]: "😮",
    [Reaction.SAD_FACE]: "😢",
    [Reaction.CELEBRATION]: "🎉",
  };

  return (
    <div className="absolute bottom-full mb-2 flex gap-2 bg-white border border-gray-200 rounded-full p-2 shadow-lg z-10">
      {reactions.map((reaction) => (
        <button
          key={reaction}
          onClick={() => onSelect(reaction)}
          disabled={disabled}
          className="text-lg hover:bg-gray-100 rounded-full p-1 transition-colors"
          title={reaction}
        >
          {reactionIcons[reaction]}
        </button>
      ))}
    </div>
  );
}

// ==================== DATA TRANSFORM HELPERS ====================
const transformComment = (c: ApiComment, isReply = false, currentUserId: string): TransformedComment | TransformedReply => {
  const reactionCounts = c.reactions.reduce(
    (acc, r) => ({
      ...acc,
      [r.reaction]: (acc[r.reaction as Reaction] || 0) + 1,
    }),
    {} as { [key in Reaction]?: number },
  );

  const userReactionData = c.reactions.find((r) => r.user.id === currentUserId);

  return {
    id: c.id,
    author: `${c.user.firstName ?? ""} ${c.user.lastName ?? ""}`.trim() || "Unknown",
    authorProfileUrl: safeAvatar(c.user.profileUrl),
    authorColor: isReply ? "bg-orange-500" : "bg-blue-500",
    content: c.comment,
    timestamp: formatDate(c.createdAt),
    reactions: reactionCounts,
    userReaction: userReactionData?.reaction || null,
    userReactionId: userReactionData?.id || null,
    ...(isReply ? {} : { replies: c.replies.map((r) => transformComment(r, true, currentUserId) as TransformedReply) }),
  };
};

const transformApiData = (apiPosts: ApiPost[], currentUserId: string): TransformedPost[] => {
  return apiPosts
    .filter((post) => post.visibility.toLowerCase() !== "managers")
    .map((post) => {
      const reactionCounts = post.reactions.reduce(
        (acc, r) => ({
          ...acc,
          [r.reaction]: (acc[r.reaction as Reaction] || 0) + 1,
        }),
        {} as { [key in Reaction]?: number },
      );

      const userReactionData = post.reactions.find((r) => r.user.id === currentUserId);

      return {
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
        isAllowedToLike: post.isAllowedToLike,
        reactions: reactionCounts,
        userReaction: userReactionData?.reaction || null,
        userReactionId: userReactionData?.id || null,
        comments: post.comments.map((c) => transformComment(c, false, currentUserId) as TransformedComment),
      };
    });
};

// ==================== MAIN COMPONENT ====================
export default function App({ currentUserId }: { currentUserId: string }) {
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
  const userInfo = useGetUserProfileQuery({});

  const [postCommentMutation] = usePostCommentMutation();
  const [postReplyMutation] = usePostReplyMutation();
  const [postReactionMutation] = usePostReactionMutation();
  const [deleteReactionMutation] = useDeleteReactionMutation();

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

  const postReaction = async (postId: string, commentId: string | null, reaction: Reaction) => {
    try {
      await postReactionMutation({ recognitionId: postId, commentId, reaction }).unwrap();
      refetch();
    } catch (err) {
      console.error("Failed to post reaction:", err);
    }
  };

  const deleteReaction = async (postId: string, commentId: string | null, reactionId: string) => {
    try {
      await deleteReactionMutation({ recognitionId: postId, commentId, reactionId }).unwrap();
      refetch();
    } catch (err) {
      console.error("Failed to delete reaction:", err);
    }
  };

  // ==================== DATA TRANSFORM EFFECT ====================
  useEffect(() => {
    if (apiData?.data) {
      const transformed = transformApiData(apiData.data, currentUserId);
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
  }, [apiData, selectedFilter, currentUserId]);

  return (
    <ApiContext.Provider value={{ postComment, postReply, postReaction, deleteReaction }}>
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
  const { postComment, postReaction, deleteReaction } = useContext(ApiContext);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(post.comments);
  const [showReactionMenu, setShowReactionMenu] = useState(false);
  const [localReactions, setLocalReactions] = useState(post.reactions);
  const [localUserReaction, setLocalUserReaction] = useState(post.userReaction);
  const [localUserReactionId, setLocalUserReactionId] = useState(post.userReactionId);

  const reactionIcons: { [key in Reaction]: string } = {
    [Reaction.LIKE]: "👍",
    [Reaction.LOVE_FACE]: "❤️",
    [Reaction.SMILE_FACE]: "😊",
    [Reaction.WOW_FACE]: "😮",
    [Reaction.SAD_FACE]: "😢",
    [Reaction.CELEBRATION]: "🎉",
  };

  useEffect(() => {
    setComments(post.comments);
    setLocalReactions(post.reactions);
    setLocalUserReaction(post.userReaction);
    setLocalUserReactionId(post.userReactionId);
  }, [post]);

  const handlePostReaction = async (reaction: Reaction) => {
    if (!post.isAllowedToLike) return;

    if (localUserReaction === reaction && localUserReactionId) {
      // Remove reaction
      setLocalUserReaction(null);
      setLocalUserReactionId(null);
      setLocalReactions((prev) => ({
        ...prev,
        [reaction]: (prev[reaction] || 1) - 1,
      }));
      await deleteReaction(post.id, null, localUserReactionId);
    } else {
      // Add or change reaction
      setLocalUserReaction(reaction);
      setLocalUserReactionId("temp-id"); // Will be updated after refetch
      setLocalReactions((prev) => ({
        ...prev,
        [reaction]: (prev[reaction] || 0) + 1,
        ...(localUserReaction ? { [localUserReaction]: (prev[localUserReaction] || 1) - 1 } : {}),
      }));
      await postReaction(post.id, null, reaction);
    }
    setShowReactionMenu(false);
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    setShowCommentInput(false);
    await postComment(post.id, newComment);
    setNewComment("");
    setShowComments(true);
  };

  const totalComments = comments.reduce((total, c) => total + 1 + c.replies.length, 0);
  const totalReactions = Object.values(localReactions).reduce((sum, count) => sum + (count || 0), 0);

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
        <div className="relative flex-1">
          <button
            onClick={() => setShowReactionMenu(!showReactionMenu)}
            disabled={!post.isAllowedToLike}
            className={`flex items-center border rounded-full gap-2 flex-1 justify-center py-2 px-4 transition-colors cursor-pointer hover:bg-gray-50 ${
              localUserReaction ? "text-[#FFA000] font-semibold" : "text-gray-600"
            } ${!post.isAllowedToLike ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {localUserReaction ? (
              <span className="text-lg">{reactionIcons[localUserReaction]}</span>
            ) : (
              <ThumbsUp className="w-4 h-4" />
            )}
            {localUserReaction || "React"}
          </button>
          {showReactionMenu && (
            <ReactionMenu onSelect={handlePostReaction} disabled={!post.isAllowedToLike} />
          )}
        </div>
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
      {(totalReactions > 0 || totalComments > 0) && (
        <div className="px-6 py-2 border-b border-t border-gray-100 flex items-center justify-between text-sm text-gray-600">
          {totalReactions > 0 && (
            <div className="flex items-center gap-1">
              {Object.entries(localReactions)
                .filter(([_, count]) => count && count > 0)
                .map(([reaction], i) => (
                  <span key={i} className="text-lg">
                    {reaction === Reaction.LIKE && "👍"}
                    {reaction === Reaction.LOVE_FACE && "❤️"}
                    {reaction === Reaction.SMILE_FACE && "😊"}
                    {reaction === Reaction.WOW_FACE && "😮"}
                    {reaction === Reaction.SAD_FACE && "😢"}
                    {reaction === Reaction.CELEBRATION && "🎉"}
                  </span>
                ))}
              <span>{totalReactions}</span>
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
            submitting={false}
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
  const { postReply, postReaction, deleteReaction } = useContext(ApiContext);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [newReply, setNewReply] = useState("");
  const [reactionMenuState, setReactionMenuState] = useState<{ [key: string]: boolean }>({});

  const reactionIcons: { [key in Reaction]: string } = {
    [Reaction.LIKE]: "👍",
    [Reaction.LOVE_FACE]: "❤️",
    [Reaction.SMILE_FACE]: "😊",
    [Reaction.WOW_FACE]: "😮",
    [Reaction.SAD_FACE]: "😢",
    [Reaction.CELEBRATION]: "🎉",
  };

  const handleAddReply = async () => {
    if (!newReply.trim()) return;
    setShowReplyInput(false);
    await postReply(postId, comment.id, newReply);
    setNewReply("");
  };

  const handleCommentReaction = async (reaction: Reaction, commentId: string, userReactionId: string | null) => {
    setReactionMenuState((prev) => ({ ...prev, [commentId]: false }));
    if (userReactionId && comment.userReaction === reaction) {
      // Remove reaction
      await deleteReaction(postId, commentId, userReactionId);
    } else {
      // Add or change reaction
      await postReaction(postId, commentId, reaction);
    }
  };

  const toggleReactionMenu = (commentId: string) => {
    setReactionMenuState((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const totalReactions = Object.values(comment.reactions).reduce((sum, count) => sum + (count || 0), 0);

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
            <div className="relative">
              <button
                className={`hover:underline ${comment.userReaction ? "text-[#FFA000] font-semibold" : ""}`}
                onClick={() => toggleReactionMenu(comment.id)}
              >
                {comment.userReaction ? reactionIcons[comment.userReaction] : "React"}
              </button>
              {reactionMenuState[comment.id] && (
                <ReactionMenu onSelect={(reaction) => handleCommentReaction(reaction, comment.id, comment.userReactionId)} disabled={false} />
              )}
            </div>
          </div>

          {totalReactions > 0 && (
            <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
              {Object.entries(comment.reactions)
                .filter(([_, count]) => count && count > 0)
                .map(([reaction], i) => (
                  <span key={i} className="text-sm">
                    {reaction === Reaction.LIKE && "👍"}
                    {reaction === Reaction.LOVE_FACE && "❤️"}
                    {reaction === Reaction.SMILE_FACE && "😊"}
                    {reaction === Reaction.WOW_FACE && "😮"}
                    {reaction === Reaction.SAD_FACE && "😢"}
                    {reaction === Reaction.CELEBRATION && "🎉"}
                  </span>
                ))}
              <span>{totalReactions}</span>
            </div>
          )}

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
                submitting={false}
                submitLabel="Reply"
              />
            </div>
          )}

          {comment.replies.length > 0 && (
            <div className="pl-10 mt-2 space-y-2">
              {comment.replies.map((r) => (
                <div key={r.id} className="flex gap-3">
                  <img src={r.authorProfileUrl} alt={r.author} className="w-7 h-7 rounded-full object-cover" />
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-xl p-2 text-sm text-gray-700">
                      <span className="font-semibold">{r.author}:</span> {r.content}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      <span>{r.timestamp}</span>
                      <div className="relative">
                        <button
                          className={`hover:underline ${r.userReaction ? "text-[#FFA000] font-semibold" : ""}`}
                          onClick={() => toggleReactionMenu(r.id)}
                        >
                          {r.userReaction ? reactionIcons[r.userReaction] : "React"}
                        </button>
                        {reactionMenuState[r.id] && (
                          <ReactionMenu onSelect={(reaction) => handleCommentReaction(reaction, r.id, r.userReactionId)} disabled={false} />
                        )}
                      </div>
                    </div>
                    {Object.values(r.reactions).some((count) => count && count > 0) && (
                      <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                        {Object.entries(r.reactions)
                          .filter(([_, count]) => count && count > 0)
                          .map(([reaction], i) => (
                            <span key={i} className="text-sm">
                              {reaction === Reaction.LIKE && "👍"}
                              {reaction === Reaction.LOVE_FACE && "❤️"}
                              {reaction === Reaction.SMILE_FACE && "😊"}
                              {reaction === Reaction.WOW_FACE && "😮"}
                              {reaction === Reaction.SAD_FACE && "😢"}
                              {reaction === Reaction.CELEBRATION && "🎉"}
                            </span>
                          ))}
                        <span>{Object.values(r.reactions).reduce((sum, count) => sum + (count || 0), 0)}</span>
                      </div>
                    )}
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