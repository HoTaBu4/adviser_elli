import { User } from "../../assets/types/user";
import { LoginResponse, RegisterUser } from "../../store/types/UserType";
import { client } from "../fetchClient";

export const loginUser = (data: Omit<User, "username">): Promise<LoginResponse | { detail: string }> => {
  return client.post("/user/token/", data) as Promise<LoginResponse | { detail: string }>;
}

export const registerUser = (data: User) => {
  return client.post<RegisterUser>("/auth/user/", data);
};

export const logOutUser = () => {
  return client.get("/user/logout");
};

export const userLogout = () => {
  return client.get("/user/logout");
};
export const authWithGoogle = () => {
  return client.get("/auth/google/");
};
