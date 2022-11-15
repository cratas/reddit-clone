import { usePostQuery } from "../generated/graphql";
import { UseGetIntId } from "./useGetIntId";

export const UseGetPostFromUrl = () => {
  const intId = UseGetIntId();
  
  return usePostQuery({
    pause: intId === -1,
    variables: {
      id: intId,
    },
  });
};
