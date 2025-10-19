import React from "react";
import ButtonDiv from "./components/Button";
import Modal from "./components/Modal";
import FoundContent from "./components/FoundContent";
import FoundButton from "./assets/found.png";
import LostContent from "./components/LostContent";
import LostButton from "./assets/lost.png";
import Logo from "./assets/logo.png";
import Hat from "./assets/hat.png";
import Coat from "./assets/coat.png";
import Bike from "./assets/bike.png";
import Dot8 from "./assets/dot8.png";
import Dot9 from "./assets/dot9.png";
import Dot4 from "./assets/dot4.png";
import X from "./assets/x.png";
import Squiggle from "./assets/squiggle.png";
import Curve from "./assets/curve.png";
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
      <img src={Dot8} alt="Dot8" className="decor dot8" />
      <img src={Dot9} alt="Dot9" className="decor dot9" />
      <img src={X} alt="X" className="decor x" />
      <img src={X} alt="X" className="decor x1" />
      <img src={X} alt="X" className="decor x2" />
      <img src={Squiggle} alt="Squiggle" className="decor squiggle" />
      <img src={Curve} alt="Curve" className="decor curve" />
      <img src={Dot4} alt="Dot4" className="decor dot4" />

      <div id="main-buttons-group">
        <img
          src={Logo}
          style={{
            width: "300px",
            position: "absolute",
            top: "30px",
            zIndex: "10px",
          }}
        ></img>
        <ButtonDiv onClick={lostClick}>
          <img className="main-button" src={LostButton} alt="Button Icon" />
        </ButtonDiv>
        <ButtonDiv onClick={foundClick}>
          <img className="main-button" src={FoundButton} alt="Button Icon" />
        </ButtonDiv>
      </div>

      <Modal open={open} onClose={closeModal}>
        {modalType === "lost" && <LostContent />}
        {modalType === "found" && <FoundContent onClose={closeModal} />}
      </Modal>
      <div className="bottom-bar"></div>
    </div>
  );
}

export default App;
