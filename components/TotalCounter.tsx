import CSS from "csstype";
import { TotalCounts } from "./map/Map";
import { isDarkMode } from "../utils/dark";

let tableStyle: CSS.Properties = {
  zIndex: 1000,
  position: "absolute",
  left: "1%",
  top: "1%",
  backgroundColor: "#fff",
  border: "1px solid black",
  fontSize: "12px",
  padding: "5px"
};

if (isDarkMode) {
  tableStyle = {
    zIndex: 1000,
    position: "absolute",
    left: "1%",
    top: "1%",
    backgroundColor: "#000",
    color: "#fff",
    border: "1px solid white",
    fontSize: "12px",
    padding: "5px"
  };
}

const headerStyle: CSS.Properties = {
  borderBottom: "1px solid #dd",
  textAlign: "left",
  paddingBottom: "10px"
};

const rowTitleStyle: CSS.Properties = {
  borderBottom: "1px solid #dd",
  textAlign: "left",
  paddingRight: "15px"
};

const rowStyle: CSS.Properties = {
  borderBottom: "1px solid #dd",
  textAlign: "right"
};

interface Props extends TotalCounts {
  thlAction: () => void;
  hsAction: () => void;
}
export default (props: Props) => {
  // const { hsAction, thlAction } = props;
  return (
    <div style={tableStyle}>
      <table>
        <thead>
          <tr>
            <th colSpan={2} style={headerStyle}>
              KOKO SUOMI
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={rowTitleStyle}>Menehtyneitä</td>
            <td style={rowStyle}>{props.deceased}</td>
          </tr>
          <tr style={{ fontWeight: "bold" }}>
            <td style={rowTitleStyle}>Tartuntoja kaikkiaan</td>
            <td style={rowStyle}>{props.allInfections}</td>
          </tr>
        </tbody>
      </table>

      {/* <DataSourceSwitcher {...{ hsAction, thlAction }} /> */}
    </div>
  );
};
