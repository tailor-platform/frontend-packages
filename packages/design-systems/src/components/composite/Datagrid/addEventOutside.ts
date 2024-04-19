import { RefObject } from "react";

type Event = MouseEvent | TouchEvent;
export const addEventOutside = <
  T extends HTMLElement = HTMLElement,
  U extends HTMLElement = HTMLElement,
>(
  ref: RefObject<T>,
  handler: (event: Event) => void,
  exceptionRef?: RefObject<U>,
  isContainArkUiSelect?: boolean,
) => {
  const listener = (event: Event) => {
    const el = ref?.current;
    const exceptionEL = exceptionRef?.current;
    if (
      exceptionEL === event.target ||
      exceptionEL?.contains(event?.target as Node)
    ) {
      return;
    }
    // This conditional branch is a countermeasure when using ark-ui's select component.
    if (isContainArkUiSelect) {
      let isInside = false;
      const selectList = document.querySelectorAll(
        "[data-scope='select'][role='option'],[data-scope='select'][role='listbox']",
      );
      selectList.forEach((select) => {
        if (select?.contains(event?.target as Node)) {
          isInside = true;
        }
      });
      if (isInside) {
        return;
      }
    }
    if (!el || el.contains(event?.target as Node)) {
      return;
    }
    handler(event);
    document.removeEventListener(`mousedown`, listener);
    document.removeEventListener(`touchstart`, listener);
  };
  document.addEventListener(`mousedown`, listener);
  document.addEventListener(`touchstart`, listener);
};
