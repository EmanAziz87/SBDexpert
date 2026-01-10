import { useState } from "react";

interface LiftInfo {
  name: string;
  personalRecord: { weightInPounds: number; reps: number };
}

const mockLifts: LiftInfo[] = [
  {
    name: "Back Squat",
    personalRecord: { weightInPounds: 315, reps: 5 },
  },
  {
    name: "Bench Press",
    personalRecord: { weightInPounds: 225, reps: 3 },
  },
  {
    name: "Deadlift",
    personalRecord: { weightInPounds: 405, reps: 1 },
  },
  {
    name: "Overhead Press",
    personalRecord: { weightInPounds: 135, reps: 8 },
  },
  {
    name: "Barbell Row",
    personalRecord: { weightInPounds: 185, reps: 10 },
  },
  {
    name: "Incline Dumbbell Press",
    personalRecord: { weightInPounds: 80, reps: 12 },
  },
];

function App() {
  const [lifts, setLifts] = useState<LiftInfo[]>(mockLifts);
  return (
    <>
      {mockLifts.map((lift) => (
        <span>
          {lift.name} : {lift.personalRecord.weightInPounds}lbs and{" "}
          {lift.personalRecord.reps} reps
        </span>
      ))}
    </>
  );
}

export default App;
