import useAuthStore from "@store/auth-store";
import { validateAndDecodeToken } from "@utils/token/validate-and-decode-token.utils";
import { useEffect, type FC, type ReactNode } from "react";

type AppLoaderProps = {
  children: ReactNode;
};

const AppLoader: FC<AppLoaderProps> = ({ children }) => {
  const accessToken = localStorage.getItem("token");

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    const decodedToken = validateAndDecodeToken(accessToken);

    if (!decodedToken) {
      return;
    }

    useAuthStore.setState({ isAuth: true, authUser: decodedToken });
  }, [accessToken]);

  return children;
};

export default AppLoader;
