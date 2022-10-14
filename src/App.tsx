import React from "react";
import PaceTable, { getSpeedFromKmDuration, Goal } from "./components/PaceTable";
import distances from "./distances";

const initMaxSpeed = Number(window.localStorage.getItem("maxSpeed"));

function App() {
  const [maxSpeed, setMaxSpeed] = React.useState(initMaxSpeed);
  const [selectedGoal, setSelectedGoal] = React.useState<Goal | null>(null);

  React.useEffect(() => {
    window.localStorage.setItem("maxSpeed", maxSpeed.toString());
  }, [maxSpeed, setMaxSpeed]);

  const distanceItem = React.useMemo(() => {
    return distances.find(d => d.km === selectedGoal?.distance);
  }, [selectedGoal]);
  const goalSpeed = selectedGoal !== null ? getSpeedFromKmDuration(selectedGoal.kmDuration) : null;

  return (
    <>
      <h1>Calculateur d'allure</h1>
      <div className="Header">
        <div className="SpeedInput">
          <div className="bold">VMA :</div>
          <input
            type="number"
            min={0}
            max={30}
            step={0.1}
            value={maxSpeed}
            onChange={e => setMaxSpeed(Number(e.target.value))}
          />
          <div>km/h</div>
        </div>
        <div className="Goal">
          {selectedGoal && distanceItem && goalSpeed && (
            <>
              <span className="bold">VMA pour l'objectif: </span>
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
        maxSpeed={maxSpeed}
        selectedGoal={selectedGoal}
        setSelectedGoal={setSelectedGoal}
      />
    </>
  );
}

export default App;
