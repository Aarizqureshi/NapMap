import React, { useState } from "react";

const TIMESLOTS = [
  "05:00", "05:30", "06:00", "06:30", "07:00",
  "07:30", "08:00", "08:30", "09:00",
  "09:30", "10:00", "10:30", "11:00"
];

function formatTime(t) {
  const [h, m] = t.split(":");
  const hour = parseInt(h);
  const suffix = hour < 12 ? "AM" : "PM";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${m} ${suffix}`;
}

function getTodayDateStr() {
  return new Date().toISOString().slice(0, 10);
}

function getTomorrowDateStr() {
  const t = new Date();
  t.setDate(t.getDate() + 1);
  return t.toISOString().slice(0, 10);
}

export default function WakeUpScheduler({
  roomData,
  userName,
  toggleTimeSlot,
  leaveRoom,
  roomId,
}) {
  const roommates = Object.keys(roomData).sort();

  // Selected roommate defaults to current user on load
  const [selectedRoommate, setSelectedRoommate] = useState(userName);

  const dates = [getTodayDateStr(), getTomorrowDateStr()];

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "30px auto",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        display: "flex",
        border: "1px solid #ddd",
        borderRadius: 8,
        overflow: "hidden",
        boxShadow: "0 2px 12px rgb(0 0 0 / 0.1)",
        height: 480,
        userSelect: "none",
      }}
    >
      {/* Roommate list sidebar */}
      <aside
        style={{
          width: 180,
          borderRight: "1px solid #ddd",
          backgroundColor: "#f5f5f5",
          padding: 16,
          overflowY: "auto",
        }}
      >
        <h3 style={{ marginTop: 0, fontWeight: "700", fontSize: 18, color: "#333" }}>
          Roommates
        </h3>
        <ul style={{ padding: 0, marginTop: 16, listStyleType: "none" }}>
          {roommates.map((rm) => (
            <li
              key={rm}
              onClick={() => setSelectedRoommate(rm)}
              style={{
                padding: "10px 12px",
                marginBottom: 6,
                backgroundColor: rm === selectedRoommate ? "#4caf50" : "transparent",
                color: rm === selectedRoommate ? "white" : "#333",
                borderRadius: 6,
                cursor: "pointer",
                fontWeight: rm === selectedRoommate ? "700" : "normal",
                transition: "background-color 0.3s",
                wordBreak: "break-word",
              }}
              title={rm}
            >
              {rm === userName ? `${rm} (You)` : rm}
            </li>
          ))}
        </ul>
        <button
          onClick={leaveRoom}
          style={{
            marginTop: 24,
            width: "100%",
            padding: 10,
            fontWeight: "600",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
          title="Leave this room"
        >
          Leave Room
        </button>
      </aside>

      {/* Timeslot panel */}
      <main
        style={{
          flexGrow: 1,
          padding: 24,
          overflowY: "auto",
          background: "white",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h2 style={{ marginTop: 0 }}>
          Room: <span style={{ color: "#4CAF50" }}>{roomId}</span>
        </h2>
        <p style={{ fontSize: 16 }}>
          Viewing schedule for:{" "}
          <strong>
            {selectedRoommate}
            {selectedRoommate === userName ? " (You)" : ""}
          </strong>
        </p>

        <div style={{ display: "flex", marginTop: 20, gap: 24 }}>
          {dates.map((date) => {
            const userPrefs = (roomData[selectedRoommate] || {})[date] || [];
            const canEdit = selectedRoommate === userName;

            return (
              <section
                key={date}
                style={{
                  flex: 1,
                  backgroundColor: "#fafafa",
                  border: "1px solid #ddd",
                  borderRadius: 8,
                  padding: 16,
                }}
              >
                <h3 style={{ marginTop: 0, marginBottom: 12 }}>
                  {new Date(date).toLocaleDateString(undefined, {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 12,
                    userSelect: "none",
                  }}
                >
                  {TIMESLOTS.map((ts) => {
                    const selected = userPrefs.includes(ts);
                    return (
                      <button
                        key={ts}
                        onClick={() => canEdit && toggleTimeSlot(date, ts)}
                        style={{
                          padding: "8px",
                          borderRadius: 6,
                          border: "none",
                          cursor: canEdit ? "pointer" : "default",
                          backgroundColor: selected ? "#4caf50" : "#ddd",
                          color: selected ? "white" : "#555",
                          fontWeight: selected ? "600" : "normal",
                          boxShadow: selected ? "0 0 8px #4caf5070" : "none",
                          transition: "background-color 0.3s",
                          userSelect: "none",
                        }}
                        title={`${formatTime(ts)}${canEdit ? " - Click to toggle" : ""}`}
                      >
                        {formatTime(ts)}
                      </button>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </main>
    </div>
  );
}
