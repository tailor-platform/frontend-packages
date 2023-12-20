import {
  createContext,
  Dispatch,
  useContext,
  useEffect,
  useState,
} from "react";
import { User } from "./types";

export const userInfoDefault: User = {
  id: "",
} as User;
const USER_KEY = "user";
const TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refreshToken";

export type UserAction = {
  type: "init" | "update" | "delete";
  payload?: User;
  token?: string;
  refreshToken?: string;
};

export const Context = createContext<{
  user: User;
  dispatchUser: Dispatch<UserAction>;
}>({
  user: userInfoDefault,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  dispatchUser: () => {},
});

export const getAuthToken = () => localStorage.getItem(TOKEN_KEY);
export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

export const loadUser = (): User | undefined => {
  const data = localStorage.getItem(USER_KEY);
  return data != null ? (JSON.parse(data) as User) : undefined;
};

export const userReducer = (state: User, action: UserAction) => {
  switch (action?.type) {
    case "init": {
      if (!action.payload) {
        return state;
      }
      return action.payload;
    }
    case "update": {
      if (!action.payload) {
        return state;
      }
      const userInfo = action.payload;
      const newState = {
        ...state,
        ...userInfo,
      };
      localStorage.setItem(USER_KEY, JSON.stringify(newState));
      if (action?.token) {
        localStorage.setItem(TOKEN_KEY, action?.token ?? "");
      }
      if (action?.refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, action?.refreshToken);
      }
      return newState;
    }
    case "delete": {
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      return userInfoDefault;
    }
  }
};

export const useUser = (): {
  loading: boolean;
  user: User;
  dispatchUser: Dispatch<UserAction>;
} => {
  const { user, dispatchUser } = useContext(Context);
  const [loading, setLoading] = useState(user.id == "");
  useEffect(() => {
    if (loading) {
      setLoading(false);
      const loaded = loadUser();
      if (loaded && loaded.id != "") {
        dispatchUser({
          type: "init",
          payload: loaded,
        });
      }
    }
  }, [user, dispatchUser, loading]);
  return {
    loading,
    user,
    dispatchUser,
  };
};
