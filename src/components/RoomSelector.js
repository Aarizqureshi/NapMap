import React, { useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const containerStyle = {
  maxWidth: 400,
  margin: "auto",
  marginTop: "15vh",
  padding: 24,
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  borderRadius: 8,
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  backgroundColor: "#fff",
};

const inputStyle = {
  width: "calc(100% - 16px)",
  padding: 8,
  marginBottom: 12,
  borderRadius: 4,
  border: "1.5px solid #ccc",
  fontSize: 16,
  outline: "none",
  boxSizing: "border-box",
};

const buttonStyle = {
  padding: "10px 18px",
  fontSize: 16,
  borderRadius: 5,
  border: "none",
  cursor: "pointer",
  marginRight: 12,
  flex: 1,
};

const createBtnStyle = {
  ...buttonStyle,
  backgroundColor: "#4CAF50",
  color: "white",
};

const joinBtnStyle = {
  ...buttonStyle,
  backgroundColor: "#2196F3",
  color: "white",
};

const errorStyle = {
  color: "red",
  marginTop: -8,
  marginBottom: 8,
  fontWeight: "bold",
  fontSize: 14,
};

export default function RoomSelector({ onRoomJoin }) {
  const [roomIdInput, setRoomIdInput] = useState("");
  const [userName, setUserName] = useState("");
  const [error, setError] = useState("");

  const handleCreateRoom = async () => {
    if (!roomIdInput || !userName) {
      setError("Room ID and User Name required.");
      return;
    }
    const roomRef = doc(db, "rooms", roomIdInput);
    const roomSnap = await getDoc(roomRef);
    if (roomSnap.exists()) {
      alert("Room name already exists. Please choose a different name.");
      setError("Room name taken");
    } else {
      await setDoc(roomRef, {}); // create new room
      alert(`Room "${roomIdInput}" created!`);
      onRoomJoin(roomIdInput, userName);
    }
  };

  const handleJoinRoom = async () => {
    if (!roomIdInput || !userName) {
      setError("Room ID and User Name required.");
      return;
    }
    const roomRef = doc(db, "rooms", roomIdInput);
    const roomSnap = await getDoc(roomRef);
    if (!roomSnap.exists()) {
      alert("Room does not exist. Please check the name or create a new one.");
      setError("Room does not exist");
    } else {
      alert(`Joined room "${roomIdInput}"`);
      onRoomJoin(roomIdInput, userName);
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>Wake-Up Scheduler</h2>
      <input
        placeholder="Room ID"
        value={roomIdInput}
        onChange={(e) => { setRoomIdInput(e.target.value.trim()); setError(""); }}
        style={inputStyle}
        spellCheck="false"
        autoFocus
      />
      <input
        placeholder="Your Name"
        value={userName}
        onChange={(e) => { setUserName(e.target.value.trim()); setError(""); }}
        style={inputStyle}
        spellCheck="false"
      />
      {!!error && <p style={errorStyle}>{error}</p>}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
        <button onClick={handleJoinRoom} style={joinBtnStyle}>Join Room</button>
        <button onClick={handleCreateRoom} style={createBtnStyle}>Create Room</button>
      </div>
    </div>
  );
}
