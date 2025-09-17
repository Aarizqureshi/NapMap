import React, { useEffect, useState } from "react";
import { db } from "./firebaseConfig";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import RoomSelector from "./components/RoomSelector";
import WakeUpScheduler from "./components/WakeUpScheduler";

export default function App() {
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");
  const [joined, setJoined] = useState(false);
  const [roomData, setRoomData] = useState({});

  // Real-time listener to room document
  useEffect(() => {
    if (!joined || !roomId) return;

    const roomRef = doc(db, "rooms", roomId);
    const unsubscribe = onSnapshot(
      roomRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setRoomData(snapshot.data());
        } else {
          setRoomData({});
        }
      },
      (error) => {
        console.error("Firestore onSnapshot error:", error);
      }
    );

    return () => unsubscribe();
  }, [joined, roomId]);

  // Called when user joins or creates a room
  const handleJoinRoom = (room, user) => {
    setRoomId(room);
    setUserName(user);
    setJoined(true);
  };

  // Toggle user's awake time slot (add/remove) and update Firestore
  const toggleTimeSlot = async (date, timeslot) => {
    if (!joined) return;

    const roomRef = doc(db, "rooms", roomId);
    const userPrefs = roomData[userName] || {};
    const dateSlots = userPrefs[date] || [];

    let newSlots;
    if (dateSlots.includes(timeslot)) {
      newSlots = dateSlots.filter((slot) => slot !== timeslot);
    } else {
      newSlots = [...dateSlots, timeslot];
    }

    const newUserPrefs = { ...userPrefs, [date]: newSlots };

    try {
      await updateDoc(roomRef, {
        [userName]: newUserPrefs,
      });
      console.log("Firestore updated successfully for user:", userName);
    } catch (error) {
      console.error("Error updating Firestore:", error);
    }
  };

  // Leave room and reset state
  const leaveRoom = () => {
    setJoined(false);
    setRoomId("");
    setUserName("");
    setRoomData({});
  };

  if (!joined) {
    return <RoomSelector onRoomJoin={handleJoinRoom} />;
  }

  return (
    <WakeUpScheduler
      roomData={roomData}
      userName={userName}
      toggleTimeSlot={toggleTimeSlot}
      leaveRoom={leaveRoom}
      roomId={roomId}
    />
  );
}
