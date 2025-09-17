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

  // Listen real-time for room data changes
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

  // Join room and initialize user in Firestore if needed
  const handleJoinRoom = async (room, user) => {
    const roomRef = doc(db, "rooms", room);
    const roomSnap = await getDoc(roomRef);

    if (!roomSnap.exists()) {
      // Create new room with user empty data
      await setDoc(roomRef, {
        [user]: {}
      });
    } else {
      // Room exists, add user if missing
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

  // Toggle timeslot for current user, update Firebase
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

  // Leave room and reset all state
  const leaveRoom = () => {
    setJoined(false);
    setRoomId("");
    setUserName("");
    setRoomData({});
  };

  // Render join/create room UI or main scheduler UI based on joined state
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
