import React from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import Messages from "./Messages";

import { fetchChannel, sendMessage } from "../redux/actions";

class Channel extends React.Component {
  state = {
    message: ""
  };

  changeHandler = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  submitHandler = event => {
    event.preventDefault();
    this.props.sendMessage(
      this.props.match.params.channelID,
      this.state,
      this.props.user
    );
    let text = document.messageForm.message;
    text.value = "";
  };

  pressHandler = event => {
    if (event.key === "Enter") {
      event.preventDefault();
      this.props.sendMessage(
        this.props.match.params.channelID,
        this.state,
        this.props.user
      );
      let text = document.messageForm.message;
      text.value = "";
    }
  };

  componentDidMount() {
    const channelID = this.props.match.params.channelID;
    const channelAvailable = this.props.fetchedChannels.find(
      channel => parseInt(channel.id) === parseInt(channelID)
    );
    if (!channelAvailable) {
      this.props.fetchChannel(channelID, []);
    } else {
      this.props.fetchChannel(channelID, channelAvailable.messages);
    }
  }

  componentDidUpdate(prevProps) {
    const channelID = this.props.match.params.channelID;
    if (channelID !== prevProps.match.params.channelID) {
      const channelAvailable = this.props.fetchedChannels.find(
        channel => parseInt(channel.id) === parseInt(channelID)
      );
      if (!channelAvailable) {
        this.props.fetchChannel(channelID, []);
      } else {
        this.props.fetchChannel(channelID, channelAvailable.messages);
      }
    }
    // if (this.props.channel !== prevProps.channel) {
    //   const chat = document.getElementById("chat");
    //   chat.scrollIntoView(false);
    //  // const timestamp = this.props.channel[this.props.channel.length - 1]
    //  //   .timestamp;
    //  // setTimeout(() => {
    //  //   this.props.fetchNewMessages(channelID, timestamp);
    //  // }, 5000);
    // }
  }

  render() {
    let messages;
    let channel;
    if (!this.props.user) return <Redirect to="/login" />;
    if (this.props.loading) {
      return (
        <div>
          <h1>Loading</h1>
        </div>
      );
    } else {
      const channelID = this.props.match.params.channelID;
      if (this.props.fetchedChannels.length > 0) {
        channel = this.props.fetchedChannels.find(
          channel => parseInt(channel.id) === parseInt(channelID)
        );
        if (channel) {
          messages = channel.messages.map((messageObject, index) => (
            <Messages key={index} messageObject={messageObject} />
          ));
          // } else {
          //   messages = this.props.fetchedChannels[0].map(
          //     (messageObject, index) => (
          //       <Messages key={index} messageObject={messageObject.messages} />
          //     )
          //   );
        }
      }
      // let channelName = "";
      // if (this.props.allChannels.length > 0) {
      const channelName = this.props.allChannels.find(
        channel => channel.id === +channelID
      ).name;
      // }
      return (
        <div id="chat">
          {messages}
          <form name="messageForm" onSubmit={this.submitHandler}>
            <div className="row">
              <div className="col-10" style={{ paddingRight: 0 }}>
                <textarea
                  style={{ height: "100%", width: "100%", resize: "none" }}
                  name="message"
                  placeholder={`Message ${channelName}`}
                  onChange={this.changeHandler}
                  onKeyPress={this.pressHandler}
                ></textarea>
              </div>
              <div className="col-2" style={{ padding: 0 }}>
                <input
                  className="btn btn-success align-middle"
                  style={{ padding: "34px", width: "100%", borderRadius: 0 }}
                  type="submit"
                  value="Send"
                />
              </div>
            </div>
          </form>
        </div>
      );
    }
  }
}

// const out = document.getElementById("out");
// let c = 0;

// setInterval(function() {
//   // allow 1px inaccuracy by adding 1
//   const isScrolledToBottom =
//     out.scrollHeight - out.clientHeight <= out.scrollTop + 1;

//   const newElement = document.createElement("div");

//   newElement.textContent = format(
//     c++,
//     "Bottom position:",
//     out.scrollHeight - out.clientHeight,
//     "Scroll position:",
//     out.scrollTop
//   );

//   out.appendChild(newElement);

//   // scroll to bottom if isScrolledToBottom is true
//   if (isScrolledToBottom) {
//     out.scrollTop = out.scrollHeight - out.clientHeight;
//   }
// }, 500);

// function format() {
//   return Array.prototype.slice.call(arguments).join(" ");
// }

const mapStateToProps = state => ({
  user: state.user,
  fetchedChannels: state.channel.loadedChannels,
  allChannels: state.channel.allChannels,
  loading: state.channel.loading
});

const mapDispatchToProps = dispatch => {
  return {
    fetchChannel: (channelID, messages) =>
      dispatch(fetchChannel(channelID, messages)),
    sendMessage: (channelID, message, user) =>
      dispatch(sendMessage(channelID, message, user))
    // fetchNewMessages: (channelID, timestamp) =>
    // dispatch(fetchNewMessages(channelID, timestamp))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Channel);
