import { isDarkMode } from "../utils/dark";
import CSS from "csstype";
import { useState } from "react";

let container: CSS.Properties = {
  zIndex: 1000,
  backgroundColor: "#fff",
  border: "1px solid black",
  fontSize: "17px",
  padding: "5px",
};

if (isDarkMode) {
  container = {
    ...container,
    backgroundColor: "#000",
    color: "#fff",
    border: "1px solid white",
  };
}

export enum DataType {
  DAILY = "DAILY",
  TOTAL = "TOTAL",
}
export type SetRange = (dataType: DataType) => void;

interface Props {
  setCurrentRange: SetRange;
}

export default ({ setCurrentRange: toggleDataType }: Props) => {
  const [checked, setChecked] = useState(false);

  const cbChanged = () => {
    console.log(checked);
    if (!checked) toggleDataType(DataType.DAILY);
    else toggleDataType(DataType.TOTAL);
    setChecked(!checked);
  };
  return (
    <div style={container}>
      <label className="switch">
        <input type="checkbox" onChange={cbChanged} />
        <span className="slider">
          <p className="left">Kaikki</p>
          <p className="right">Päivä</p>
        </span>
      </label>
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
        .left {
          position: absolute;
          color: black;
          top -10px;
          left: 10px;
        }
        .right {
          position: absolute;
          color: black;
          top -10px;
          right: 10px;
        }
        .switch {
          position: relative;
          display: inline-block;
          width: 160px;
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
          width: 56px;
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
          transform: translateX(96px);
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
