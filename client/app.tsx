import { FC } from "react";
import { Create } from "./components/create";
import { Close } from "./components/close";

export const App: FC = () => {
  return (
    <>
      <h1>Bug Tracker</h1>
      <Create />
      <Close />
    </>
  );
};
