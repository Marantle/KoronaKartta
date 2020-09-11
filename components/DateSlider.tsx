import {
  createMuiTheme,
  makeStyles,
  Slider,
  ThemeProvider,
  Typography,
} from "@material-ui/core";
import CSS from "csstype";
import { useRef, useEffect, ChangeEvent } from "react";
import { formatDate } from "../utils/date";
// position the slider at bottom of the screen
const sliderContainerStyle: CSS.Properties = {
  zIndex: 1000,
  position: "absolute",
  left: "10%",
  right: "10%",
  bottom: "1%",
};

interface Props {
  selectedDate: string;
  setSelectedDate: (string: string) => void;
  distinctDates: string[];
  dateSliderChanged: (event: ChangeEvent<{}>, value: number | number[]) => void;
}

const datesAsDates = (dates: string[]) => {
  return dates.map((d) => new Date(d));
};

const findBestDate = (testDate: Date, days: Date[]) => {
  let bestDate = days.length;
  let bestDiff = -new Date(0, 0, 0).valueOf();
  let currDiff = 0;
  let i;

  for (i = 0; i < days.length; ++i) {
    currDiff = Math.abs(days[i].getTime() - testDate.getTime());
    if (currDiff < bestDiff) {
      bestDate = i;
      bestDiff = currDiff;
    }
  }
  return days[bestDate];
};

export const DateSlider = ({
  selectedDate,
  setSelectedDate,
  distinctDates,
  dateSliderChanged,
}: Props) => {
  const sliderRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (distinctDates.includes(selectedDate)) {
      sliderRef.current.value = String(distinctDates.indexOf(selectedDate));
    } else {
      const bestDate = findBestDate(
        new Date(selectedDate),
        datesAsDates(distinctDates)
      );
      const bestDateString = formatDate(bestDate);
      sliderRef.current.value = String(distinctDates.indexOf(bestDateString));
      setSelectedDate(bestDateString);
    }
  }, [distinctDates]);

  const useStyles = makeStyles({
    valueLabel: {
      width: "300px",
    },
  });

  function valuetext(value: any) {
    return `${value}°C`;
  }

  const marks = distinctDates.map((d, ix) => ({ value: ix, label: d }));

  const muiTheme = createMuiTheme({
    overrides: {
      MuiSlider: {
        thumb: {
          height: "50px",
          width: "50px",
          transform: "translate(-20px, -20px);",
        },
      },
    },
  });
  return (
    <div style={sliderContainerStyle}>
      <span>
        <Typography variant="h4" component="h3">
          {selectedDate}
        </Typography>
      </span>

      <ThemeProvider theme={muiTheme}>
        <Slider
          ref={sliderRef}
          orientation="horizontal"
          defaultValue={distinctDates.length - 1}
          min={0}
          max={distinctDates.length - 1}
          aria-labelledby="vertical-slider"
          getAriaValueText={valuetext}
          onChange={dateSliderChanged}
        />
      </ThemeProvider>

      <style jsx>{`
        .circle {
          width: 64px;
          height: 64px;
        }
        div > input {
          pointer-events: auto;
        }

        span {
          font-family: "Roboto", sans-serif;
          font-size: 2em;
          width: 100%;
          display: block;
          text-align: center;
          line-height: 150%;
          margin-bottom: 15px;
        }

        @media (prefers-color-scheme: dark) {
          label,
          p {
            color: white;
            -webkit-text-stroke-width: 0.5px;
            -webkit-text-stroke-color: black;
          }
        }
        input {
          padding-bottom: 25px;
          width: 100%;
        }
        input[type="range"] {
          -webkit-appearance: none;
          width: 100%;
          background: transparent;
        }

        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
        }

        input[type="range"]:focus {
          outline: none;
        }

        input[type="range"]::-ms-track {
          width: 100%;
          cursor: pointer;

          background: transparent;
          border-color: transparent;
          color: transparent;
        }

        /* Special styling for WebKit/Blink */
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          border: 1px solid #000000;
          height: 46px;
          width: 33px;
          border-radius: 3px;
          background: #ffffff;
          cursor: pointer;
          margin-top: -14px; /* You need to specify a margin in Chrome, but in Firefox and IE it is automatic */
          box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d; /* Add cool effects to your sliders! */
        }

        /* All the same stuff for Firefox */
        input[type="range"]::-moz-range-thumb {
          box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
          border: 1px solid #000000;
          height: 46px;
          width: 33px;
          border-radius: 3px;
          background: #ffffff;
          cursor: pointer;
        }

        /* All the same stuff for IE */
        input[type="range"]::-ms-thumb {
          box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
          border: 1px solid #000000;
          height: 36px;
          width: 16px;
          border-radius: 3px;
          background: #ffffff;
          cursor: pointer;
        }

        input[type="range"]::-webkit-slider-runnable-track {
          width: 100%;
          height: 8.4px;
          cursor: pointer;
          box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
          background: #3071a9;
          border-radius: 1.3px;
          border: 0.2px solid #010101;
        }

        input[type="range"]:focus::-webkit-slider-runnable-track {
          background: #367ebd;
        }

        input[type="range"]::-moz-range-track {
          width: 100%;
          height: 8.4px;
          cursor: pointer;
          box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
          background: #3071a9;
          border-radius: 1.3px;
          border: 0.2px solid #010101;
        }

        input[type="range"]::-ms-track {
          width: 100%;
          height: 8.4px;
          cursor: pointer;
          background: transparent;
          border-color: transparent;
          border-width: 16px 0;
          color: transparent;
        }
        input[type="range"]::-ms-fill-lower {
          background: #2a6495;
          border: 0.2px solid #010101;
          border-radius: 2.6px;
          box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
        }
        input[type="range"]:focus::-ms-fill-lower {
          background: #3071a9;
        }
        input[type="range"]::-ms-fill-upper {
          background: #3071a9;
          border: 0.2px solid #010101;
          border-radius: 2.6px;
          box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
        }
        input[type="range"]:focus::-ms-fill-upper {
          background: #367ebd;
        }
      `}</style>
    </div>
  );
};
