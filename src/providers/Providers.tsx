"use client";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import { AppInitializer } from "./AppInitializer";
import { ModalProvider } from "@/context/ModalContext";
import ModalContainer from "@/container/ModalContainer/ModalContainer";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AppInitializer>
        <ModalProvider>
          {children}
          <ModalContainer />
        </ModalProvider>
      </AppInitializer>
    </Provider>
  );
}
