import distances from "../distances";
import formatDuration from "../formatDuration";
import { interpolateRdYlGn } from "d3-scale-chromatic";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import React from "react";

const MIN_KM_DURATION_S = 3 * 60;
const MAX_KM_DURATION_S = 7 * 60;
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

  const data = React.useMemo(() => {
    return kmDurations.map(duration => {
      const speed = getSpeedFromKmDuration(duration);
      const speedRatio = speed / maxSpeed;
      // const isMinute = duration % 60 === 0;
      const zone = getZone(speedRatio);
      return {
        key: duration.toString() + maxSpeed.toString(),
        kmDuration: duration,
        speed,
        speedRatio,
        zone,
      };
    });
  }, [maxSpeed]);

  const columns = React.useMemo(() => {
    const _: ColumnsType<typeof data[number]> = [
      {
        key: "kmDuration",
        title: "T/km",
        dataIndex: "kmDuration",
        fixed: "left",
        width: 50,
        align: "center",
        className: "kmDuration",
        render(_, row) {
          return formatDuration(row.kmDuration);
        },
        onCell(row) {
          return {
            className: row.zone,
          };
        },
      },
      {
        key: "speed",
        title: "km/h",
        fixed: "left",
        width: 35,
        align: "center",
        render(_, row) {
          return row.speed.toFixed(1);
        },
        onCell(row) {
          return {
            className: row.zone,
          };
        },
      },
      {
        key: "speedRatio",
        title: "%",
        fixed: "left",
        width: 35,
        align: "center",
        render(_, row) {
          return (row.speedRatio * 100).toFixed(0);
        },
        onCell(row) {
          return {
            className: row.zone,
            style: {
              borderRight: "2px solid black", // #f0f0f0",
            },
          };
        },
        onHeaderCell() {
          return {
            style: {
              borderRight: "2px solid black", // #fafafa",
            },
          };
        },
      },
      ...distances.map(distance => {
        const column: ColumnsType<typeof data[number]>[number] = {
          key: distance.km.toString(),
          title: `${distance.km} km`,
          width: 60,
          align: "center" as const,
          render(_, row) {
            return formatDuration(distance.km * row.kmDuration);
          },
          onCell(row) {
            const color = interpolate(distance.maxSpeedInterval, row.speedRatio);
            return {
              className: "hoverable",
              style: {
                backgroundColor: color,
              },
              onMouseEnter: () => {
                setSelectedGoal({ distance: distance.km, kmDuration: row.kmDuration });
              },
              onMouseLeave,
            };
          },
        };
        return column;
      }),
    ];
    return _;
  }, [onMouseLeave, setSelectedGoal]);

  return (
    <div className="PaceTable">
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        size={"small"}
        scroll={{ y: "100%" }}
        sticky
        // sticky={{ offsetHeader: 48 }}
        onRow={row => {
          const isMinute = row.kmDuration % 60 === 0;
          return {
            className: isMinute ? "isMinute" : undefined,
          };
        }}
      />
    </div>
  );
}

export default PaceTable;
