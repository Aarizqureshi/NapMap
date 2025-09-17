import React from "react";

export default function Calendar({ dates, selectedDate, setSelectedDate }) {
  return (
    <div>
      <h3>Select Day</h3>
      <div style={{ display: "flex", gap: 12 }}>
        {dates.map((date) => {
          const d = new Date(date);
          const label = d.toLocaleDateString(undefined, {
            weekday: "short",
            month: "short",
            day: "numeric",
          });

          const isSelected = date === selectedDate;
          return (
            <button
              key={date}
              onClick={() => setSelectedDate(date)}
              style={{
                padding: "10px 20px",
                cursor: "pointer",
                backgroundColor: isSelected ? "#4CAF50" : "#e0e0e0",
                color: isSelected ? "white" : "black",
                border: "none",
                borderRadius: 5,
                flex: 1,
              }}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
