import { useEffect } from "react";
import { createPortal } from "react-dom";

type ModalPortalProps = {
  children: React.ReactNode;
  mountDomId: string;
};

export const ModalPortal = ({ children, mountDomId }: ModalPortalProps) => {
  const el = document.createElement("div");
  el.id = mountDomId;
  document.body.appendChild(el);

  useEffect(() => {
    return () => {
      document.body.removeChild(el);
    };
  }, [el]);

  return createPortal(children, el);
};
