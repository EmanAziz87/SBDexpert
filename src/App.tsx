import React, { useState } from "react";

interface LiftInfo {
  id: number;
  name: string;
  personalRecord: { weightInPounds: number; reps: number; currentGoal: number };
}

interface TrainingBlockObj {
  trainingBlockWeeks: number;
  weeklyFrequency: number;
  minimumIntensity: number;
}

interface DayDetail {
  [key: string]: LiftDayDetails;
}

interface LiftDayDetails {
  lifts: Array<string>;
}

interface ProgramDetails {
  week: number;
  intensityPercent: number;
  weeklyFrequency: number;
  setsPerSession: number;
  repsPerSet: number;
  totalWeeklySetsPerLift: number;
  days: {
    [key: string]: Array<LiftDayDetails>;
  };
}

const trainingBlockPercentages = (
  trainingBlockWeeks: number,
  weeklyFrequency: number,
  minimumIntensity: number
) => {
  if (
    trainingBlockWeeks < 1 ||
    trainingBlockWeeks > 12 ||
    weeklyFrequency < 1 ||
    weeklyFrequency > 7
  ) {
    console.error("Values out of range: Weeks (1-12), Frequency (1-7)");
    return -1;
  }

  const intensityVolumeAdjustments = [];
  const minIntensity = minimumIntensity;
  const maxIntensity = 100;

  // total growth is 50%
  const totalGrowth = maxIntensity - minIntensity;

  // weekly volume increases. Take total growth which is 50% and divide it by the
  // amount of weeks in our training block minus 1. so if the training block is 8 weeks, then
  // 50% / 7 = 7.14% increase per week in intensity. Why do we subtract one from our training
  // block weeks before we divide from totalGrowth? because 50% counts as the first week. so
  // there should be 7 jumps left to get to 100% intensity.
  const weeklyStep =
    trainingBlockWeeks > 1 ? totalGrowth / (trainingBlockWeeks - 1) : 0;

  for (let i = 0; i < trainingBlockWeeks; i++) {
    const currentWeek = i + 1;
    const intensity = Math.round(minIntensity + i * weeklyStep);

    let repsPerSet = 0;
    let setsPerSession = 0;

    if (intensity === 100) {
      setsPerSession = 1;
      repsPerSet = 1;
    } else if (intensity >= 95) {
      setsPerSession = 3;
      repsPerSet = 1;
    } else if (intensity > 90) {
      setsPerSession = 5;
      repsPerSet = 1;
    } else if (intensity >= 85) {
      setsPerSession = 5;
      repsPerSet = 2;
    } else {
      setsPerSession = 5;
      repsPerSet = 5;
    }

    const totalWeeklySetsPerLift = setsPerSession * weeklyFrequency;

    intensityVolumeAdjustments.push({
      week: currentWeek,
      intensityPercent: intensity,
      weeklyFrequency: weeklyFrequency,
      setsPerSession: setsPerSession,
      repsPerSet: repsPerSet,
      totalWeeklySetsPerLift: totalWeeklySetsPerLift,
    });
  }

  console.table(intensityVolumeAdjustments);
  return intensityVolumeAdjustments;
};

const mockLifts: LiftInfo[] = [
  {
    id: 1,
    name: "Back Squat",
    personalRecord: { weightInPounds: 315, reps: 5, currentGoal: 0 },
  },
  {
    id: 2,
    name: "Bench Press",
    personalRecord: { weightInPounds: 225, reps: 3, currentGoal: 0 },
  },
  {
    id: 3,
    name: "Deadlift",
    personalRecord: { weightInPounds: 405, reps: 1, currentGoal: 0 },
  },
  {
    id: 4,
    name: "Overhead Press",
    personalRecord: { weightInPounds: 135, reps: 8, currentGoal: 0 },
  },
  {
    id: 5,
    name: "Barbell Row",
    personalRecord: { weightInPounds: 185, reps: 10, currentGoal: 0 },
  },
  {
    id: 6,
    name: "Incline Dumbbell Press",
    personalRecord: { weightInPounds: 80, reps: 12, currentGoal: 0 },
  },
];

function App() {
  const [lifts, setLifts] = useState<LiftInfo[]>(mockLifts);
  const [selectedLift, setSelectedLift] = useState<LiftInfo>(lifts[0]);
  const [newGoal, setNewGoal] = useState<number>(
    selectedLift.personalRecord.weightInPounds
  );
  const [newTrainingBlock, setNewTrainingBlock] = useState<TrainingBlockObj>({
    trainingBlockWeeks: 0,
    weeklyFrequency: 0,
    minimumIntensity: 0,
  });
  const [program, setProgram] = useState<ProgramDetails[]>([]);

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

  const handleTrainingProgramSubmission = (
    e: React.SyntheticEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const trainingBlockInfo = trainingBlockPercentages(
      newTrainingBlock.trainingBlockWeeks,
      newTrainingBlock.weeklyFrequency,
      newTrainingBlock.minimumIntensity
    );

    const newProgram = expandTrainingBlockWithDays(trainingBlockInfo);
    console.table(newProgram);
    setProgram([...newProgram]);
  };

  const expandTrainingBlockWithDays = (trainingBlockInfo: any) => {
    for (let i = 0; i < trainingBlockInfo.length; i++) {
      let workoutDaysObject: DayDetail = {};
      for (let j = 0; j < trainingBlockInfo[i].weeklyFrequency; j++) {
        workoutDaysObject = {
          ...workoutDaysObject,
          [`day${j + 1}`]: { lifts: ["exercise 1", "exercise 2"] },
        };
      }
      trainingBlockInfo[i] = {
        ...trainingBlockInfo[i],
        days: {
          ...workoutDaysObject,
        },
      };
    }
    return trainingBlockInfo;
  };

  const handleNewTrainingBlockInputs = (
    e: React.SyntheticEvent<HTMLInputElement>
  ) => {
    const inputToNumber = Number(e.currentTarget.value);
    switch (e.currentTarget.id) {
      case "block-duration-input":
        setNewTrainingBlock({
          ...newTrainingBlock,
          trainingBlockWeeks: inputToNumber,
        });
        break;
      case "weekly-frequency-input":
        setNewTrainingBlock({
          ...newTrainingBlock,
          weeklyFrequency: inputToNumber,
        });
        break;
      case "min-intensity-input":
        setNewTrainingBlock({
          ...newTrainingBlock,
          minimumIntensity: inputToNumber,
        });
        break;
      default:
        console.error(
          "something went wrong, the inputs should assigned to block duration, weekly frequency, or min intensity"
        );
    }
  };

  const handleDeleteLift = (currentLift: LiftInfo) => {
    setLifts([...lifts.filter((lift) => lift.id !== currentLift.id)]);
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
          <button onClick={(e) => handleDeleteLift(lift)}>Delete</button>
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
      {program.map((week) => {
        return <div key={week.week}>Week {week.week}</div>;
      })}
      <h3>Training Block Creation</h3>
      <form action="" onSubmit={(e) => handleTrainingProgramSubmission(e)}>
        <div>
          <label htmlFor="block-duration-input">block duration: </label>
          <input
            id="block-duration-input"
            value={newTrainingBlock.trainingBlockWeeks}
            onChange={(e) => handleNewTrainingBlockInputs(e)}
            type="number"
            min={2}
            max={12}
          />
        </div>
        <div>
          <label htmlFor="weekly-frequency-input">weekly frequency: </label>
          <input
            id="weekly-frequency-input"
            value={newTrainingBlock.weeklyFrequency}
            onChange={(e) => handleNewTrainingBlockInputs(e)}
            type="number"
            min={2}
            max={7}
          />
        </div>
        <div>
          <label htmlFor="min-intensity-input">minimum intensity: </label>
          <input
            id="min-intensity-input"
            value={newTrainingBlock.minimumIntensity}
            onChange={(e) => handleNewTrainingBlockInputs(e)}
            type="number"
            min={30}
            max={100}
          />
        </div>
        <button type="submit">Create Training Block</button>
      </form>
    </>
  );
}

export default App;
