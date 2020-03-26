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
  paddingBottom: "15px"
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

export default (totalCounts: TotalCounts) => (
  <table style={tableStyle}>
    <thead>
      <tr>
        <th colSpan={2} style={headerStyle}>
          KOKO SUOMI
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style={rowTitleStyle}>Sairaita</td>
        <td style={rowStyle}>{totalCounts.currentInfections}</td>
      </tr>
      <tr>
        <td style={rowTitleStyle}>Parantuneita</td>
        <td style={rowStyle}>{totalCounts.curedInfections}</td>
      </tr>
      <tr>
        <td style={rowTitleStyle}>Menehtyneitä</td>
        <td style={rowStyle}>{totalCounts.deceased}</td>
      </tr>
      <tr style={{ fontWeight: "bold" }}>
        <td style={rowTitleStyle}>Tartuntoja kaikkiaan</td>
        <td style={rowStyle}>{totalCounts.allInfections}</td>
      </tr>
    </tbody>
  </table>
);
