declare module "toastify-react-native" {
  import React from "react";
  const ToastManager: React.ComponentType<Record<string, unknown>>;
  export const Toast: {
    success(msg: string): void;
    error(msg: string): void;
    info(msg: string): void;
    warn(msg: string): void;
  };
  export default ToastManager;
}
