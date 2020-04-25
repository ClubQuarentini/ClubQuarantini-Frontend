import React, { useState, useEffect } from "react";
import "./bar.css";
import Drinks from "../../Drinks";
import BartenderScene1 from "../../images/bartendergifs/bartender1.png";
import BartenderScene2 from "../../images/bartendergifs/bartender2.png";
import BartenderScene3 from "../../images/bartendergifs/bartender3.png";
import BartenderScene4 from "../../images/bartendergifs/bartender4.png";
import BartenderStill from "../../images/bartendergifs/bartenderstill.png";
import { useSpring, animated } from "react-spring";
import CheckoutForm from "../Checkout/Checkout";

const createTheDrinkQue = (drinkOrders) => {
  if (drinkOrders.length > 1) {
    return (
      <div className="drink-que">
        <p className="serving">
          Serving {drinkOrders[0].name} a <span>{drinkOrders[0].drinkID}</span>
        </p>
        <p className="on-deck">
          {drinkOrders[1].drinkID} up next for{" "}
          <span>{drinkOrders[1].name}</span>
        </p>
      </div>
    );
  } else {
    return (
      <div className="drink-que">
        <p>
          Serving {drinkOrders[0].name} a <span>{drinkOrders[0].drinkID}</span>
        </p>
      </div>
    );
  }
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

  //test
  //test
  const calc = (x, y) => [
    -(y - window.innerHeight / 2) / 20,
    (x - window.innerWidth / 2) / 20,
    1.05,
  ];
  const trans = (x, y, s) =>
    `perspective(1000px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`;
  const [card, set] = useSpring(() => ({
    xys: [0, 0, 1],
    config: { mass: 5, tension: 300, friction: 60 },
  }));

  //react-spring transitions
  const fade = useSpring({
    config: { duration: 500 },
    from: { opacity: 0, transform: `translate3d(0,-100%,0)` },
    to: { opacity: 1, transform: `translate3d(0,0%,0)` },
    delay: 300,
  });

  useEffect(() => {
    // console.log("hey i am getting drink orders");
    setBarTenderScene(BartenderStill);
    setDrinkOrders(props.drinkOrders);
    if (
      props.drinkOrders.length > 0 &&
      props.drinkOrders[0].name === props.userName
    ) {
      let barScenes = [
        BartenderScene1,
        BartenderScene2,
        BartenderScene3,
        BartenderScene4,
      ];
      let randomNum = Math.floor(Math.random() * barScenes.length);
      setBarTenderScene(barScenes[randomNum]);
      setTimeout(() => {
        props.sendBartenderMakingDrink({
          userName: props.userName,
          roomName: props.roomName,
        });
        setBarTenderScene(BartenderStill);
      }, 10000);
    }
  }, [props.drinkOrders]);

  // console.log("drink orders", drinkOrders);
  return (
    <animated.div style={fade} className="bar">
      <animated.div
        onMouseMove={({ clientX: x, clientY: y }) => set({ xys: calc(x, y) })}
        onMouseLeave={() => set({ xys: [0, 0, 1] })}
        style={{ transform: card.xys.interpolate(trans) }}
        className="bar-imgs-container"
      >
        <img className="bar-top" src="../../../bar-top.png" />
        <img className="bartender" src={bartenderScene} />
        <img className="bar-counter" src="../../../Bar.svg" />
      </animated.div>
      <div className="order-info">
        <div id="bar-btns">
        <Button>
          <DropDown {...props} />
        </Button>
        <button onClick={() => <CheckoutForm/>}
              className="relief-btn"
            >
              Tip for Covid Relief
        </button>
        </div>
        <div className="que">
          <h5>Drink Orders</h5>
          {drinkOrders.length > 0 && createTheDrinkQue(drinkOrders)}
        </div>
      </div>
    </animated.div>
  );
};

export default Bar;
