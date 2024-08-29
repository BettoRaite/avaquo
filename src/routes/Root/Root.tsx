import { Outlet } from "react-router-dom";
import { BottomMenu } from "../../components/BottomMenu/BottomMenu";

export function Root() {
  return (
    <>
      <Outlet />
      <BottomMenu />
    </>
  );
}
