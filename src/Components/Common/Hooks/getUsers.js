import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";

import { UserContext } from "../../../Context/UserContext";
import { API } from "../../../Config/Api";

export const GetUsers = () => {
  const [state, dispatch] = useContext(UserContext);

  const config = {
    headers: {
      "Content-type": "multipart/form-data",
      Authorization: "Bearer " + state?.user?.token,
    },
  };

  const { data: users, isLoading: isLoadingUsers, refetch: refetchUsers } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await API.get(`/users`, config);
      return data.data;
    }
  });

  return { users, isLoadingUsers, refetchUsers };
};

