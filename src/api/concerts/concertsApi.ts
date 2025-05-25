import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../axiosInstance";

export const getConcertList = async (lang: string = "ko") => {
  const response = await axiosInstance.get("/api/v1/concerts", {
    params: { lang }, // Pass the lang as a query parameter
  });
  return response.data;
};

export const useConcertList = (lang: string = "ko") => {
  return useQuery({
    queryKey: ["ConcertList"],
    queryFn: () => getConcertList(lang),
    enabled: false,
  });
};
