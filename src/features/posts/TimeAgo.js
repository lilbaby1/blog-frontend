import { parseISO, formatDistanceToNow } from "date-fns";

const TimeAgo = ({ timestamp, edited }) => {
  let timeAgo = "";
  if (timestamp) {
    const date = parseISO(timestamp);
    const timePeriod = formatDistanceToNow(date);
    timeAgo = `${timePeriod} ago`;
  }
  return (
    <span className="timeAgo">
      {edited ? "edited" : "posted"} {timeAgo}
    </span>
  );
};

export default TimeAgo;
