import React, { useEffect } from "react";
import Modal from "react-modal";
import "./signup-modal.css";
Modal.setAppElement("#root");

const SignupModal = ({
  isModalOpen,
  setIsModalOpen,
  handleSubmit,
  setUsername,
  setRoomName,
}) => {
  return (
    <Modal
      closeTimeoutMS={500}
      className="modal"
      overlayClassName="modal-overlay"
      isOpen={isModalOpen}
      onRequestClose={() => setIsModalOpen(false)}
    >
      <form onSubmit={handleSubmit}>
        <div className="modal-input-container">
          <input
            className="joinInput"
            type="text"
            placeholder="Create username"
            onChange={(e) => setUsername(e.target.value.toLowerCase())}
            required
          />
          <button type="submit" className="button">
            HIT THE CLUB
          </button>
        </div>
      </form>
      <button className="exit-btn" onClick={() => setIsModalOpen(false)}>
        Exit
      </button>
    </Modal>
  );
};

export default SignupModal;
