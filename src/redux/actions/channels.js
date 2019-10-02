import axios from "axios";
import {
  FETCH_CHANNELS,
  FETCH_MESSAGES,
  SET_LOADING,
  CREATE_NEW_CHANNEL,
  SEND_MESSAGE
  // FETCH_NEW_MESSAGES
} from "./actionTypes";
// import { setErrors } from "./errors";

export const fetchAllChannels = fetch => {
  return async dispatch => {
    if (fetch) {
      try {
        dispatch({
          type: SET_LOADING
        });
        const res = await axios.get(
          "https://api-chatr.herokuapp.com/channels/"
        );
        const channels = res.data;
        dispatch({
          type: FETCH_CHANNELS,
          payload: channels
        });
      } catch (error) {
        console.error(error);
        // dispatch(setErrors(error));
      }
    } else {
      dispatch({ type: FETCH_CHANNELS, payload: [] });
    }
  };
};

let interval;

export const fetchChannel = (channelID, messages) => {
  return async dispatch => {
    if (messages.length === 0) {
      dispatch({
        type: SET_LOADING
      });
    }
    clearInterval(interval);
    interval = setInterval(async () => {
      const lastMessage = messages[messages.length - 1];
      const timestamp = lastMessage ? lastMessage.timestamp : "";
      try {
        const res = await axios.get(
          `https://api-chatr.herokuapp.com/channels/${channelID}/?latest=${timestamp}`
        );
        const messages = res.data;
        // timestamp =
        let channelObject = {
          id: channelID,
          messages: messages
        };
        dispatch({
          type: FETCH_MESSAGES,
          payload: channelObject
        });
      } catch (error) {
        console.error(error);
        // dispatch(setErrors(error));
      }
    }, 5000);
  };
};

export const createNewChannel = (channelName, history) => {
  return async dispatch => {
    try {
      const newChannel = { name: channelName };
      const res = await axios.post(
        "https://api-chatr.herokuapp.com/channels/create/",
        newChannel
      );
      const channel = res.data;
      dispatch({
        type: CREATE_NEW_CHANNEL,
        payload: channel
      });
      history.push(`/channels/${channel.id}`);
    } catch (error) {
      console.error(error);
      // dispatch(setErrors(error));
    }
  };
};

export const sendMessage = (channelID, message, user) => {
  return async dispatch => {
    try {
      const res = await axios.post(
        `https://api-chatr.herokuapp.com/channels/${channelID}/send/`,
        message
      );
      const messageObject = {
        id: user.user_id,
        username: user.username,
        message: res.data.message,
        timestamp: new Date(),
        channel: channelID
      };
      dispatch({
        type: SEND_MESSAGE,
        payload: messageObject
      });
    } catch (error) {
      console.error(error);
      // dispatch(setErrors(error));
    }
  };
};

// export const fetchNewMessages = (channelID, timestamp) => {
//   return async dispatch => {
//     try {
//       const res = await axios.get(
//         `https://api-chatr.herokuapp.com/channels/${channelID}/?latest=${timestamp}`
//       );
//       const channel = res.data;
//       dispatch({
//         type: FETCH_NEW_MESSAGES,
//         payload: channel
//       });
//     } catch (error) {
//       console.error(error);
//       // dispatch(setErrors(error));
//     }
//   };
// };
