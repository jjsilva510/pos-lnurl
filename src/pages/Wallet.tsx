import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { localStorageKeys } from "../constants";

export function Wallet() {
  const navigate = useNavigate();

  React.useEffect(() => {
    (async () => {
      const lightningAddress = window.localStorage.getItem(localStorageKeys.lightningAddress);
      if (lightningAddress) {
        console.log("Lightning address set");
      } else {
        navigate("/");
      }
    })();
  }, [navigate]);

  return (
    <div className="flex flex-col w-full h-full p-2">
      <Outlet />
    </div>
  );
}
