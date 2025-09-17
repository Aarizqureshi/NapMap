import React, { useState, useEffect } from "react";

const TIMESLOTS = [
  "05:00", "05:30", "06:00", "06:30", "07:00",
  "07:30", "08:00", "08:30", "09:00",
  "09:30", "10:00", "10:30", "11:00"
];

function formatTime(t) {
  // as before ...
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
  const [selectedRoommate, setSelectedRoommate] = useState(userName);
  const dates = [getTodayDateStr(), getTomorrowDateStr()];

  // Track window width for responsive styles, optional to use resize listener
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "30px auto",
        fontFamily:
          "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        border: "1px solid #ddd",
        borderRadius: 8,
        overflow: "hidden",
        boxShadow: "0 2px 12px rgb(0 0 0 / 0.1)",
        height: isMobile ? "auto" : 480,
        userSelect: "none",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: isMobile ? "100%" : 180,
          borderRight: isMobile ? "none" : "1px solid #ddd",
          borderBottom: isMobile ? "1px solid #ddd" : "none",
          backgroundColor: "#f5f5f5",
          padding: isMobile ? 12 : 16,
          overflowY: isMobile ? "visible" : "auto",
          display: "flex",
          flexDirection: "row",
          flexWrap: "nowrap",
          overflowX: isMobile ? "auto" : "hidden",
          gap: isMobile ? 12 : 0,
        }}
      >
        <h3
          style={{
            marginTop: 0,
            fontWeight: "700",
            fontSize: isMobile ? 16 : 18,
            color: "#333",
            flex: isMobile ? "0 0 auto" : "unset",
            lineHeight: isMobile ? "32px" : "normal",
            whiteSpace: isMobile ? "nowrap" : "normal",
          }}
        >
          Roommates
        </h3>
        <ul
          style={{
            padding: 0,
            marginTop: isMobile ? 0 : 16,
            marginLeft: isMobile ? 12 : 0,
            listStyleType: "none",
            display: "flex",
            flexDirection: isMobile ? "row" : "column",
            gap: isMobile ? 8 : 6,
            overflowX: isMobile ? "auto" : "visible",
            flexWrap: "nowrap",
            flexGrow: 1,
            scrollbarWidth: "thin",
          }}
        >
          {roommates.map((rm) => (
            <li
              key={rm}
              onClick={() => setSelectedRoommate(rm)}
              style={{
                padding: isMobile ? "6px 10px" : "10px 12px",
                backgroundColor: rm === selectedRoommate ? "#4caf50" : "transparent",
                color: rm === selectedRoommate ? "white" : "#333",
                borderRadius: 6,
                cursor: "pointer",
                fontWeight: rm === selectedRoommate ? "700" : "normal",
                fontSize: isMobile ? 14 : 16,
                whiteSpace: "nowrap",
                userSelect: "none",
                minWidth: isMobile ? 80 : "auto",
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
            marginTop: isMobile ? 0 : 24,
            marginLeft: isMobile ? 12 : 0,
            padding: isMobile ? "6px 10px" : 10,
            fontWeight: "600",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            flex: isMobile ? "0 0 auto" : "none",
            fontSize: isMobile ? 14 : 16,
            userSelect: "none",
          }}
          title="Leave this room"
        >
          Leave
        </button>
      </aside>

      {/* Timeslot panel */}
      <main
        style={{
          flexGrow: 1,
          padding: isMobile ? 12 : 24,
          overflowY: "auto",
          background: "white",
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        <h2 style={{ marginTop: 0, fontSize: isMobile ? 20 : 24 }}>
          Room: <span style={{ color: "#4CAF50" }}>{roomId}</span>
        </h2>
        <p style={{ fontSize: isMobile ? 14 : 16 }}>
          Viewing schedule for:{" "}
          <strong style={{ fontSize: isMobile ? 16 : 18 }}>
            {selectedRoommate}
            {selectedRoommate === userName ? " (You)" : ""}
          </strong>
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(3, 1fr)",
            gap: isMobile ? 12 : 24,
            userSelect: "none",
          }}
        >
          {[getTodayDateStr(), getTomorrowDateStr()].map((date) => {
            const userPrefs = (roomData[selectedRoommate] || {})[date] || [];
            const canEdit = selectedRoommate === userName;

            return (
              <section
                key={date}
                style={{
                  backgroundColor: "#fafafa",
                  border: "1px solid #ddd",
                  borderRadius: 8,
                  padding: isMobile ? 12 : 16,
                  minWidth: 0,
                }}
              >
                <h3
                  style={{
                    marginTop: 0,
                    marginBottom: 12,
                    fontSize: isMobile ? 16 : 18,
                  }}
                >
                  {new Date(date).toLocaleDateString(undefined, {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2,1fr)",
                    gap: 8,
                  }}
                >
                  {TIMESLOTS.map((ts) => {
                    const selected = userPrefs.includes(ts);
                    return (
                      <button
                        key={ts}
                        onClick={() => canEdit && toggleTimeSlot(date, ts)}
                        style={{
                          padding: "6px",
                          borderRadius: 6,
                          border: "none",
                          cursor: canEdit ? "pointer" : "default",
                          backgroundColor: selected ? "#4caf50" : "#ddd",
                          color: selected ? "white" : "#555",
                          fontWeight: selected ? "600" : "normal",
                          boxShadow: selected ? "0 0 8px #4caf5070" : "none",
                          fontSize: 14,
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
