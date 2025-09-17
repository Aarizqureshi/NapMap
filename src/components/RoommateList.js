import React, { useState } from "react";

export default function RoommateList({ roommates, addRoommate }) {
  const [newName, setNewName] = useState("");

  const handleAdd = () => {
    if (newName.trim() !== "") {
      addRoommate(newName.trim());
      setNewName("");
    }
  };

  return (
    <div>
      <h3>Roommates</h3>
      <input
        type="text"
        placeholder="Add roommate name"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
      />
      <button onClick={handleAdd}>Add</button>
      <ul>
        {roommates.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ul>
    </div>
  );
}
