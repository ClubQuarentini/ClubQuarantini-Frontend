import React, { useState, useEffect } from "react";
import "./bar.css";
import Drinks from "../../Drinks";
import BartenderScene2 from "../../images/bartendergifs/BartenderScene2.gif";
import BartenderScene3 from "../../images/bartendergifs/Bartender3.gif";
import BartenderScene4 from "../../images/bartendergifs/Bartender4.gif";
import BartenderScene5 from "../../images/bartendergifs/Bartender5.gif";
import BartenderScene6 from "../../images/bartendergifs/Bartender6.gif";
import BartenderStill from "../../images/bartendergifs/bartenderstill.png";

const DrinkQue = ({ drink }) => {
  return (
    <p>
      {drink.name} ordered {drink.drinkID}
    </p>
  );
};

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
  const DropDownItem = ({
    sendDrinkOrderToServer,
    userName,
    roomName,
    drinkID,
    drinkImg,
    drinkName,
  }) => {
    return (
      <div
        onClick={(e) =>
          sendDrinkOrderToServer(e, { userName, roomName, drinkID })
        }
        className="menu-item"
      >
        <img className="icon-button" src={drinkImg} />
        {drinkName}
      </div>
    );
  };

  return (
    <div className="dropdown">
      {Drinks.map((drink) => {
        return (
          <DropDownItem
            key={drink.name}
            drinkName={drink.name}
            drinkImg={drink.img}
            userName={props.userName}
            roomName={props.roomName}
            drinkID={drink.name}
            sendDrinkOrderToServer={props.sendDrinkOrderToServer}
          />
        );
      })}
    </div>
  );
};

const Bar = (props) => {
  const [bartenderScene, setBarTenderScene] = useState("");
  const [drinkOrders, setDrinkOrders] = useState([]);

  useEffect(() => {
    console.log("hey i am getting drink orders");
    setBarTenderScene(BartenderStill);
    setDrinkOrders(props.drinkOrders);
    if (
      props.drinkOrders.length > 0 &&
      props.drinkOrders[0].name === props.userName
    ) {
      setBarTenderScene(BartenderScene2);
      setTimeout(() => {
        props.sendBartenderMakingDrink({
          userName: props.userName,
          roomName: props.roomName,
          drinkID: props.drinkID,
        });
        setBarTenderScene(BartenderStill);
      }, 10000);
    }
  }, [props.drinkOrders]);

  console.log("drink orders", drinkOrders);
  return (
    <div className="bar">
      <div className="bar-imgs-container">
        <img className="bar-top" src="../../../BarBottles.png" />
        <img className="bartender" src={bartenderScene} />
        <img className="bar-counter" src="../../../Bar.png" />
      </div>
      <div className="order-info">
        <Button>
          <DropDown {...props} />
        </Button>
        <div className="que">
          <h5>Drink Orders:</h5>
          <div className="que-info">
            {drinkOrders &&
              drinkOrders.map((drink, i) => {
                return <DrinkQue key={i} drink={drink} />;
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bar;
