import { useEffect, useState } from "react";
import "./App.css";
import db from "./data/data.json";

function App() {
  const [filters, setFilters] = useState([]);
  const [filterSelections, setFilterSelections] = useState([]);
  const [storyPointEstimate, setStoryPointEstimate] = useState();
  const [maxFib, setMaxFib] = useState(-1);

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
      <h1>Story Point Estimator</h1>

      {filters.map((filter, filterIndex) => (
        <div className="dropdown" key={filterIndex}>
          <label>{filter.type}</label>
          <select
            name={filter.type}
            key={filterIndex}
            onChange={(event) =>
              computeStoryPointEstimate(event.target.selectedIndex, filterIndex)
            }
          >
            {filter.options.map((option, optionIndex) => (
              <option key={optionIndex} value={optionIndex}>
                {option}
              </option>
            ))}
          </select>
        </div>
      ))}

      <div className="storypoint-container">
        <p>Estimated Story Point</p>
        <p>
          <b>{storyPointEstimate}</b>
        </p>
      </div>
    </div>
  );
}

export default App;
