import React, { useState, useEffect } from "react";
import "./bar.css";
// import BartenderShake from "../../images/BartenderScene2.gif";
import BartenderStill from "../../images/bartenderstill.png";
const Bar = () => {
  const [bartenderScene, setBarTendeScene] = useState("");

  useEffect(() => {
    setBarTendeScene(BartenderStill);
  }, []);

  // const changeBarScene = () => {
  //   if (bartenderScene === BartenderStill) {
  //     setBarTendeScene(BartenderShake);
  //   } else {
  //     setBarTendeScene(BartenderStill);
  //   }
  // };

  return (
    <div className="bar">
      <div className="bar-imgs-container">
        <img className="bar-top" src="../../../BarBottles.png" />
        <img className="bartender" src={bartenderScene} />
        <img className="bar-counter" src="../../../Bar.png" />
      </div>
      <button className="order-btn">Order a Drink</button>
    </div>
  );
};

export default Bar;
