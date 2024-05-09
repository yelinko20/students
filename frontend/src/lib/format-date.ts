import moment from "moment";

export function formatDate(originalDate: string) {
  const parsedDate = moment(originalDate);

  const formattedDate = parsedDate.format("YYYY-MM-DD");
  return formattedDate;
}
