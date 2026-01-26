import axios from "axios";
import type { ProgramDetails } from "../types/types";

const fetchProgram = async (programId: number) => {
  const response = await axios.get(
    `http://localhost:3000/program/${programId}`,
  );
  return response.data;
};

const createProgramScaffolding = async (
  programScaffoldData: any,
): Promise<ProgramDetails[]> => {
  const response = await axios.post<ProgramDetails[]>(
    "http://localhost:3000/program",
    programScaffoldData,
  );
  return response.data;
};

export default { fetchProgram, createProgramScaffolding };
