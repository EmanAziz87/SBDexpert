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
  const [selectedLift, setSelectedLift] = useState<LiftInfo>({
    name: "Back Squat",
    personalRecord: { weightInPounds: 315, reps: 5 },
  });
  const [newGoal, setNewGoal] = useState<number>(
    selectedLift.personalRecord.weightInPounds
  );

  const handleGoalChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    setNewGoal(Number(e.currentTarget.value));
  };

  const handleSelectedLift = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const foundLift = lifts.find((lift) => lift.name === e.currentTarget.value);
    if (foundLift) {
      setSelectedLift(foundLift);
      setNewGoal(foundLift.personalRecord.weightInPounds);
    }
  };

  return (
    <>
      {lifts.map((lift) => (
        <div key={lift.name}>
          <span>
            {lift.name} : {lift.personalRecord.weightInPounds}lbs and{" "}
            {lift.personalRecord.reps} reps
          </span>
          <br />
        </div>
      ))}
      <form action="">
        <select
          name="lifts"
          id="lifts"
          onChange={(e) => handleSelectedLift(e)}
          value={selectedLift.name}
        >
          {lifts.map((lift) => (
            <option key={lift.name}>{lift.name}</option>
          ))}
        </select>
        {selectedLift && (
          <input
            value={newGoal}
            onChange={(e) => handleGoalChange(e)}
            type="number"
            min={selectedLift.personalRecord.weightInPounds}
          />
        )}
      </form>
    </>
  );
}

export default App;
