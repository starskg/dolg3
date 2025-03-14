// src/components/UserList.js
import React from "react";

const UserList = ({ users }) => {
  return (
    <ul>
      {users.length === 0 ? (
        <p>Фойдаланувчилар рўйхати бўш.</p>
      ) : (
        users.map((user) => (
          <li key={user.id}>
            {user.name} — {user.email}
          </li>
        ))
      )}
    </ul>
  );
};

export default UserList;
