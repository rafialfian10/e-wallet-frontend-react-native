import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";

import { UserContext } from "../../../Context/UserContext";
import { API } from "../../../Config/Api";

export const GetTransactionsUser = (page) => {
  const [state, dispatch] = useContext(UserContext);

  const config = {
    headers: {
      "Content-type": "multipart/form-data",
      Authorization: "Bearer " + state?.user?.token,
    },
  };

  const { data: transactionsUser, isLoading: isLoadingTransactionUser, refetch: refetchTransactionsUser } = useQuery({
    queryKey: ['transactions-by-user', page],
    queryFn: async () => {
      const { data } = await API.get(`/transactions-by-user?page=${page}`, config);
      return data.data;
    }
  });

  return { transactionsUser, isLoadingTransactionUser, refetchTransactionsUser };
};

