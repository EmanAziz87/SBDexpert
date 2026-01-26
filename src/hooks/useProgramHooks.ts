import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import programService from "../services/programService";
import type { ProgramDetails, ProgramScaffold } from "../types/types";

export function useProgram() {
  return useQuery({
    queryKey: ["program"],
    queryFn: programService.fetchProgram,
  });
}

export function useCreateProgramScaffold() {
  const queryClient = useQueryClient();
  return useMutation<ProgramDetails[], Error, ProgramScaffold>({
    mutationFn: (programScaffoldData: ProgramScaffold) =>
      programService.createProgramScaffolding(programScaffoldData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["program"] });
    },
  });
}
