import React, { useState } from "react";

// CONVERT ALL PROGRAM STORAGE

interface LiftInfo {
  id: number;
  name: string;
  sets: number;
  reps: number;
  weight: number;
}

interface TrainingBlockObj {
  trainingBlockWeeks: number;
  weeklyFrequency: number;
}

interface DayDetail {
  [key: string]: LiftDayDetails;
}

interface LiftDayDetails {
  lifts: Array<string>;
}

interface ProgramDetails {
  week: number;
  days: {
    [key: string]: LiftDayDetails;
  };
}

interface AdditionalInputs {
  [key: string]: {
    [key: string]: Array<string>;
  };
}

const mockLifts: LiftInfo[] = [
  {
    id: 1,
    name: "Back Squat",
    sets: 5,
    reps: 5,
    weight: 225,
  },
  {
    id: 2,
    name: "Back Squat",
    sets: 5,
    reps: 5,
    weight: 275,
  },
  {
    id: 3,
    name: "Back Squat",
    sets: 5,
    reps: 5,
    weight: 315,
  },
];

function App() {
  const [lifts, setLifts] = useState<LiftInfo[] | null>(mockLifts);
  const [newTrainingBlock, setNewTrainingBlock] = useState<TrainingBlockObj>({
    trainingBlockWeeks: 0,
    weeklyFrequency: 0,
  });
  const [program, setProgram] = useState<ProgramDetails[] | null>(null);
  const [newLift, setNewLift] = useState<string>("");
  const [selectedWeek, setSelectedWeek] = useState<ProgramDetails | null>(null);
  const [dayLiftsForWeeks, setDayLiftsForWeeks] = useState<
    Array<Array<Array<string>>>
  >([[[]]]);
  const [additionalLiftInputs, setAdditionalLiftInputs] =
    useState<AdditionalInputs | null>(null);

  const handleTrainingProgramSubmission = (
    e: React.SyntheticEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    const trainingBlockInfo = [];

    for (let i = 0; i < newTrainingBlock.trainingBlockWeeks; i++) {
      trainingBlockInfo.push({
        week: i + 1,
        weeklyFrequency: newTrainingBlock.weeklyFrequency,
      });
    }

    const newProgram: Array<ProgramDetails> =
      expandTrainingBlockWithDays(trainingBlockInfo);
    console.table(newProgram);
    setProgram([...newProgram]);
    setSelectedWeek(newProgram[0]);
    setStateForLiftsOfEachDay(newProgram);
    defaultAdditionalLiftInputs(newProgram);
  };

  const defaultAdditionalLiftInputs = (newProgram: Array<ProgramDetails>) => {
    let newAdditionalInputsObj: AdditionalInputs = {};
    for (const week of newProgram) {
      const weekKey = `week${week.week}`;

      for (const days of Object.keys(week.days)) {
        const dayKey = days;

        newAdditionalInputsObj = {
          ...newAdditionalInputsObj,
          [weekKey]: {
            ...newAdditionalInputsObj[weekKey],
            [dayKey]: [""],
          },
        };
      }
    }
    setAdditionalLiftInputs(newAdditionalInputsObj);
  };

  const expandTrainingBlockWithDays = (trainingBlockInfo: any) => {
    for (let i = 0; i < trainingBlockInfo.length; i++) {
      let workoutDaysObject: DayDetail = {};
      for (let j = 0; j < trainingBlockInfo[i].weeklyFrequency; j++) {
        workoutDaysObject = {
          ...workoutDaysObject,
          [`day${j + 1}`]: { lifts: [] },
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
        workoutDays.push([]);
      }
      dayLiftsForWeeksTemp.push(workoutDays);
    }
    console.log("IS THIS A TRIPLE NESTED ARRAY:?", dayLiftsForWeeksTemp);
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
      default:
        console.error(
          "something went wrong, the inputs should assigned to block duration, weekly frequency, or min intensity",
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
      sets: 0,
      reps: 0,
      weight: 0,
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
    dayIndex: number,
    liftIndex: number
  ) => {
    if (!e.currentTarget.value) return console.error("input is undefined");
    const newDayLiftsArray = [...dayLiftsForWeeks];
    newDayLiftsArray[weekIndex] = [...newDayLiftsArray[weekIndex]];
    newDayLiftsArray[weekIndex][dayIndex] = [
      ...newDayLiftsArray[weekIndex][dayIndex],
    ];

    newDayLiftsArray[weekIndex][dayIndex][liftIndex] = e.currentTarget.value;
    setDayLiftsForWeeks(newDayLiftsArray);
    console.log(
      "Lifts For Days (should be triple nested array): ",
      dayLiftsForWeeks
    );
    console.log("Program: ", program);
  };

  const handleAddLiftToDaySubmission = (
    e: React.SyntheticEvent<HTMLFormElement>,
    weekIndex: number
  ) => {
    e.preventDefault();
    if (!program) {
      return console.error("program is null");
    }

    const newProgramObject: Array<ProgramDetails> = [...program];

    for (let i = 0; i < dayLiftsForWeeks.length; i++) {
      newProgramObject[i] = { ...newProgramObject[i] };

      newProgramObject[i].days = { ...newProgramObject[i].days };

      for (let j = 0; j < dayLiftsForWeeks[i].length; j++) {
        if (dayLiftsForWeeks[i][j].length === 0) {
          continue;
        }
        const dayKey = `day${j + 1}`;
        const removedUndefinedValuesLifts = dayLiftsForWeeks[i][j].filter(
          (lift) => lift !== undefined,
        );
        newProgramObject[i].days[dayKey] = {
          ...newProgramObject[i].days[dayKey],
          lifts: [
            ...removedUndefinedValuesLifts,
            ...newProgramObject[i].days[dayKey].lifts,
          ],
        };
      }
    }
    console.log("Program with added lifts: ", newProgramObject);
    setProgram(newProgramObject);
    setSelectedWeek(newProgramObject[weekIndex]);
    setStateForLiftsOfEachDay(newProgramObject);
    defaultAdditionalLiftInputs(newProgramObject);
  };

  const addAdditionalInput = (week: number, dayKey: string) => {
    if (!additionalLiftInputs)
      return console.error("additionalLiftInputs is null");
    const weekKey = `week${week}`;
    const tempAdditionalInputObj = {
      ...additionalLiftInputs,
      [weekKey]: {
        ...additionalLiftInputs[weekKey],
        [dayKey]: [...additionalLiftInputs[weekKey][dayKey], ""],
      },
    };
    setAdditionalLiftInputs(tempAdditionalInputObj);
  };

  return (
    <>
      <h3>Training Block Creation</h3>
      {lifts && lifts.length > 0 ? (
        lifts.map((lift) => (
          <div key={lift.id}>
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
          {Object.keys(selectedWeek.days).map((day, index) => {
            return (
              <div key={day}>
                <span key={day}>{day} </span>
                {selectedWeek.days[day].lifts.map((lift, index) => (
                  <div key={index}>
                    <div>{lift}</div>
                  </div>
                ))}
                <form
                  id="add-lifts-form"
                  action=""
                  onSubmit={(e) =>
                    handleAddLiftToDaySubmission(e, selectedWeek.week - 1)
                  }
                >
                  {additionalLiftInputs &&
                    Object.keys(
                      additionalLiftInputs[`week${selectedWeek.week}`]
                    ).map((currDay) => {
                      return currDay === day
                        ? additionalLiftInputs[`week${selectedWeek.week}`][
                            currDay
                          ].map((_, liftIndex) => (
                            <div key={liftIndex}>
                              <label htmlFor="lift-day-input">Add Lift</label>
                              <input
                                id="lift-day-input"
                                type="text"
                                value={
                                  dayLiftsForWeeks[selectedWeek.week - 1]?.[
                                    index
                                  ]?.[liftIndex] ?? ""
                                }
                                onChange={(e) =>
                                  handleAddLiftToDay(
                                    e,
                                    selectedWeek.week - 1,
                                    index,
                                    liftIndex
                                  )
                                }
                              />
                            </div>
                          ))
                        : "";
                    })}

                  <button
                    type="button"
                    onClick={() => addAdditionalInput(selectedWeek.week, day)}
                  >
                    Another Lift
                  </button>
                </form>
              </div>
            );
          })}
          <button form="add-lifts-form" type="submit">
            Add Lifts
          </button>
        </div>
      )}
      <br />
      <button>Finalize</button>
    </>
  );
}

export default App;
