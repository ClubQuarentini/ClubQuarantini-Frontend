import React from "react";
import onlineIcon from "../../icons/onlineIcon.png";
import "./userscontainer.css";

const UserContainer = ({ users }) => {
  console.log("users", users);
  return (
    <div className="textContainer">
      {users ? (
        <div>
          <h1>People currently chatting:</h1>
          <div className="activeContainer">
            <h2>
              {users.map((user) => (
                <div key={user.name} className="activeItem">
                  {user.name}
                  <img alt="Online Icon" src={onlineIcon} />
                </div>
              ))}
            </h2>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default UserContainer;
