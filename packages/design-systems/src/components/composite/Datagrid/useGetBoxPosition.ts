import { CSSProperties } from "react";

export const useGetBoxPosition = (
  buttonRef: React.RefObject<HTMLDivElement | HTMLButtonElement>,
) => {
  const getBoxPosition = (): CSSProperties => {
    const box = buttonRef.current?.getBoundingClientRect();
    if (!box) {
      return {};
    }

    return {
      zIndex: 1500, // ark-ui modal has z-index of 1400. So, we need to set it higher than that.
      position: "absolute",
      top: Math.ceil(box.bottom - box.top),
    };
  };
  return getBoxPosition;
};
