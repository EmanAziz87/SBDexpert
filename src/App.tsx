import { useState } from "react";

interface LiftInfo {
  name: string;
  personalRecord: { weightInPounds: number; reps: number; currentGoal: number };
}

type SplitType = "days" | "weeks";

const trainingBlockPercentages = (
  trainingBlockLength: number,
  intervalLength: number
) => {
  if (trainingBlockLength % intervalLength !== 0 || trainingBlockLength > 30) {
    console.error(
      "training block length must be a multiple of block interval and it must be less than 31, otherwise, choose the weekly option"
    );
    return -1;
  }

  if (intervalLength > 6) {
    console.error(
      "block interval must be 6 or less days, otherwise choose the weekly option"
    );
    return -1;
  }

  let intervals: number = trainingBlockLength / intervalLength;
  let interval = 1;
  const intensityVolumeAdjustments = [];
  while (intervals > 0) {
    const weekIntensity = {
      interval: interval,
      intervalLength,
      trainingBlockLength,
      percentOf1RepMax: 100 - (intervals - 1) * 10,
    };
    intensityVolumeAdjustments.push(weekIntensity);
    interval++;
    intervals--;
  }
  console.log(intensityVolumeAdjustments);
};

trainingBlockPercentages(30, 6);

const progressionScheme = (
  currentWeight: number,
  goalWeight: number,
  lift: string
) => {};

const mockLifts: LiftInfo[] = [
  {
    name: "Back Squat",
    personalRecord: { weightInPounds: 315, reps: 5, currentGoal: 0 },
  },
  {
    name: "Bench Press",
    personalRecord: { weightInPounds: 225, reps: 3, currentGoal: 0 },
  },
  {
    name: "Deadlift",
    personalRecord: { weightInPounds: 405, reps: 1, currentGoal: 0 },
  },
  {
    name: "Overhead Press",
    personalRecord: { weightInPounds: 135, reps: 8, currentGoal: 0 },
  },
  {
    name: "Barbell Row",
    personalRecord: { weightInPounds: 185, reps: 10, currentGoal: 0 },
  },
  {
    name: "Incline Dumbbell Press",
    personalRecord: { weightInPounds: 80, reps: 12, currentGoal: 0 },
  },
];

function App() {
  const [lifts, setLifts] = useState<LiftInfo[]>(mockLifts);
  const [selectedLift, setSelectedLift] = useState<LiftInfo>({
    name: "Back Squat",
    personalRecord: { weightInPounds: 315, reps: 5, currentGoal: 0 },
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

  const handleNewGoalSubmission = (
    e: React.SyntheticEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const newLiftObject: LiftInfo = {
      ...selectedLift,
      personalRecord: { ...selectedLift.personalRecord, currentGoal: newGoal },
    };
    setLifts([
      ...lifts.filter((lift) => lift.name !== newLiftObject.name),
      newLiftObject,
    ]);
  };

  return (
    <>
      {lifts.map((lift) => (
        <div key={lift.name}>
          <span>
            {lift.name} : {lift.personalRecord.weightInPounds}lbs and{" "}
            {lift.personalRecord.reps} reps - Next Goal:{" "}
            {lift.personalRecord.currentGoal}
          </span>
          <br />
        </div>
      ))}
      <form action="" onSubmit={handleNewGoalSubmission}>
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
        <button type="submit">Add New Goal</button>
      </form>
    </>
  );
}

export default App;
