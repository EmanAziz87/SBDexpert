import React, { useState } from "react";

interface LiftInfo {
  id: number;
  name: string;
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
    [key: string]: LiftDayDetails;
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
  },
  {
    id: 2,
    name: "Bench Press",
  },
  {
    id: 3,
    name: "Deadlift",
  },
  {
    id: 4,
    name: "Overhead Press",
  },
  {
    id: 5,
    name: "Barbell Row",
  },
  {
    id: 6,
    name: "Incline Dumbbell Press",
  },
];

function App() {
  const [lifts, setLifts] = useState<LiftInfo[] | null>(mockLifts);
  const [selectedLift, setSelectedLift] = useState<LiftInfo | null>(null);
  // const [newGoal, setNewGoal] = useState<number>(
  //   selectedLift.personalRecord.weightInPounds
  // );
  const [newTrainingBlock, setNewTrainingBlock] = useState<TrainingBlockObj>({
    trainingBlockWeeks: 0,
    weeklyFrequency: 0,
    minimumIntensity: 0,
  });
  const [program, setProgram] = useState<ProgramDetails[] | null>(null);
  const [newLift, setNewLift] = useState<string>("");
  const [selectedWeek, setSelectedWeek] = useState<ProgramDetails | null>(null);
  const [dayLiftsForWeeks, setDayLiftsForWeeks] = useState<
    Array<Array<string>>
  >([]);

  // const handleGoalChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
  //   setNewGoal(Number(e.currentTarget.value));
  // };

  // const handleSelectedLift = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   const foundLift = lifts.find((lift) => lift.name === e.currentTarget.value);
  //   if (foundLift) {
  //     setSelectedLift(foundLift);
  //     setNewGoal(foundLift.personalRecord.weightInPounds);
  //   }
  // };

  // const handleNewGoalSubmission = (
  //   e: React.SyntheticEvent<HTMLFormElement>
  // ) => {
  //   e.preventDefault();
  //   const newLiftObject: LiftInfo = {
  //     ...selectedLift,
  //     personalRecord: { ...selectedLift.personalRecord, currentGoal: newGoal },
  //   };
  //   setLifts([
  //     ...lifts.filter((lift) => lift.name !== newLiftObject.name),
  //     newLiftObject,
  //   ]);
  // };

  const handleTrainingProgramSubmission = (
    e: React.SyntheticEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const trainingBlockInfo = trainingBlockPercentages(
      newTrainingBlock.trainingBlockWeeks,
      newTrainingBlock.weeklyFrequency,
      newTrainingBlock.minimumIntensity
    );

    const newProgram: Array<ProgramDetails> =
      expandTrainingBlockWithDays(trainingBlockInfo);
    console.table(newProgram);
    setProgram([...newProgram]);
    setSelectedWeek(newProgram[0]);
    setStateForLiftsOfEachDay(newProgram);
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

  const setStateForLiftsOfEachDay = (program: Array<ProgramDetails>) => {
    const dayLiftsForWeeksTemp = [];
    for (const week of program) {
      const workoutDays = [];
      for (const _days of Object.keys(week.days)) {
        workoutDays.push("");
      }
      dayLiftsForWeeksTemp.push(workoutDays);
    }

    setDayLiftsForWeeks(dayLiftsForWeeksTemp);
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
    if (lifts) {
      setLifts([...lifts.filter((lift) => lift.id !== currentLift.id)]);
    }
  };

  const handleAddLift = (e: React.SyntheticEvent<HTMLInputElement>) => {
    setNewLift(e.currentTarget.value);
  };

  const handleAddLiftSubmission = (
    e: React.SyntheticEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const duplicateFound = lifts?.find((lift) => lift.name === newLift);

    if (duplicateFound) {
      window.alert("That lift already exists");
      return;
    }
    const newLiftObject = {
      id: lifts ? lifts.length + 1 : 1,
      name: newLift,
      personalRecord: { weightInPounds: 0, reps: 0, currentGoal: 0 },
    };
    const newLiftsArray = lifts ? [...lifts, newLiftObject] : [newLiftObject];
    setLifts(newLiftsArray);
    setNewLift("");
  };

  const handleShowWeek = (week: ProgramDetails) => {
    const foundWeek = program?.find((wk) => wk.week === week.week);
    if (foundWeek) {
      setSelectedWeek(foundWeek);
    } else {
      console.error("Week not found!");
    }
  };

  const handleAddLiftToDay = (
    e: React.SyntheticEvent<HTMLInputElement>,
    weekIndex: number,
    dayIndex: number
  ) => {
    const newDayLiftsArray = [...dayLiftsForWeeks];
    newDayLiftsArray[weekIndex] = [...newDayLiftsArray[weekIndex]];
    newDayLiftsArray[weekIndex][dayIndex] = e.currentTarget.value;
    setDayLiftsForWeeks(newDayLiftsArray);
    console.log("Lifts For Days: ", dayLiftsForWeeks);
  };

  return (
    <>
      {/* <form action="" onSubmit={handleNewGoalSubmission}>
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
      </form> */}

      <h3>Training Block Creation</h3>
      {lifts && lifts.length > 0 ? (
        lifts.map((lift) => (
          <div key={lift.name}>
            <span>{lift.name}</span>
            <button onClick={(e) => handleDeleteLift(lift)}>Delete</button>
            <br />
          </div>
        ))
      ) : (
        <div>Add lifts to your program here</div>
      )}
      <form onSubmit={(e) => handleAddLiftSubmission(e)}>
        <div>
          <label htmlFor="new-lift-text-input">Add A Lift: </label>
          <input
            id="new-lift-text-input"
            value={newLift}
            onChange={(e) => {
              handleAddLift(e);
            }}
            type="text"
          />
        </div>
        <button type="submit">Add</button>
      </form>
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
        {lifts && lifts.length > 2 ? (
          <button type="submit">Create Training Block</button>
        ) : (
          <div>Your program must contain atleast 3 exercises to submit</div>
        )}
      </form>
      {program &&
        program.map((week) => {
          return (
            <div key={week.week}>
              {" "}
              <button onClick={(e) => handleShowWeek(week)}>
                {" "}
                Week {week.week}
              </button>
            </div>
          );
        })}
      <br />
      {selectedWeek && (
        <div>
          <div>Week {selectedWeek.week}</div>
          <div>Intensity of 1RM: {selectedWeek.intensityPercent}%</div>
          <div>Weekly Frequency: {selectedWeek.weeklyFrequency}</div>
          <div>Sets Per Session{selectedWeek.setsPerSession}</div>
          <div>Reps Per Set: {selectedWeek.repsPerSet}</div>
          <div>Total Sets For Week: {selectedWeek.totalWeeklySetsPerLift}</div>
          {Object.keys(selectedWeek.days).map((day, index) => {
            return (
              <div>
                <span key={day}>{day} </span>
                {selectedWeek.days[day].lifts.map((lift, index) => (
                  <div>
                    <div>{lift}</div>
                  </div>
                ))}
                <form action="">
                  <div>
                    <label htmlFor="lift-day-input">Add Lift</label>
                    <input
                      id="lift-day-input"
                      type="text"
                      value={dayLiftsForWeeks[selectedWeek.week - 1][index]}
                      onChange={(e) =>
                        handleAddLiftToDay(e, selectedWeek.week - 1, index)
                      }
                    />
                  </div>
                </form>
              </div>
            );
          })}
        </div>
      )}
      <br />
      <button>Finalize</button>
    </>
  );
}

export default App;
