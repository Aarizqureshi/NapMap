import React from "react";

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

export default function DayDetail({ date, roommates, wakeUpPrefs, toggleTimeSlot }) {
  if (roommates.length === 0) {
    return <p>Add roommates to set wake-up times.</p>;
  }

  return (
    <div>
      <h3>Wake-Up Times for {new Date(date).toLocaleDateString()}</h3>
      {roommates.map((roommate) => {
        const selectedSlots =
          (wakeUpPrefs[date] && wakeUpPrefs[date][roommate]) || [];

        return (
          <div key={roommate} style={{ marginBottom: 16 }}>
            <strong>{roommate}</strong>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
              {TIMESLOTS.map((ts) => {
                const selected = selectedSlots.includes(ts);
                return (
                  <button
                    key={ts}
                    onClick={() => toggleTimeSlot(date, roommate, ts)}
                    style={{
                      padding: "6px 10px",
                      backgroundColor: selected ? "#2196F3" : "#f0f0f0",
                      color: selected ? "white" : "black",
                      border: "1px solid #ccc",
                      borderRadius: 4,
                      cursor: "pointer",
                      userSelect: "none",
                    }}
                    title={`Wake-up at ${formatTime(ts)}`}
                  >
                    {formatTime(ts)}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
