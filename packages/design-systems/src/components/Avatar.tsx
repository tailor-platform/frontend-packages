import {
  AvatarRoot as ArkAvatar,
  AvatarFallback,
  AvatarImage,
  AvatarRootProps as AvatarArkProps,
} from "@ark-ui/react";
import {
  avatar,
  AvatarVariantProps,
} from "@tailor-platform/styled-system/recipes";

type AvatarDsProps = {
  fallback?: string;
  src?: string;
  alt: string;
};

export type AvatarProps = AvatarArkProps & AvatarVariantProps & AvatarDsProps;

export const Avatar = (props: AvatarProps) => {
  const { size, fallback, src, alt, ...rest } = props;
  return (
    <ArkAvatar className={avatar({ size })} {...rest}>
      <AvatarFallback>{fallback}</AvatarFallback>
      <AvatarImage src={src} alt={alt} />
    </ArkAvatar>
  );
};

Avatar.displayName = "Avatar";
