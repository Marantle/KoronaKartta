import { isDarkMode } from "../utils/dark";
import CSS from "csstype";
import { useState } from "react";

let container: CSS.Properties = {
  zIndex: 1000,
  backgroundColor: "#fff",
  border: "1px solid black",
  fontSize: "17px",
  padding: "5px"
};

if (isDarkMode) {
  container = {
    ...container,
    backgroundColor: "#000",
    color: "#fff",
    border: "1px solid white"
  };
}

interface Props {
  thlAction: () => void;
  hsAction: () => void;
}
export default ({ thlAction, hsAction }: Props) => {
  const [checked, setChecked] = useState(false);

  const cbChanged = () => {
    if (!checked) thlAction();
    else hsAction();
    setChecked(!checked);
  };
  return (
    <div style={container}>
      <span className="title">Tietolähde: </span>
      <label className="switch">
        <input type="checkbox" onChange={cbChanged} />
        <span className="slider">
          <p className="hs">HS</p>
          <p className="thl">THL</p>
        </span>
      </label>
      {/* <span className="question" title="My tip"><p>?</p></span> */}
      <style jsx>{`
        display: flex;
        align-items: center;
        justify-content: space-between;
        .question {
          border: solid 1px white;
          width: 25px;
          height: 25px;
          border-radius: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: 5px;
        }
        .title {
          padding-right: 10px;
        }
        .hs {
          position: absolute;
          color: black;
          top -10px;
          left: 10px;
        }
        .thl {
          position: absolute;
          color: black;
          top -10px;
          right: 6px;
        }
        .switch {
          position: relative;
          display: inline-block;
          width: 80px;
          height: 34px;
          border: 1px solid black;
        }

        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #3b4e7a;
          -webkit-transition: 0.4s;
          transition: 0.4s;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 26px;
          width: 36px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          -webkit-transition: 0.4s;
          transition: 0.4s;
        }

        input:checked + .slider {
          background-color: #76b82a;
        }

        input:focus + .slider {
          box-shadow: 0 0 1px #2196f3;
        }

        input:checked + .slider:before {
          -webkit-transform: translateX(36px);
          -ms-transform: translateX(36px);
          transform: translateX(36px);
        }

        .slider.round {
          border-radius: 34px;
        }

        .slider.round:before {
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
};
