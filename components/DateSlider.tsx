import {
  Slider,
  Tooltip,
  Typography,
  ValueLabelProps,
} from "@material-ui/core";
import { ChangeEvent, createContext, useContext, useRef } from "react";
// position the slider at bottom of the screen

interface Props {
  distinctDates: string[];
  dateSliderChanged: (event: ChangeEvent<{}>, value: number | number[]) => void;
}

interface DatesContext {
  distinctDates: string[];
}

const DatesContext = createContext<DatesContext>({ distinctDates: [] });

const useDatesContext = () => useContext(DatesContext);
function ValueLabelComponent(props: ValueLabelProps) {
  const { children, open, value } = props;
  const { distinctDates } = useDatesContext();
  return (
    <Tooltip
      arrow
      open={open}
      enterTouchDelay={0}
      placement="top"
      title={
        <Typography variant="h5" component={"p"}>
          {distinctDates[value]}
        </Typography>
      }
    >
      {children}
    </Tooltip>
  );
}

export const DateSlider = ({ distinctDates, dateSliderChanged }: Props) => {
  const sliderRef = useRef<HTMLInputElement | null>(null);

  function valuetext(value: number) {
    return `${distinctDates[value]}`;
  }

  return (
    <DatesContext.Provider value={{ distinctDates }}>
      <div className="container">
        <Slider
          ref={sliderRef}
          orientation="horizontal"
          defaultValue={distinctDates.length - 1}
          min={0}
          max={distinctDates.length - 1}
          aria-labelledby="vertical-slider"
          getAriaValueText={valuetext}
          onChange={dateSliderChanged}
          ValueLabelComponent={ValueLabelComponent}
          valueLabelDisplay="on"
        />

        <style jsx>{`
          .container {
            z-ndex: 1000;
            position: absolute;
            left: 10%;
            right: 10%;
            bottom: 4%;
          }
        `}</style>
      </div>
    </DatesContext.Provider>
  );
};
