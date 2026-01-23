import React, { useState } from "react";

// CONVERT ALL PROGRAM STORAGE

interface LiftInfo {
  id: number;
  name: string;
  sets: number;
  reps: number;
  weight: number;
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

function App() {
  const [program, setProgram] = useState<ProgramDetails[] | null>(null);
  const [newProgramWeeks, setNewProgramWeeks] = useState<number>(0);
  const [newProgramWeeklyFrequency, setNewProgramWeeklyFrequency] =
    useState<number>(0);
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

    for (let i = 0; i < newProgramWeeks; i++) {
      trainingBlockInfo[i] = {
        week: i + 1,
        weeklyFrequency: newProgramWeeklyFrequency,
      };
    }
    // expand training block with days in the backend.
    const newProgram: Array<ProgramDetails> =
      createWorkoutProgramScaffolding(trainingBlockInfo);
    console.table(newProgram);
    // set the program in the backend and send it back. make sure the backend call is async/await, we want
    // this line to freeze and load the backend before proceeding.
    setProgram([...newProgram]);
    setSelectedWeek(newProgram[0]);
    setStateForLiftsOfEachDay(newProgram);
    dynamicFormInputStateScaffolding(newProgram);
  };

  // Progam Purpose: week count
  const dynamicFormInputStateScaffolding = (
    newProgram: Array<ProgramDetails>,
  ) => {
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

  // this is putting together our program. This should be the backends job.
  const createWorkoutProgramScaffolding = (trainingBlockInfo: any) => {
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
    setDayLiftsForWeeks(dayLiftsForWeeksTemp);
  };

  const handleNewTrainingBlockInputs = (
    e: React.SyntheticEvent<HTMLInputElement>,
  ) => {
    const inputToNumber = Number(e.currentTarget.value);
    switch (e.currentTarget.id) {
      case "block-duration-input":
        setNewProgramWeeks(inputToNumber);
        break;
      case "weekly-frequency-input":
        setNewProgramWeeklyFrequency(inputToNumber);
        break;
      default:
        console.error(
          "something went wrong, the inputs should assigned to block duration, weekly frequency, or min intensity",
        );
    }
  };

  const handleShowWeek = (week: ProgramDetails) => {
    const foundWeek = program?.find((wk) => wk.week === week.week);
    if (foundWeek) {
      setSelectedWeek(foundWeek);
    } else {
      console.error("Week not found!");
    }
  };

  const addLiftInfoToDay = (
    e: React.SyntheticEvent<HTMLInputElement>,
    weekIndex: number,
    dayIndex: number,
    liftIndex: number,
  ) => {
    const newDayLiftsArray = [...dayLiftsForWeeks];
    newDayLiftsArray[weekIndex] = [...newDayLiftsArray[weekIndex]];
    newDayLiftsArray[weekIndex][dayIndex] = [
      ...newDayLiftsArray[weekIndex][dayIndex],
    ];

    newDayLiftsArray[weekIndex][dayIndex][liftIndex] = e.currentTarget.value;
    setDayLiftsForWeeks(newDayLiftsArray);
    console.log("Program: ", program);
  };

  const handleCheckInfoTypeToAdd = (
    e: React.SyntheticEvent<HTMLInputElement>,
    weekIndex: number,
    dayIndex: number,
    liftIndex: number,
  ) => {
    if (!e.currentTarget.value) return console.error("input is undefined");
    if (e.currentTarget.id === "lift-input") {
      addLiftInfoToDay(e, weekIndex, dayIndex, liftIndex);
    } else if (e.currentTarget.id === "sets-input") {
    } else if (e.currentTarget.id === "reps-input") {
    } else if (e.currentTarget.id === "weight-input") {
    }
  };

  const handleAddLiftToDaySubmission = (
    e: React.SyntheticEvent<HTMLFormElement>,
    weekIndex: number,
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
    dynamicFormInputStateScaffolding(newProgramObject);
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
      <form action="" onSubmit={(e) => handleTrainingProgramSubmission(e)}>
        <div>
          <label htmlFor="block-duration-input">block duration: </label>
          <input
            id="block-duration-input"
            value={newProgramWeeks}
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
            value={newProgramWeeklyFrequency}
            onChange={(e) => handleNewTrainingBlockInputs(e)}
            type="number"
            min={2}
            max={7}
          />
        </div>

        <button type="submit">Create Training Block</button>
      </form>
      {program &&
        program.map((week) => {
          return (
            <div key={week.week}>
              {" "}
              <button onClick={(_e) => handleShowWeek(week)}>
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
                      additionalLiftInputs[`week${selectedWeek.week}`],
                    ).map((currDay) => {
                      return currDay === day
                        ? additionalLiftInputs[`week${selectedWeek.week}`][
                            currDay
                          ].map((_, liftIndex) => (
                            <div key={liftIndex}>
                              <div>
                                <label htmlFor="lift-input">Add Lift</label>
                                <input
                                  id="lift-input"
                                  type="text"
                                  value={
                                    dayLiftsForWeeks[selectedWeek.week - 1]?.[
                                      index
                                    ]?.[liftIndex] ?? ""
                                  }
                                  onChange={(e) =>
                                    handleCheckInfoTypeToAdd(
                                      e,
                                      selectedWeek.week - 1,
                                      index,
                                      liftIndex,
                                    )
                                  }
                                />
                              </div>
                              <div>
                                <label htmlFor="sets-input">Sets</label>
                                <input id="sets-input" type="number" />
                              </div>
                              <div>
                                <label htmlFor="reps-input">Reps</label>
                                <input id="reps-input" type="number" />
                              </div>
                              <div>
                                <label htmlFor="weight-input">Weight</label>
                                <input id="weight-input" type="number" />
                              </div>
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
