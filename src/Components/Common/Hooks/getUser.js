import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";

import { UserContext } from "../../../Context/UserContext";
import { API } from "../../../Config/Api";

export const GetUser = () => {
  const [state, dispatch] = useContext(UserContext);

  const { data: user, isLoading: isLoadingUser, refetch: refetchUser } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data } = await API.get(`/user/${state?.user?.id}`);
      return data.data;
    }
  });

  return { user, isLoadingUser, refetchUser };
};

