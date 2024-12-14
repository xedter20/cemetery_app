import { useEffect, useState } from "react";
import { getUser } from "../utility";

export const useUser = () => {
  const [user, setUser] = useState("");

  useEffect(() => {
    setUser(getUser() || 'Mickey Mouse');
  }, []);

  return { user };
};
