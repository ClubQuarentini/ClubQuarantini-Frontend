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
      <form className="modal-form" onSubmit={handleSubmit}>
        <h3>Create a Username to Start Your Own Club</h3>
        <div className="modal-input-container">
          <input
            className="joinInput"
            type="text"
            placeholder="Create username"
            onChange={(e) => setUsername(e.target.value.toLowerCase())}
            required
          />
          <button type="submit" className="button">
            CREATE CLUB
          </button>
        </div>
      </form>
      <button className="exit-btn" onClick={() => setIsModalOpen(false)}>
        X
      </button>
    </Modal>
  );
};

export default SignupModal;
