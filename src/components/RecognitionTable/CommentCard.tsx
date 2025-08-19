/* eslint-disable @typescript-eslint/no-explicit-any */

export default function CommentCard({ comment }: { comment: any }) {
  return (
    <div className="flex items-start space-x-3 p-3 rounded-lg border-b border-gray-200 bg-white ">
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold">
        {comment.user.firstName[0]}
      </div>

      {/* Content */}
      <div>
        <div className="flex items-center space-x-2">
          <p className="font-semibold text-sm">
            {comment.user.firstName} {comment.user.lastName}
          </p>
        </div>

        <p className="mt-1 text-sm text-gray-800">{comment.comment}</p>

        {/* <span className="text-xs text-gray-400">
          {new Date(comment.createdAt).toLocaleString()}
        </span> */}
      </div>
    </div>
  );
}
