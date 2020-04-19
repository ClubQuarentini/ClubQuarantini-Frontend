import React, { useState, useEffect } from "react";
import "./bar.css";
import Drinks from "../../Drinks";
import BartenderScene2 from "../../images/bartendergifs/BartenderScene2.gif";
import BartenderScene3 from "../../images/bartendergifs/Bartender3.gif";
import BartenderScene4 from "../../images/bartendergifs/Bartender4.gif";
import BartenderScene5 from "../../images/bartendergifs/Bartender5.gif";
import BartenderScene6 from "../../images/bartendergifs/Bartender6.gif";
import BartenderStill from "../../images/bartendergifs/bartenderstill.png";

const Button = (props) => {
  const [open, setOpen] = useState(false);
  return (
    <button onClick={() => setOpen(!open)} className="order-btn">
      Order a Drink
      {open && props.children}
    </button>
  );
};

const DropDown = (props) => {
  const DropDownItem = (props) => {
    return (
      <a href="#" className="menu-item">
        <img className="icon-button" src={props.drinkImg} />
        {props.name}
      </a>
    );
  };

  return (
    <div className="dropdown">
      {Drinks.map((drink) => {
        return (
          <DropDownItem
            key={drink.name}
            name={drink.name}
            drinkImg={drink.img}
          />
        );
      })}
    </div>
  );
};

const Bar = () => {
  const [bartenderScene, setBarTendeScene] = useState("");

  useEffect(() => {
    setBarTendeScene(BartenderStill);
  }, []);

  const changeBarScene = () => {
    console.log("hello");
    if (bartenderScene === BartenderStill) {
      setBarTendeScene(BartenderScene2);
    } else {
      setBarTendeScene(BartenderStill);
    }
  };

  return (
    <div className="bar">
      <div className="bar-imgs-container">
        <img className="bar-top" src="../../../BarBottles.png" />
        <img className="bartender" src={bartenderScene} />
        <img className="bar-counter" src="../../../Bar.png" />
      </div>
      <Button>
        <DropDown />
      </Button>
    </div>
  );
};

export default Bar;
