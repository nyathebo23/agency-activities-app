import type { User } from "../../types/models/user";

export type AuthContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction< User | null>>;
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  isAuthenticated: boolean;
  logout: () => void;
};