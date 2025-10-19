import React from "react";
import ButtonDiv from "./components/Button";
import Modal from "./components/Modal";
import FoundContent from "./components/FoundContent";
import FoundButton from "./assets/found.png";
import LostContent from "./components/LostContent";
import LostButton from "./assets/lost.png";
import Hat from "./assets/hat.png";
import Coat from "./assets/coat.png"
import Bike from "./assets/bike.png"
import "./css/App.css";

function App() {
  const [open, setOpen] = React.useState(false);
  const [modalType, setModalType] = React.useState<"lost" | "found" | null>(
    null
  );

  const openModal = () => {
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
  };

  const lostClick = () => {
    setModalType("lost");
    openModal();
  };
  const foundClick = () => {
    setModalType("found");
    openModal();
  };

  return (
    <div className="page">
      <img src={Hat} alt="Hat" className="decor hat" />
      <img src={Coat} alt="Coat" className="decor coat" />
      <img src={Bike} alt="Bike" className="decor bike" />
      
      <div id="main-buttons-group">
        <ButtonDiv onClick={lostClick}>
          <img className="main-button" src={LostButton} alt="Button Icon" />
        </ButtonDiv>
        <ButtonDiv onClick={foundClick}>
          <img className="main-button" src={FoundButton} alt="Button Icon" />
        </ButtonDiv>
      </div>

      <Modal open={open} onClose={closeModal}>
        {modalType === "lost" && <LostContent />}
        {modalType === "found" && <FoundContent />}
      </Modal>
      <div className="bottom-bar"></div>
    </div>
  );
}

export default App;
