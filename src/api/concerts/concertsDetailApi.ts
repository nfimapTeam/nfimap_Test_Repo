import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../axiosInstance";

export const getConcertDetail = async (id: string, lang: string) => {
  const response = await axiosInstance.get(`/api/v1/concerts/${id}`, {
    params: { lang }, // Pass the lang as a query parameter
  });
  return response.data;
};

export const useConcertDetail = (id: string, lang: string) => {
  return useQuery({
    queryKey: ["ConcertDetail", id],
    queryFn: () => getConcertDetail(id, lang),
  });
};
