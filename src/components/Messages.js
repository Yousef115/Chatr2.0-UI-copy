import React from "react";

const Messages = props => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
  //   const days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Satur"];
  let timestamp = new Date(props.messageObject.timestamp);
  //   const day = days[timestamp.getDay()];
  const date = timestamp.getDate();
  const month = months[timestamp.getMonth()];
  const year = timestamp.getFullYear();
  let hour = timestamp.getHours();
  let meridiem = "a.m.";
  if (hour > 12) {
    hour -= 12;
    meridiem = "p.m.";
  }
  let minute = timestamp.getMinutes();
  if (minute < 10) {
    minute = "0" + minute;
  }
  const datestamp = month + ". " + date + ", " + year;
  timestamp = hour + ":" + minute + " " + meridiem;

  const copyText = () => {
    const copiedText = props.messageObject.message;
    navigator.clipboard.writeText(copiedText);
  };

  const forwardText = () => {
    this.setState({ forwardmsg: props.messageObject.message });
  };

  return (
    <div className="card">
      <h5 className="card-header">
        {props.messageObject.username}
        <small className="float-right">
          {timestamp} | <span className="text-muted">{datestamp}</span>
        </small>
        <button className="float-right mx-5 btn-sm btn-info" onClick={copyText}>
          COPY
        </button>
        <button
          className="float-right ml-5 btn-sm btn-primary"
          onClick={forwardText}
        >
          FORWARD
        </button>
      </h5>
      <div className="card-body">
        <p className="card-text">{props.messageObject.message}</p>
      </div>
    </div>
  );
};

export default Messages;
