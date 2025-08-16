/* eslint-disable @typescript-eslint/no-explicit-any */
interface Reaction {
  emoji: string;
  count: number;
  users: string[];
}
const reactionsWithEmoji = [
  { label: "LIKE", emoji: "👍" },
  { label: "LOVE_FACE", emoji: "❤️" },
  { label: "SMILE_FACE", emoji: "😊" },
  { label: "WOW_FACE", emoji: "😮" },
  { label: "SAD_FACE", emoji: "😢" },
  { label: "CELEBRATION", emoji: "🎉" },
];

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

export default ReactionDisplay;
