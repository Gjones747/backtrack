import React from "react";
import ButtonDiv from "./components/Button";
import Modal from "./components/Modal";

import "./css/App.css";

function App() {
  const [open, setOpen] = React.useState(false);

  const modalAppear = () => {
    setOpen(true);

  }

  const lostClick = () => {
    modalAppear();
  };
  const foundClick = () => {
    modalAppear();
  };

  return (
    <>
      <div id="main-buttons-group">
        <ButtonDiv label="Lost" onClick={lostClick} />
        <ButtonDiv label="Found" onClick={foundClick} />
      </div>
      <Modal open={open} onClose={() => setOpen(false)}>
        <button onClick={() => setOpen(false)}>Close</button>
      </Modal>
    </>
  );
}

export default App;
