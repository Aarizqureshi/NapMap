import React, { useState, useEffect } from "react";
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
  const [mode, setMode] = useState("join"); // "join" or "create"
  const [roomIdInput, setRoomIdInput] = useState("");
  const [userName, setUserName] = useState("");
  const [pinInput, setPinInput] = useState("");
  const [requiresPin, setRequiresPin] = useState(false);
  const [error, setError] = useState("");

  // Check if joined rooms info saved locally for skipping PIN
  const checkLocalJoined = (roomId, user) => {
    try {
      const saved = JSON.parse(localStorage.getItem("joinedRooms") || "[]");
      return saved.some(
        (entry) =>
          entry.roomId === roomId && entry.userName === user
      );
    } catch {
      return false;
    }
  };

  // Save joined rooms to localStorage
  const saveLocalJoined = (roomId, user) => {
    try {
      const saved = JSON.parse(localStorage.getItem("joinedRooms") || "[]");
      const existing = saved.filter(
        (entry) => entry.roomId !== roomId || entry.userName !== user
      );
      existing.push({ roomId, userName: user });
      localStorage.setItem("joinedRooms", JSON.stringify(existing));
    } catch {
      // ignore errors
    }
  };

  // Check if PIN required for join mode when roomId changes
  const checkRoomPinRequirement = async (roomId) => {
  if (!roomId || !userName) {
    setRequiresPin(false);
    return;
  }
  const roomRef = doc(db, "rooms", roomId);
  const roomSnap = await getDoc(roomRef);
  if (roomSnap.exists()) {
    const roomData = roomSnap.data();
    const userAlreadyInRoom = !!roomData[userName];
    if (roomData._pin && !userAlreadyInRoom) {
      setRequiresPin(true);
    } else {
      setRequiresPin(false);
    }
  } else {
    setRequiresPin(false);
  }
};


  // Update roomId and check PIN requirement on change
  const handleRoomIdChange = (e) => {
    const val = e.target.value.trim();
    setRoomIdInput(val);
    setError("");
    if (mode === "join") {
      checkRoomPinRequirement(val);
    }
  };

  // Update user name and check PIN requirement where applicable
  const handleUserNameChange = (e) => {
    const val = e.target.value.trim();
    setUserName(val);
    setError("");
    if (mode === "join" && roomIdInput) {
      checkRoomPinRequirement(roomIdInput);
    }
  };

  const handleCreateRoom = async () => {
    setError("");
    if (!roomIdInput || !userName || !pinInput) {
      setError("Room No, Name and PIN are required.");
      return;
    }
    const roomRef = doc(db, "rooms", roomIdInput);
    const roomSnap = await getDoc(roomRef);
    if (roomSnap.exists()) {
      setError("Room name already exists. Choose a different name.");
      return;
    }
    await setDoc(roomRef, {
      _pin: pinInput,
      [userName]: {},
    });
    saveLocalJoined(roomIdInput, userName);
    alert(`Room "${roomIdInput}" created!`);
    onRoomJoin(roomIdInput, userName);
  };

  const handleJoinRoom = async () => {
    setError("");
    if (!roomIdInput || !userName) {
      setError("Room No and Name are required.");
      return;
    }
    const roomRef = doc(db, "rooms", roomIdInput);
    const roomSnap = await getDoc(roomRef);
    if (!roomSnap.exists()) {
      setError("Room does not exist.");
      return;
    }
    const roomData = roomSnap.data();

    const hasJoinedBefore = checkLocalJoined(roomIdInput, userName);

    if (roomData._pin && !hasJoinedBefore) {
      if (!pinInput) {
        setError("PIN is required for this room.");
        return;
      }
      if (pinInput !== roomData._pin) {
        setError("Incorrect PIN.");
        return;
      }
    }

    if (!roomData[userName]) {
      await setDoc(roomRef, { [userName]: {} }, { merge: true });
    }

    saveLocalJoined(roomIdInput, userName);
    alert(`Joined room "${roomIdInput}"`);
    onRoomJoin(roomIdInput, userName);
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>Wake-Up Scheduler</h2>

      {/* Mode toggle buttons */}
      <div style={{ display: "flex", marginBottom: 20 }}>
        <button
          onClick={() => {
            setMode("join");
            setError("");
            setPinInput("");
            setRequiresPin(false);
          }}
          style={{
            flex: 1,
            padding: 10,
            backgroundColor: mode === "join" ? "#2196F3" : "#e0e0e0",
            color: mode === "join" ? "white" : "black",
            border: "none",
            borderRadius: "5px 0 0 5px",
            cursor: "pointer",
          }}
        >
          Join Room
        </button>
        <button
          onClick={() => {
            setMode("create");
            setError("");
            setPinInput("");
            setRequiresPin(false);
          }}
          style={{
            flex: 1,
            padding: 10,
            backgroundColor: mode === "create" ? "#4CAF50" : "#e0e0e0",
            color: mode === "create" ? "white" : "black",
            border: "none",
            borderRadius: "0 5px 5px 0",
            cursor: "pointer",
          }}
        >
          Create Room
        </button>
      </div>

      {/* Inputs */}
      <input
        placeholder="Room No"
        value={roomIdInput}
        onChange={handleRoomIdChange}
        style={inputStyle}
        spellCheck="false"
        autoFocus
      />
      <input
        placeholder="Your Name"
        value={userName}
        onChange={handleUserNameChange}
        style={inputStyle}
        spellCheck="false"
      />

      {/* PIN input */}
      {mode === "create" && (
        <input
          placeholder="PIN"
          type="password"
          value={pinInput}
          onChange={(e) => {
            setPinInput(e.target.value.trim());
            setError("");
          }}
          style={inputStyle}
          spellCheck="false"
        />
      )}
      {mode === "join" && requiresPin && (
        <input
          placeholder="Room PIN"
          type="password"
          value={pinInput}
          onChange={(e) => {
            setPinInput(e.target.value.trim());
            setError("");
          }}
          style={inputStyle}
          spellCheck="false"
        />
      )}

      {/* Error message */}
      {!!error && <p style={errorStyle}>{error}</p>}

      {/* Action buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 8,
        }}
      >
        {mode === "join" ? (
          <button onClick={handleJoinRoom} style={joinBtnStyle}>
            Join
          </button>
        ) : (
          <button onClick={handleCreateRoom} style={createBtnStyle}>
            Create
          </button>
        )}
      </div>
    </div>
  );
}
