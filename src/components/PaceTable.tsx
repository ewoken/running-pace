import distances from "../distances";
import formatDuration from "../formatDuration";
import { interpolateRdYlGn } from "d3-scale-chromatic";
import React from "react";

const MIN_KM_DURATION_S = 3 * 60;
const MAX_KM_DURATION_S = 8 * 60;
const KM_DURATION_INCREMENT_S = 5;

export function getSpeedFromKmDuration(duration: number) {
  return 3600 / duration;
}

const kmDurations = Array.from({ length: (MAX_KM_DURATION_S - MIN_KM_DURATION_S) / 5 + 1 })
  .map((_, i) => {
    return MIN_KM_DURATION_S + i * KM_DURATION_INCREMENT_S;
  })
  .reverse();

function interpolate(range: [number, number], t: number, tolerance = 0.15) {
  const value = (t - range[0]) / (range[1] - range[0]);
  if (value < -tolerance || value > 1 + tolerance) return undefined;
  return interpolateRdYlGn(1 - value);
}

function getZone(speedRatio: number) {
  if (speedRatio < 0.6) {
    return "";
  } else if (speedRatio < 0.7) {
    return "zone2";
  } else if (speedRatio < 0.8) {
    return "zone3";
  } else if (speedRatio < 0.9) {
    return "zone4";
  } else if (speedRatio < 1.1) {
    return "zone5";
  } else {
    return "";
  }
}

export interface Goal {
  distance: number;
  kmDuration: number;
}

interface P {
  maxSpeed: number;
  selectedGoal: Goal | null;
  setSelectedGoal: (value: Goal | null) => void;
}

function PaceTable({ maxSpeed, setSelectedGoal }: P) {
  const onMouseLeave = React.useCallback(() => {
    setSelectedGoal(null);
  }, [setSelectedGoal]);

  return (
    <table className="PaceTable">
      <thead>
        <tr>
          <th>T/km</th>
          <th>km/h</th>
          <th className="bigRightBorder">% MAS</th>
          {distances.map(distance => {
            return <th>{distance.km} km</th>;
          })}
        </tr>
      </thead>
      <tbody>
        {kmDurations.map(duration => {
          const speed = getSpeedFromKmDuration(duration);
          const speedRatio = speed / maxSpeed;
          const isMinute = duration % 60 === 0;
          const zone = getZone(speedRatio);

          return (
            <tr className={isMinute ? "bottomBorder" : undefined}>
              <th>{formatDuration(duration)}</th>
              <th className={zone}>{speed.toFixed(2)}</th>
              <th className={"bigRightBorder " + zone}>{(speedRatio * 100).toFixed(0)}</th>
              {distances.map(distance => {
                const color = interpolate(distance.maxSpeedInterval, speedRatio);
                return (
                  <td
                    className="hoverable"
                    style={{ backgroundColor: color }}
                    onMouseEnter={() => {
                      setSelectedGoal({ distance: distance.km, kmDuration: duration });
                    }}
                    onMouseLeave={onMouseLeave}
                  >
                    {formatDuration(distance.km * duration)}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default PaceTable;
