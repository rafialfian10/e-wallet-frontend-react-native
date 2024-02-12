import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";

import { UserContext } from "../../../Context/UserContext";
import { API } from "../../../Config/Api";

export const GetUsers = () => {
  const [state, dispatch] = useContext(UserContext);

  const { data: users, isLoading: isLoadingUsers, refetch: refetchUsers } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await API.get(`/users`);
      return data.data;
    }
  });

  return { users, isLoadingUsers, refetchUsers };
};

