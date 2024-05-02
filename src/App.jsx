import { useEffect, useState } from "react";
import "./App.css";
import db from "./data/data.json";
import {
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Divider,
} from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";

function App() {
  const [filters, setFilters] = useState([]);
  const [filterSelections, setFilterSelections] = useState([]);
  const [storyPointEstimate, setStoryPointEstimate] = useState(1);
  const [maxFib, setMaxFib] = useState(1);

  // Run on initial startup
  useEffect(() => {
    setFilters(db.filters);
    setFilterSelections(Array(db.filters.length).fill(0));
    setMaxFib(db.maxFib);
  }, []);

  const computeStoryPointEstimate = (selectedIndex, filterIndex) => {
    // update selection array
    let optionIndexes = filterSelections;
    optionIndexes[filterIndex] = selectedIndex;

    setFilterSelections(optionIndexes);

    console.log(selectedIndex, filterIndex);

    // compute potential max value and current value
    let totalValue = 0;
    let maxValue = 0;
    let weights;

    for (let i = 0; i < filters.length; i++) {
      weights = filters[i].weights;
      totalValue += weights[optionIndexes[i]];
      maxValue += parseInt(weights.slice(-1));
    }

    console.log("totalValue:", totalValue);
    console.log("maxValue:", maxValue);

    // compute normalized estimate
    let estimate = (totalValue / maxValue) * maxFib;

    console.log("estimate:", estimate);

    // compute placement within fib seq
    let fib = [1, 2];
    let j = 1;
    while (fib[j] < estimate) {
      fib.push(fib[j - 1] + fib[j]);
      j++;
    }

    // determine what breakpoint is closest
    let distToPrev = Math.abs(fib[Math.max(0, j - 1)] - estimate);
    let distToNext = Math.abs(fib[j] - estimate);
    let finalEstimate =
      distToPrev < distToNext ? fib[Math.max(0, j - 1)] : fib[j];

    setStoryPointEstimate(finalEstimate);

    console.log("storyPoint:", finalEstimate);
  };

  return (
    <div className="app">
      <div className="content-container">
        <div style={{ display: "flex", gap: "8px" }}>
          <MenuBookIcon />
          <h3>Story Point Estimator</h3>
        </div>

        <p>
          Simple tool to estimate story point value during sprint retros.
          Fibonacci sequence is the scale used to determine the story point
          value. Max value: {maxFib}. Min value: 1
        </p>
        <div className="mid-container">
          <div className="filter-container">
            {filters.map((filter, filterIndex) => (
              <FormControl fullWidth>
                <InputLabel>{filter.type}</InputLabel>
                <Select
                  style={{
                    width: "100%",
                  }}
                  defaultValue={0}
                  key={filterIndex}
                  label={filter.type}
                  onChange={(e) =>
                    computeStoryPointEstimate(e.target.value, filterIndex)
                  }
                >
                  {filter.options.map((option, optionIndex) => (
                    <MenuItem key={optionIndex} value={optionIndex}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ))}
          </div>

          <Divider orientation="vertical" />

          <div className="storypoint-container">
            <div className="storypoint-number-container">
              <h2 className="storypoint-number">{storyPointEstimate}</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
