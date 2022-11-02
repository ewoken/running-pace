import { InputNumber } from "antd";
import React from "react";
import PaceTable, { getSpeedFromKmDuration, Goal } from "./components/PaceTable";
import distances from "./distances";

const initMaxAerobicSpeed = Number(window.localStorage.getItem("maxAerobicSpeed") ?? 8);

function App() {
  const [maxAerobicSpeed, setMaxAerobicSpeed] = React.useState(initMaxAerobicSpeed);
  const [selectedGoal, setSelectedGoal] = React.useState<Goal | null>(null);

  React.useEffect(() => {
    window.localStorage.setItem("maxAerobicSpeed", maxAerobicSpeed.toString());
  }, [maxAerobicSpeed, setMaxAerobicSpeed]);

  const distanceItem = React.useMemo(() => {
    return distances.find(d => d.km === selectedGoal?.distance);
  }, [selectedGoal]);
  const goalSpeed = selectedGoal !== null ? getSpeedFromKmDuration(selectedGoal.kmDuration) : null;

  return (
    <div className="App">
      <h1>Running pace</h1>
      <div className="Header">
        <div className="SpeedInput">
          <div className="bold">Max Aero Speed:</div>
          <InputNumber
            className="MAS_input"
            size="small"
            min={8}
            max={30}
            step={0.1}
            value={maxAerobicSpeed}
            defaultValue={14}
            onChange={value => value && setMaxAerobicSpeed(value)}
            addonAfter="km/h"
          />
        </div>
        <div className="Goal">
          {selectedGoal && distanceItem && goalSpeed && (
            <>
              <span className="bold">Goal MAS: </span>
              {/* <span>{selectedGoal.distance} km </span>
              <span>en {formatDuration(selectedGoal.distance * selectedGoal.kmDuration)}</span> */}
              <span className="red">
                {(goalSpeed / distanceItem.maxSpeedInterval[1]).toFixed(2)}
                {" km/h"}
              </span>
              {" → "}
              <span className="green">
                {(goalSpeed / distanceItem.maxSpeedInterval[0]).toFixed(2)}
                {" km/h"}
              </span>
            </>
          )}
        </div>
      </div>

      <PaceTable
        maxAerobicSpeed={maxAerobicSpeed}
        selectedGoal={selectedGoal}
        setSelectedGoal={setSelectedGoal}
      />
    </div>
  );
}

export default App;
