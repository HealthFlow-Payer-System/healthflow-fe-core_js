import { useRef, useEffect } from "react";
import { useAuthentication } from "../helpers/hooks";

const RefreshAuthToken = () => {
  const auth = useAuthentication();
  const intervalRef = useRef();

  useEffect(() => {
    if (auth.isAuthenticated) {
      intervalRef.current = setInterval(auth.refresh, 2 * 60 * 1000);
    }
    return () => {
      clearInterval(intervalRef.current); // Fix: Use clearInterval
    };
  }, [auth.isAuthenticated]);

  return null;
};
export default RefreshAuthToken;
