import React, { useEffect } from "react";
import { useIsClient } from "usehooks-ts";
import { Around } from "@theme-toggles/react";
import "@theme-toggles/react/css/Around.css";

import { css, cx } from "@tailor-platform/styled-system/css";
import { button } from "@tailor-platform/styled-system/recipes";
import { useColorMode } from "./useColorMode";

export const ColorModeButton = () => {
  const { toggle, colorMode } = useColorMode();
  const isClient = useIsClient();

  const updateBackgroundColor = (mode) => {
    const docsStoryElement = document.querySelector(
      ".docs-story",
    ) as HTMLElement;

    if (!docsStoryElement) {
      return;
    }

    mode === "dark"
      ? docsStoryElement.style.setProperty(
          "background-color",
          "#0a0a0a",
          "important",
        )
      : docsStoryElement.style.removeProperty("background-color");
  };

  useEffect(() => {
    updateBackgroundColor(colorMode);
  }, [colorMode]);

  if (!isClient) {
    return null;
  }

  return (
    <Around
      onToggle={toggle}
      toggled={colorMode === "light"}
      className={cx(
        button({ variant: "tertiary", size: "lg" }),
        css({
          fontSize: "2xl",
          px: "0",
        }),
      )}
      data-scope="button"
      data-part="root"
    />
  );
};
