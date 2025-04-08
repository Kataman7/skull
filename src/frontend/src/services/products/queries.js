import { API } from "./api";

export const getItems = async () => {
  return await API("/items");
};
