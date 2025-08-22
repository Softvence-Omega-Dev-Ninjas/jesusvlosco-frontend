/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import down from "@/assets/arrow_drop_down.svg";
import comment from "@/assets/comment.png";
import { useGetUserProfileQuery } from "@/store/api/auth/authApi";
import {
  useGetAllCommentLikeQuery,
  usePostCommentMutation,
  usePostReactionMutation,
  usePostReplyMutation,
} from "@/store/api/user/userRecognition";
import { Eye, Send, ThumbsUp } from "lucide-react";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

// Fallback avatar image
const FALLBACK_AVATAR = "https://avatar.iran.liara.run/public";

// Reaction icon mapping without unwanted fill
const REACTION_ICONS: { [key: string]: React.ReactNode } = {
  LIKE: (
    <span className="text-xl hover:scale-110 transition-transform duration-200">
      👍
    </span>
  ),
  LOVE_FACE: (
    <span className="text-xl hover:scale-110 transition-transform duration-200">
      ❤️
    </span>
  ),
  SMILE_FACE: (
    <span className="text-xl hover:scale-110 transition-transform duration-200">
      😄
    </span>
  ),
  WOW_FACE: (
    <span className="text-xl hover:scale-110 transition-transform duration-200">
      😮
    </span>
  ),
  SAD_FACE: (
    <span className="text-xl hover:scale-110 transition-transform duration-200">
      😢
    </span>
  ),
  CELEBRATION: (
    <span className="text-xl hover:scale-110 transition-transform duration-200">
      🎉
    </span>
  ),
};

const REACTION_TYPES = [
  "LIKE",
  "LOVE_FACE",
  "SMILE_FACE",
  "WOW_FACE",
  "SAD_FACE",
  "CELEBRATION",
];
// Reaction Text Mapping
const REACTION_TEXT: { [key: string]: string } = {
  LIKE: "Like",
  LOVE_FACE: "Love",
  SMILE_FACE: "Smile",
  WOW_FACE: "Wow",
  SAD_FACE: "Sad",
  CELEBRATION: "Celebrate",
};

// Types (unchanged, included for reference)
interface ApiUser {
  id: string;
  name?: string;
  profileUrl?: string;
  initial?: string;
  firstName?: string;
  lastName?: string;
  jobTitle?: string;
}

interface ApiComment {
  id: string;
  comment: string;
  user: ApiUser;
  replies: ApiComment[];
  reactions?: {
    id: string;
    reaction: string;
    user: ApiUser;
    recognitionUserId: string;
  }[];
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
  reactions: {
    id: string;
    reaction: string;
    user: ApiUser;
    recognitionUserId: string;
  }[];
}

interface TransformedComment {
  id: string;
  author: string;
  authorProfileUrl: string;
  authorColor: string;
  content: string;
  timestamp: string;
  likes: number;
  liked: boolean;
  userReaction?: string;
  replies: TransformedReply[];
  showReplyInput?: boolean;
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
  userReaction?: string;
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
  userReaction?: string;
  likeCount: number;
  comments: TransformedComment[];
}

interface RecognitionType {
  id: string;
  title: string;
  emoji: string;
  bgColor: string;
}

// Reaction Picker Component (unchanged)
function ReactionPicker({
  onSelect,
  isOpen,
  setIsOpen,
}: {
  onSelect: (reaction: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={pickerRef}
      className="absolute z-10 flex gap-2 p-2 bg-white rounded-full shadow-lg border border-gray-200 -top-12"
    >
      {REACTION_TYPES.map((reaction) => (
        <button
          key={reaction}
          onClick={() => {
            onSelect(reaction);
            setIsOpen(false);
          }}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          {REACTION_ICONS[reaction]}
        </button>
      ))}
    </div>
  );
}

// Context to provide API functions globally (unchanged)
export const ApiContext = createContext<{
  postComment: (postId: string, commentContent: string) => Promise<void>;
  postReply: (
    postId: string,
    commentId: string,
    replyContent: string
  ) => Promise<void>;
  postReaction: (
    postId: string,
    reaction: string,
    parentCommentId?: string
  ) => Promise<void>;
} | null>(null);

export default function App() {
  const [posts, setPosts] = useState<TransformedPost[]>([]);
  const [recognitionTypes, setRecognitionTypes] = useState<RecognitionType[]>(
    []
  );
  const [selectedFilter, setSelectedFilter] = useState("All Recognitions");

  // Map UI filter values to API-compatible values
  const filterMap: { [key: string]: string } = {
    "All Recognitions": "all",
    "Shared with me": "sharedWithMe",
  };

  // RTK Query Hooks
  const {
    data: userInfo,
    isLoading: isUserLoading,
    error: userError,
  } = useGetUserProfileQuery({});
  const {
    data: apiData,
    error,
    isLoading,
    refetch,
  } = useGetAllCommentLikeQuery(
    {
      type: filterMap[selectedFilter],
      status: "DRAFT",
      orderBy: "asc",
    },
    {
      skip: !userInfo?.data?.id, // Wait for userInfo to be available
    }
  );
  const [postCommentMutation] = usePostCommentMutation();
  const [postReplyMutation] = usePostReplyMutation();
  const [postReactionMutation] = usePostReactionMutation();

  // Current user ID from userInfo
  const CURRENT_USER_ID = userInfo?.data?.id;

  // Transform API data to component format
  const transformApiData = (apiPosts: ApiPost[]): TransformedPost[] => {
    const transformReply = (reply: ApiComment): TransformedReply => {
      const replyUserReaction = reply.reactions?.find(
        (r) => r.recognitionUserId === CURRENT_USER_ID
      )?.reaction;
      return {
        id: reply.id,
        author: `${reply.user.firstName} ${reply.user.lastName}`,
        authorProfileUrl: reply.user.profileUrl ?? FALLBACK_AVATAR,
        authorColor: "bg-orange-500",
        content: reply.comment,
        timestamp: reply.createdAt
          ? new Date(reply.createdAt).toLocaleString()
          : new Date().toLocaleString(),
        likes: reply.reactions?.length ?? 0,
        liked: !!replyUserReaction,
        userReaction: replyUserReaction,
        replies: reply.replies.map(transformReply),
        showReplyInput: false,
      };
    };

    return apiPosts
      .filter((post) => post.visibility.toLowerCase() !== "managers")
      .map((post) => {
        const userReaction = post.reactions.find(
          (r) => r.recognitionUserId === CURRENT_USER_ID
        )?.reaction;
        return {
          id: post.id,
          recognizer: post.recognitionUsers[0]?.name || "Unknown",
          recognizerProfileUrl:
            post.recognitionUsers[0]?.profileUrl || FALLBACK_AVATAR,
          emoji: post.badge.iconImage,
          recipients: post.recognitionUsers.map((user) => ({
            name: user.name ?? "Unknown",
            profileUrl: user.profileUrl ?? FALLBACK_AVATAR,
          })),
          recognitionType: post.badge.title,
          message: post.message,
          timestamp: new Date(post.createdAt).toLocaleString(),
          visibility: post.visibility,
          liked: !!userReaction,
          userReaction: userReaction,
          likeCount: post.reactions.length,
          comments: post.comments.map((comment) => {
            const commentUserReaction = comment.reactions?.find(
              (r) => r.recognitionUserId === CURRENT_USER_ID
            )?.reaction;
            return {
              id: comment.id,
              author: `${comment.user.firstName} ${comment.user.lastName}`,
              authorProfileUrl: comment.user.profileUrl ?? FALLBACK_AVATAR,
              authorColor: "bg-blue-500",
              content: comment.comment,
              timestamp: comment.createdAt
                ? new Date(comment.createdAt).toLocaleString()
                : new Date().toLocaleString(),
              likes: comment.reactions?.length ?? 0,
              liked: !!commentUserReaction,
              userReaction: commentUserReaction,
              replies: comment.replies.map(transformReply),
              showReplyInput: false,
            };
          }),
        };
      });
  };

  // Update posts & recognition types when API data or filter changes
  useEffect(() => {
    if (apiData?.data) {
      const transformed = transformApiData(apiData.data);
      setPosts(transformed);

      interface Badge {
        id: string;
        title: string;
        category: string;
        iconImage: string;
      }

      interface PostWithBadge {
        badge: Badge;
      }

      const data = apiData?.data as PostWithBadge[];
      const types: RecognitionType[] =
        data?.reduce((acc: RecognitionType[], post: PostWithBadge) => {
          if (!acc.some((type) => type.id === post.badge.id)) {
            acc.push({
              id: post.badge.id,
              title: post.badge.title,
              emoji: post.badge.iconImage,
              bgColor: `bg-${post.badge.category.toLowerCase()}-100`,
            });
          }
          return acc;
        }, [] as RecognitionType[]) || [];
      setRecognitionTypes(types);
    }
  }, [apiData, selectedFilter]);

  // API action functions
  const postComment = async (postId: string, commentContent: string) => {
    try {
      await postCommentMutation({
        recognitionId: postId,
        comment: commentContent,
      }).unwrap();
      refetch();
    } catch (err) {
      console.error("Failed to post comment:", err);
    }
  };

  const postReply = async (
    postId: string,
    commentId: string,
    replyContent: string
  ) => {
    try {
      await postReplyMutation({
        recognitionId: postId,
        parentCommentId: commentId,
        comment: replyContent,
      }).unwrap();
      refetch();
    } catch (err) {
      console.error("Failed to post reply:", err);
    }
  };

  const postReaction = async (
    postId: string,
    reaction: string,
    parentCommentId?: string
  ) => {
    try {
      await postReactionMutation({
        recognitionId: postId,
        reaction,
        parentCommentId,
      }).unwrap();
      refetch();
    } catch (err) {
      console.error("Failed to post reaction:", err);
    }
  };

  return (
    <ApiContext.Provider value={{ postComment, postReply, postReaction }}>
      <div className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <div className="bg-[#FFFFFF] max-w-lg mx-auto">
          <div className="max-w-2xl mx-auto px-6 py-6">
            <h1 className="text-2xl font-bold text-[#484848] mb-6">
              My Recognitions
            </h1>
            {/* Recognition Type Cards */}
            {isUserLoading ? (
              <p className="text-center text-gray-500">
                Loading user profile...
              </p>
            ) : userError ? (
              <p className="text-center text-red-500">
                Error loading user profile. Please try again.
              </p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {recognitionTypes.map((type) => (
                  <div
                    key={type.id}
                    className="flex flex-col items-start cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="w-24 h-24 rounded-full flex items-center justify-center mb-2">
                        <img
                          src={type.emoji}
                          alt={type.title}
                          className="object-contain h-20"
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-700">
                        {type.title}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* Main Content */}
        <div className="max-w-lg mx-auto py-10">
          {/* Feed Header */}
          <div className="flex flex-col gap-4 md:flex-row items-center justify-between mb-6">
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
                <option>Shared with me</option>
              </select>
              <img
                src={down}
                alt="Dropdown icon"
                className="w-2 h-2 absolute right-6 top-1/2 transform -translate-y-1/2 pointer-events-none"
              />
            </div>
          </div>
          {/* Loading and Error states */}
          {isUserLoading ? (
            <p className="text-center text-gray-500">Loading user profile...</p>
          ) : userError ? (
            <p className="text-center text-red-500">
              Error loading user profile. Please try again.
            </p>
          ) : isLoading ? (
            <p className="text-center">Loading recognitions...</p>
          ) : error ? (
            <p className="text-center text-red-500">
              Error loading recognitions. Please try again.
            </p>
          ) : (
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

// RecognitionPostCard, CommentCard, ReplyCard components remain unchanged
// (Omitted for brevity, as they are identical to your original code)

// Sub-component for a single recognition post
function RecognitionPostCard({ post }: { post: TransformedPost }) {
  const context = useContext(ApiContext);
  const postComment = context?.postComment ?? (() => Promise.resolve());
  const postReaction = context?.postReaction ?? (() => Promise.resolve());
  const { data: userInfo } = useGetUserProfileQuery({});
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(post.comments);
  const [isCommenting, setIsCommenting] = useState(false);
  const [isReacting, setIsReacting] = useState(false);
  const [localLiked, setLocalLiked] = useState(post.liked);
  const [localLikeCount, setLocalLikeCount] = useState(post.likeCount);
  const [localUserReaction, setLocalUserReaction] = useState(post.userReaction);
  const [showReactionPicker, setShowReactionPicker] = useState(false);

  // Update state when post prop changes
  useEffect(() => {
    setComments(post.comments);
    setLocalLikeCount(post.likeCount);
    setLocalLiked(post.liked);
    setLocalUserReaction(post.userReaction);
  }, [post]);

  const handleReactionSelect = async (reaction: string) => {
    if (isReacting) return;
    setIsReacting(true);
    const isNewReaction = localUserReaction !== reaction;
    setLocalLiked(true);
    setLocalUserReaction(reaction);
    setLocalLikeCount((prev) =>
      isNewReaction ? prev + (localLiked ? 0 : 1) : prev
    );
    await postReaction(post.id, reaction);
    setIsReacting(false);
  };

  const handleAddComment = async () => {
    if (newComment.trim()) {
      setIsCommenting(true);
      await postComment(post.id, newComment);
      setNewComment("");
      setShowCommentInput(false);
      setShowComments(true);
      setIsCommenting(false);
    }
  };

  const totalComments = comments.reduce(
    (total, comment) => total + 1 + comment.replies.length,
    0
  );

  return (
    <div className="max-w-lg mx-auto rounded-xl bg-white p-4 border-gray-200">
      {/* Main Post Content */}
      <div className="relative rounded-2xl bg-[#FFF6DC] p-8 overflow-hidden">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-lg font-semibold text-[#484848]">
            {post.recognizer} is Recognized
          </h2>
          <p className="text-gray-600 mt-2">{post.message}</p>
        </div>
        {/* Responsive Profile Section */}
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-8 mb-6">
          <div className="flex flex-col items-center">
            <img
              src={post.recognizerProfileUrl}
              alt={post.recognizer}
              className="w-14 h-14 rounded-full object-cover"
              onError={(e) => (e.currentTarget.src = FALLBACK_AVATAR)}
            />
          </div>
          <div className="flex flex-col items-center">
            <div className="w-26 h-26 p-4 bg-[#FFFBEFB8] rounded-full flex items-center justify-center">
              <img
                src={post.emoji}
                alt="badge"
                className="object-contain h-16"
              />
            </div>
          </div>
          {post.recipients.slice(0, 1).map((recipient, index) => (
            <div key={index} className="flex flex-col items-center">
              <img
                src={recipient.profileUrl}
                alt={recipient.name}
                className="w-14 h-14 rounded-full object-cover"
                onError={(e) => (e.currentTarget.src = FALLBACK_AVATAR)}
              />
            </div>
          ))}
        </div>
        {/* Recognition Text */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-[#484848]">
            {post.recognitionType}
          </h3>
        </div>
      </div>
      {/* Post Metadata */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{post.timestamp}</span>
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>{post.visibility.replace(/_/g, " ")}</span>
          </div>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="py-3">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <button
              onClick={() => setShowReactionPicker(true)}
              onMouseEnter={() => setShowReactionPicker(true)}
              disabled={isReacting}
              className={`flex items-center border rounded-full gap-2 flex-1 justify-center py-2 px-3 transition-colors cursor-pointer hover:bg-gray-50 ${
                localLiked ? "text-[#FFA000]" : "text-gray-600"
              }`}
            >
              {/* Show the icon with human-readable text */}
              {localLiked && localUserReaction ? (
                REACTION_ICONS[localUserReaction] || (
                  <ThumbsUp className="w-6 h-6 fill-current" />
                )
              ) : (
                <ThumbsUp className="w-6 h-6" />
              )}
              {/* Show human-readable reaction text */}
              {isReacting
                ? "Reacting..."
                : localUserReaction && REACTION_TEXT[localUserReaction] || "React"}
            </button>
            <ReactionPicker
              onSelect={handleReactionSelect}
              isOpen={showReactionPicker}
              setIsOpen={setShowReactionPicker}
            />
          </div>
          <button
            className="flex items-center gap-2 justify-center text-gray-600 py-2 px-4 border rounded-full transition-colors cursor-pointer hover:bg-gray-50"
            onClick={() => {
              setShowCommentInput(!showCommentInput);
              setShowComments(true);
            }}
          >
            <img src={comment} alt="" className="w-4 h-4" />
            Comment
          </button>
        </div>
      </div>
      {/* Engagement Stats */}
      {(localLikeCount > 0 || totalComments > 0) && (
        <div className="px-6 py-2 border-b border-t border-gray-100">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-1">
              {localLikeCount > 0 && (
                <>
                  {localUserReaction ? (
                    REACTION_ICONS[localUserReaction] || (
                      <ThumbsUp className="w-4 h-4 text-[#FFA000] fill-current" />
                    )
                  ) : (
                    <ThumbsUp className="w-4 h-4 text-[#FFA000] fill-current" />
                  )}
                  <span>{localLikeCount}</span>
                </>
              )}
            </div>
            {totalComments > 0 && (
              <button
                className="hover:underline cursor-pointer"
                onClick={() => setShowComments(!showComments)}
              >
                {showComments
                  ? "Hide Comments"
                  : `${totalComments} ${
                      totalComments === 1 ? "Comment" : "Comments"
                    }`}
              </button>
            )}
          </div>
        </div>
      )}
      {/* Comment Input */}
      {showCommentInput && (
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex gap-3">
            <img
              src={userInfo?.data?.profile?.profileUrl || FALLBACK_AVATAR}
              alt="Current User"
              className="w-8 h-8 rounded-full object-cover"
              onError={(e) => (e.currentTarget.src = FALLBACK_AVATAR)}
            />
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
                  disabled={!newComment.trim() || isCommenting}
                >
                  <Send className="w-4 h-4" />
                  {isCommenting ? "Posting..." : "Post"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Comments Section */}
      {showComments && comments.length > 0 && (
        <div className="px-6 py-4">
          <div className="space-y-4">
            {comments.map((comment) => (
              <CommentCard
                key={comment.id}
                comment={comment}
                postId={post.id}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Sub-component for a single comment and its replies
function CommentCard({
  comment,
  postId,
}: {
  comment: TransformedComment;
  postId: string;
}) {
  const context = useContext(ApiContext);
  const postReply = context?.postReply ?? (() => Promise.resolve());
  const postReaction = context?.postReaction ?? (() => Promise.resolve());
  const [showReplyInput, setShowReplyInput] = useState(
    comment.showReplyInput || false
  );
  const [newReply, setNewReply] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [isReacting, setIsReacting] = useState(false);
  const [localLiked, setLocalLiked] = useState(comment.liked);
  const [localLikeCount, setLocalLikeCount] = useState(comment.likes);
  const [localUserReaction, setLocalUserReaction] = useState(
    comment.userReaction
  );
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const { data: userInfo } = useGetUserProfileQuery({});

  const handleReactionSelect = async (reaction: string) => {
    if (isReacting) return;
    setIsReacting(true);
    const isNewReaction = localUserReaction !== reaction;
    setLocalLiked(true);
    setLocalUserReaction(reaction);
    setLocalLikeCount((prev) =>
      isNewReaction ? prev + (localLiked ? 0 : 1) : prev
    );
    await postReaction(postId, reaction, comment.id);
    setIsReacting(false);
  };

  const handleAddReply = async () => {
    if (newReply.trim()) {
      setIsReplying(true);
      await postReply(postId, comment.id, newReply);
      setNewReply("");
      setShowReplyInput(false);
      setIsReplying(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Main Comment */}
      <div className="flex gap-3">
        <img
          src={comment.authorProfileUrl}
          alt={comment.author}
          className="w-8 h-8 rounded-full object-cover"
          onError={(e) => (e.currentTarget.src = FALLBACK_AVATAR)}
        />
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
              className="hover:underline cursor-pointer"
              onClick={() => setShowReplyInput(!showReplyInput)}
            >
              Reply
            </button>
            <div className="relative">
              <button
                onClick={() => setShowReactionPicker(true)}
                onMouseEnter={() => setShowReactionPicker(true)}
                disabled={isReacting}
                className={`flex items-center gap-1 ${
                  localLiked ? "text-[#FFA000]" : "text-gray-500"
                }`}
              >
                {localLiked && localUserReaction ? (
                  REACTION_ICONS[localUserReaction] || (
                    <ThumbsUp className="w-4 h-4 fill-current" />
                  )
                ) : (
                  <ThumbsUp className="w-4 h-4" />
                )}
                <span>{localLikeCount || ""}</span>
              </button>
              <ReactionPicker
                onSelect={handleReactionSelect}
                isOpen={showReactionPicker}
                setIsOpen={setShowReactionPicker}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Reply Input */}
      {showReplyInput && (
        <div className="ml-11">
          <div className="flex gap-3">
            <img
              src={userInfo?.data?.profile?.profileUrl || FALLBACK_AVATAR}
              alt="Current User"
              className="w-8 h-8 rounded-full object-cover"
              onError={(e) => (e.currentTarget.src = FALLBACK_AVATAR)}
            />
            <div className="flex-1">
              <textarea
                placeholder="Write a reply..."
                value={newReply}
                onChange={(e) => setNewReply(e.target.value)}
                className="w-full min-h-[60px] p-3 border border-gray-200 rounded-md resize-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
                  onClick={() => {
                    setShowReplyInput(false);
                    setNewReply("");
                  }}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                  onClick={handleAddReply}
                  disabled={!newReply.trim() || isReplying}
                >
                  <Send className="w-4 h-4" />
                  {isReplying ? "Replying..." : "Reply"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Replies */}
      {comment.replies.map((reply) => (
        <ReplyCard
          key={reply.id}
          reply={reply}
          postId={postId}
          parentCommentId={comment.id}
        />
      ))}
    </div>
  );
}

// Sub-component for a single reply
function ReplyCard({
  reply,
  postId,
  
}: {
  reply: TransformedReply;
  postId: string;
  parentCommentId: string;
}) {
  const context = useContext(ApiContext);
  const postReply = context?.postReply ?? (() => Promise.resolve());
  const postReaction = context?.postReaction ?? (() => Promise.resolve());
  const [showReplyInput, setShowReplyInput] = useState(
    reply.showReplyInput || false
  );
  const [newReply, setNewReply] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [isReacting, setIsReacting] = useState(false);
  const [localLiked, setLocalLiked] = useState(reply.liked);
  const [localLikeCount, setLocalLikeCount] = useState(reply.likes);
  const [localUserReaction, setLocalUserReaction] = useState(
    reply.userReaction
  );
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const { data: userInfo } = useGetUserProfileQuery({});

  const handleReactionSelect = async (reaction: string) => {
    if (isReacting) return;
    setIsReacting(true);
    const isNewReaction = localUserReaction !== reaction;
    setLocalLiked(true);
    setLocalUserReaction(reaction);
    setLocalLikeCount((prev) =>
      isNewReaction ? prev + (localLiked ? 0 : 1) : prev
    );
    await postReaction(postId, reaction, reply.id); // Fixed: Use reply.id for reactions
    setIsReacting(false);
  };

  const handleAddReply = async () => {
    if (newReply.trim()) {
      setIsReplying(true);
      await postReply(postId, reply.id, newReply); // Use reply.id for nested replies
      setNewReply("");
      setShowReplyInput(false);
      setIsReplying(false);
    }
  };

  return (
    <div className="space-y-3 ml-11">
      {/* Main Reply */}
      <div className="flex gap-3">
        <img
          src={reply.authorProfileUrl}
          alt={reply.author}
          className="w-8 h-8 rounded-full object-cover"
          onError={(e) => (e.currentTarget.src = FALLBACK_AVATAR)}
        />
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
              className="hover:underline cursor-pointer"
              onClick={() => setShowReplyInput(!showReplyInput)}
            >
              Reply
            </button>
            <div className="relative">
              <button
                onClick={() => setShowReactionPicker(true)}
                onMouseEnter={() => setShowReactionPicker(true)}
                disabled={isReacting}
                className={`flex items-center gap-1 ${
                  localLiked ? "text-[#FFA000]" : "text-gray-500"
                }`}
              >
                {localLiked && localUserReaction ? (
                  REACTION_ICONS[localUserReaction] || (
                    <ThumbsUp className="w-4 h-4 fill-current" />
                  )
                ) : (
                  <ThumbsUp className="w-4 h-4" />
                )}
                <span>{localLikeCount || ""}</span>
              </button>
              <ReactionPicker
                onSelect={handleReactionSelect}
                isOpen={showReactionPicker}
                setIsOpen={setShowReactionPicker}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Reply Input */}
      {showReplyInput && (
        <div className="ml-11">
          <div className="flex gap-3">
            <img
              src={userInfo?.data?.profile?.profileUrl || FALLBACK_AVATAR}
              alt="Current User"
              className="w-8 h-8 rounded-full object-cover"
              onError={(e) => (e.currentTarget.src = FALLBACK_AVATAR)}
            />
            <div className="flex-1">
              <textarea
                placeholder="Write a reply..."
                value={newReply}
                onChange={(e) => setNewReply(e.target.value)}
                className="w-full min-h-[60px] p-3 border border-gray-200 rounded-md resize-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
                  onClick={() => {
                    setShowReplyInput(false);
                    setNewReply("");
                  }}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                  onClick={handleAddReply}
                  disabled={!newReply.trim() || isReplying}
                >
                  <Send className="w-4 h-4" />
                  {isReplying ? "Replying..." : "Reply"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Nested Replies */}
      {reply.replies.map((nestedReply) => (
        <ReplyCard
          key={nestedReply.id}
          reply={nestedReply}
          postId={postId}
          parentCommentId={reply.id}
        />
      ))}
    </div>
  );
}
