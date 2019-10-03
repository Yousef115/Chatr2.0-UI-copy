import React from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
//Emoji
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSmile } from "@fortawesome/free-solid-svg-icons";

//Actions
import { fetchChannel, sendMessage } from "../redux/actions";

//Components
import Messages from "./Messages";

class Channel extends React.Component {
  state = {
    message: "",
    interval: null,
    toggle: false
  };

  changeHandler = event => {
    this.setState({ message: event.target.value });
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
    this.setState({ message: "" });
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

  toggleEmojiHandler = () => {
    this.setState({ toggle: !this.state.toggle });
  };

  addEmoji = e => {
    //console.log(e.native);
    let emoji = e.native;
    this.setState({
      message: this.state.message + emoji
    });
  };

  componentDidMount() {
    const channelID = this.props.match.params.channelID;
    clearInterval(this.state.interval);
    const channelAvailable = this.props.fetchedChannels.find(
      channel => parseInt(channel.id) === parseInt(channelID)
    );
    this.props.fetchChannel(channelID, !!channelAvailable, "");
    // clearInterval(this.state.interval);
    this.setState({
      interval: setInterval(() => {
        const channelAvailable = this.props.fetchedChannels.find(
          channel => parseInt(channel.id) === parseInt(channelID)
        );
        if (!channelAvailable) {
          this.props.fetchChannel(channelID, false, "");
        } else if (channelAvailable && channelAvailable.messages.length === 0) {
          this.props.fetchChannel(channelID, true, "");
        } else {
          let timestamp =
            channelAvailable.messages[channelAvailable.messages.length - 1]
              .timestamp;

          this.props.fetchChannel(channelID, true, timestamp);
        }
      }, 5000)
    });
  }

  componentDidUpdate(prevProps) {
    const channelID = this.props.match.params.channelID;
    if (channelID !== prevProps.match.params.channelID) {
      clearInterval(this.state.interval);
      const channelAvailable = this.props.fetchedChannels.find(
        channel => parseInt(channel.id) === parseInt(channelID)
      );
      this.props.fetchChannel(channelID, !!channelAvailable, "");
      // clearInterval(this.state.interval);
      this.setState({
        interval: setInterval(() => {
          const channelAvailable = this.props.fetchedChannels.find(
            channel => parseInt(channel.id) === parseInt(channelID)
          );
          if (!channelAvailable) {
            this.props.fetchChannel(channelID, false, "");
          } else if (
            channelAvailable &&
            channelAvailable.messages.length === 0
          ) {
            this.props.fetchChannel(channelID, true, "");
          } else {
            let timestamp =
              channelAvailable.messages[channelAvailable.messages.length - 1]
                .timestamp;
            this.props.fetchChannel(channelID, true, timestamp);
          }
        }, 5000)
      });
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
        }
      }
      let channelName = "";
      if (this.props.allChannels.length > 0) {
        channelName = this.props.allChannels.find(
          channel => channel.id === +channelID
        ).name;
      }

      return (
        <>
          <div id="chat">{messages}</div>
          <div>
            {this.state.toggle && (
              <div classname="mx-5 my-5 emoji-over">
                <Picker onSelect={this.addEmoji} />
              </div>
            )}
          </div>
          <form name="messageForm" onSubmit={this.submitHandler}>
            <div className="row">
              <div
                className="col-1"
                style={{ paddingTop: 25, paddingLeft: 25 }}
              >
                <FontAwesomeIcon
                  style={{ height: "20px" }}
                  icon={faSmile}
                  onClick={this.toggleEmojiHandler}
                />
              </div>
              <div className="col-9" style={{ padding: 0 }}>
                <textarea
                  style={{ height: "100%", width: "100%", resize: "none" }}
                  name="message"
                  value={this.state.message}
                  placeholder={`Message ${channelName}`}
                  onChange={this.changeHandler}
                  onKeyPress={this.pressHandler}
                  onClick={this.toggleEmojiHandler}
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
          {/* </div> */}
        </>
      );
    }
  }
}

const mapStateToProps = state => ({
  user: state.user,
  fetchedChannels: state.channel.loadedChannels,
  allChannels: state.channel.allChannels,
  loading: state.channel.loading
});

const mapDispatchToProps = dispatch => {
  return {
    fetchChannel: (channelID, available, timestamp) =>
      dispatch(fetchChannel(channelID, available, timestamp)),
    sendMessage: (channelID, message, user) =>
      dispatch(sendMessage(channelID, message, user))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Channel);
