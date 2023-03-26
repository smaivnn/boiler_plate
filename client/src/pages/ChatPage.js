import React, { useEffect, useState } from "react";
import { getYear, getMonth, getDate, getHours, getMinutes } from "date-fns";
import io from "socket.io-client";
import axios from "../api/axios";
const CONNECT_URL = "http://localhost:4000/chat";
let socket;

const ChatPage = () => {
  const [room, setRoom] = useState(""); // 제목
  const [roomBefore, setRoomBefore] = useState(""); // 이전 방 나가기를 위한 변수
  const [message, setMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState([]);
  const [Id, setId] = useState("");
  const [socketId, setSocketId] = useState("");
  let date = new Date();

  // 이부분은 useEffect의 disconnect를 만지면 해결될듯함.
  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", { room, roomBefore });
      setRoomBefore(room);
    }
  };
  const sendMessage = () => {
    socket.emit("send_msg", {
      Id,
      message,
      room,
      currentTime: `${getHours(date)}:${
        getMinutes(date) < 10 ? `0${getMinutes(date)}` : getMinutes(date)
      }`,
    });
  };

  const checkRoom = () => {
    socket.emit("check", { room });
  };

  // 방 생성시 보내는 주소. (CMS에 저장하기)
  const addUser = async () => {
    await axios.post("http://localhost:4100/test", {
      room,
      Id,
    });
  };

  const getPreviousChatHistory = () => {
    socket.emit("getPreviousChatHistory", { room });
    console.log(socket.id);
  };

  useEffect(() => {
    socket = io.connect(CONNECT_URL);
    getPreviousChatHistory();

    return () => {};
  }, []);

  useEffect(() => {
    socket.on("receive_msg", (data) => {
      let content = {
        Id: data.Id,
        message: data.message,
        currentTime: data.currentTime,
      };
      // console.log(content);
      setMessageReceived((current) => [...current, content]);
    });

    socket.on("getUserList", (data) => {
      console.log(data.list);
    });

    socket.on("chatList", (data) => {
      console.log(data);
    });
  }, [socket]);

  return (
    <div className="App">
      <input
        placeholder="Room Number..."
        onChange={(event) => {
          setRoom(event.target.value);
        }}
      />
      <button onClick={joinRoom}>방입장</button>
      <input
        placeholder="message..."
        onChange={(event) => {
          setMessage(event.target.value);
        }}
      />
      <button onClick={sendMessage}>Send Message</button>
      <input
        placeholder="username.."
        onChange={(event) => {
          setId(event.target.value);
        }}
      />

      <button onClick={checkRoom}>checkRoom</button>
      <button onClick={addUser}>방생성</button>
      <button onClick={getPreviousChatHistory}>이전채팅리스트</button>
      <h1>Message: </h1>
      {messageReceived.map((element, idx) => {
        return (
          <p key={idx}>
            {element.Id} : {element.message} : {element.currentTime}
          </p>
        );
      })}
    </div>
  );
};

export default ChatPage;
