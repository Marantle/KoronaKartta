import { Typography, useTheme } from "@material-ui/core";
import CSS from "csstype";
import React from "react";
import { isDarkMode } from "../utils/dark";
import DataSwitcher, { SetRange } from "./DataSwitcher";
import { TotalCounts } from "./map/Map";

const headerStyle: CSS.Properties = {
  borderBottom: "1px solid #dd",
  textAlign: "left",
  paddingBottom: "10px",
};

const rowTitleStyle: CSS.Properties = {
  borderBottom: "1px solid #dd",
  textAlign: "left",
  paddingRight: "15px",
};

const rowStyle: CSS.Properties = {
  borderBottom: "1px solid #dd",
  textAlign: "right",
};
interface Props extends TotalCounts {
  setCurrentRange: SetRange;
}
const TotalCounter = (props: Props) => {
  const { setCurrentRange } = props;
  const theme = useTheme();
  let tableStyle: CSS.Properties = {
    backgroundColor: theme.palette.primary.light,
    border: "1px solid black",
  };

  if (isDarkMode) {
    tableStyle = {
      backgroundColor: theme.palette.primary.dark,
      color: "#fff",
      border: "1px solid white",
    };
  }

  const finalTableStyle = {
    ...tableStyle,
    zIndex: 1000,
    padding: "5px",
  };
  if (!props.title) {
    finalTableStyle.position = "absolute";
    finalTableStyle.left = "1%";
    finalTableStyle.top = "1%";
  } else {
    finalTableStyle.border = undefined;
    finalTableStyle.padding = "0";
    finalTableStyle.margin = "-5px";
  }
  return (
    <div style={finalTableStyle}>
      <table className="">
        <thead>
          <tr>
            <th colSpan={2} style={headerStyle}>
              <Typography noWrap variant="h5" component="h2">
                {props.title ?? "KOKO SUOMI"}
              </Typography>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={rowTitleStyle}>
              <Typography variant="subtitle1" component="h2" noWrap>
                Menehtyneitä
              </Typography>
            </td>
            <td style={rowStyle}>
              <Typography variant="subtitle1" component="h2">
                {props.deceased}
              </Typography>
            </td>
          </tr>
          <tr style={{ fontWeight: "bold" }}>
            <td style={rowTitleStyle}>
              <Typography
                noWrap
                variant="subtitle1"
                component="h2"
                style={{ fontWeight: "bold" }}
              >
                Tartuntoja
              </Typography>
            </td>
            <td style={rowStyle}>
              <Typography
                variant="subtitle1"
                component="h2"
                style={{ fontWeight: "bold" }}
              >
                {props.allInfections}
              </Typography>
            </td>
          </tr>
        </tbody>
      </table>
      <DataSwitcher {...{ setCurrentRange }} />
    </div>
  );
};

export default TotalCounter;
