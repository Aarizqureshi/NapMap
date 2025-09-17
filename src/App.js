import React, { useEffect, useState } from "react";
import { db } from "./firebaseConfig";
import { doc, getDoc, setDoc, updateDoc, onSnapshot } from "firebase/firestore";
import RoomSelector from "./components/RoomSelector";
import WakeUpScheduler from "./components/WakeUpScheduler";

export default function App() {
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");
  const [joined, setJoined] = useState(false);
  const [roomData, setRoomData] = useState({});

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

  const handleJoinRoom = async (room, user) => {
    const roomRef = doc(db, "rooms", room);
    const roomSnap = await getDoc(roomRef);

    if (!roomSnap.exists()) {
      await setDoc(roomRef, {
        [user]: {}
      });
    } else {
      const roomDocData = roomSnap.data();
      if (!roomDocData[user]) {
        await updateDoc(roomRef, {
          [user]: {}
        });
      }
    }

    setRoomId(room);
    setUserName(user);
    setJoined(true);
  };

  // Only one timeslot allowed per day here
  const toggleTimeSlot = async (date, timeslot) => {
    if (!joined) return;

    const roomRef = doc(db, "rooms", roomId);
    const userPrefs = roomData[userName] || {};
    const dateSlots = userPrefs[date] || [];

    let newSlots;
    if (dateSlots.includes(timeslot)) {
      newSlots = [];
    } else {
      newSlots = [timeslot];
    }

    const newUserPrefs = { ...userPrefs, [date]: newSlots };

    try {
      await updateDoc(roomRef, {
        [userName]: newUserPrefs,
      });
    } catch (error) {
      console.error("Error updating Firestore:", error);
    }
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
      toggleTimeSlot={toggleTimeSlot}
      leaveRoom={leaveRoom}
      roomId={roomId}
    />
  );
}
