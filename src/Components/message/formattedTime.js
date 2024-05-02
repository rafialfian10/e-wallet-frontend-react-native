import moment from "moment";

function FormattedTime(time) {
  const durationMoment = moment.duration(time);
  let formatted = "";

  if (durationMoment.hours() > 0) {
    formatted += durationMoment.hours() + ":";
  }

  formatted +=
    (durationMoment.minutes() < 10 ? "0" : "") + durationMoment.minutes() + ":";
  formatted +=
    (durationMoment.seconds() < 10 ? "0" : "") + durationMoment.seconds();

  return formatted;
}

export default FormattedTime;
