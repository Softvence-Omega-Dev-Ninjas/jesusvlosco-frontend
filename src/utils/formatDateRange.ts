export function formatDateRange(start: string, end: string): string {
  const startDate = new Date(start);
  const endDate = new Date(end);

  // Format options
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  };
  const yearOptions: Intl.DateTimeFormatOptions = { year: "numeric" };

  // Format start and end
  const startFormatted = startDate.toLocaleDateString("en-US", options);
  const endFormatted = endDate.toLocaleDateString("en-US", options);
  const yearFormatted = endDate.toLocaleDateString("en-US", yearOptions);

  // Difference in days
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return `${startFormatted} - ${endFormatted}, ${yearFormatted} (${diffDays} days)`;
}
