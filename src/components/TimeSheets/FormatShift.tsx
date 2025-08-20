export default function FormatShift({
  start,
  end,
}: {
  start: string;
  end: string;
}) {
  const startDate = new Date(start);
  const endDate = new Date(end);

  const dateFormatter = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
  });

  const timeFormatter = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const durationMs = endDate.getTime() - startDate.getTime();
  const durationHours =
    Math.floor(durationMs / (1000 * 60 * 60))
      .toString()
      .padStart(2, "0") + ":00 hours";

  return (
    <div className="flex items-center gap-8">
      <div>
        {dateFormatter.format(startDate)}
        <br />
        {timeFormatter.format(startDate)}
        <br />({durationHours})
        <br />
      </div>
      <div>
        {dateFormatter.format(endDate)}
        <br />
        {timeFormatter.format(endDate)}
        <br />({durationHours})
      </div>
    </div>
  );
}
