import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import API from "@/api";

interface User {
  id?: string | number;
  first_name: string;
  last_name: string;
  email?: string;
  image?: string;
  active_test_count: number;
  reserved_test_count: number;
  available_test_count: number;
  tests?: any[];
}

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const getProfile = async () => {
    try {
      const response = await API.Auth.profile();
      if (response.status === 200) {
        setUser(response.data);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(null);
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        logout,
        refreshUser: getProfile,
        loading
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
