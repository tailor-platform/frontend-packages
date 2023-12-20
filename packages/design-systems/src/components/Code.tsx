import { useRef, useState } from "react";
import {
  type HTMLStyledProps,
  styled,
} from "@tailor-platform/styled-system/jsx";
import {
  code,
  type CodeVariantProps,
} from "@tailor-platform/styled-system/recipes";
import { Button } from "./Button";

type BaseProps = HTMLStyledProps<"code">;

interface BlockCodeProps extends BaseProps, CodeVariantProps {
  variant?: "block";
  disableCopy?: boolean;
}

interface InlineCodeProps extends BaseProps, CodeVariantProps {
  variant: "inline";
  disableCopy?: never;
}

export type CodeProps = BlockCodeProps | InlineCodeProps;

export const Code = ({
  disableCopy = false,
  variant = "block",
  children,
  ...rest
}: CodeProps) => {
  const classes = code({ variant });
  const codeRef = useRef<HTMLPreElement>(null);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyClick = async () => {
    if (!codeRef.current) {
      return;
    }

    await navigator.clipboard.writeText(codeRef.current.textContent || "");
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1000);
  };

  return (
    <div className={classes.root}>
      {variant === "block" && !disableCopy && (
        <div className={classes.copy}>
          <Button variant="secondary" size="xs" onClick={handleCopyClick}>
            {isCopied ? "Copied!" : "Copy"}
          </Button>
        </div>
      )}
      <styled.code className={classes.code} ref={codeRef} {...rest}>
        {children}
      </styled.code>
    </div>
  );
};

Code.displayName = "Code";
