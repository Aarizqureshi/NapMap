import React, { useEffect, useState } from "react";
import { db } from "./firebaseConfig";
import {
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import RoomSelector from "./components/RoomSelector";
import WakeUpScheduler from "./components/WakeUpScheduler";

export default function App() {
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");
  const [joined, setJoined] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [roomData, setRoomData] = useState({});

  useEffect(() => {
    if (!joined || !roomId) return;

    const roomRef = doc(db, "rooms", roomId);
    const unsubscribe = onSnapshot(roomRef, (snapshot) => {
      if (snapshot.exists()) {
        setRoomData(snapshot.data());
      } else {
        setRoomData({});
      }
    });

    return () => unsubscribe();
  }, [joined, roomId]);

  const handleJoinRoom = (room, user) => {
    setRoomId(room);
    setUserName(user);
    setJoined(true);
    setSelectedDate(new Date().toISOString().slice(0, 10));
  };

  const toggleTimeSlot = async (date, timeslot) => {
    if (!joined) return;
    const userPrefs = roomData[userName] || {};
    const dateSlots = userPrefs[date] || [];

    const index = dateSlots.indexOf(timeslot);
    let newSlots;
    if (index > -1) {
      newSlots = [...dateSlots];
      newSlots.splice(index, 1);
    } else {
      newSlots = [...dateSlots, timeslot];
    }

    const newUserPrefs = { ...userPrefs, [date]: newSlots };

    const roomRef = doc(db, "rooms", roomId);
    await updateDoc(roomRef, {
      [userName]: newUserPrefs,
    });
  };

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
      selectedDate={selectedDate}
      setSelectedDate={setSelectedDate}
      toggleTimeSlot={toggleTimeSlot}
      leaveRoom={leaveRoom}
      roomId={roomId}
    />
  );
}
