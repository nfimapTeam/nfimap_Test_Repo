import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../axiosInstance";

export const getConcertList = async () => {
  const response = await axiosInstance.get("/api/v1/concerts");
  return response.data;
};

export const useConcertList = () => {
  return useQuery({
    queryKey: ["ConcertList"],
    queryFn: () => getConcertList(),
  });
};
