import { API } from "./api";

export const addItem = async (newItem) => {
  return await API("/items", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newItem),
  });
};
