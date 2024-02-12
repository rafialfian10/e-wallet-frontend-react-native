import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";

import { UserContext } from "../../../Context/UserContext";
import { API } from "../../../Config/Api";

export const GetTransactionsUser = () => {
  const [state, dispatch] = useContext(UserContext);

  const { data: transactionsUser, isLoading: isLoadingTransactionUser, refetch: refetchTransactionsUser } = useQuery({
    queryKey: ['transactions-user'],
    queryFn: async () => {
      const { data } = await API.get(`/transactions-by-user`);
      return data.data;
    }
  });

  return { transactionsUser, isLoadingTransactionUser, refetchTransactionsUser };
};

