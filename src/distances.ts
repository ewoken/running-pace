interface DistanceItem {
  km: number;
  maxSpeedInterval: [number, number];
}

const distances: DistanceItem[] = [
  {
    km: 5,
    maxSpeedInterval: [0.9, 0.95],
  },
  {
    km: 10,
    maxSpeedInterval: [0.85, 0.9],
  },
  {
    km: 15,
    maxSpeedInterval: [0.82, 0.88],
  },
  {
    km: 20,
    maxSpeedInterval: [0.8, 0.85],
  },
  {
    km: 21.1,
    maxSpeedInterval: [0.8, 0.85],
  },
  {
    km: 30,
    maxSpeedInterval: [0.77, 0.82],
  },
  {
    km: 42.2,
    maxSpeedInterval: [0.75, 0.8],
  },
];

export default distances;
