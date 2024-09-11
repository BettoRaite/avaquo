import type { AuthProviders } from "../../lib/utils/types";
import { capitalizeFirstLetter } from "../../lib/utils/strings";
import { AiFillGoogleCircle } from "react-icons/ai";
import styles from "./authWithProviderButton.module.css";

const providerIconMapping: Record<AuthProviders, JSX.Element> = {
  google: <AiFillGoogleCircle className={styles.icon} />,
};

type AuthWithProviderButtonProps = {
  provider: AuthProviders;
  text?: string;
  onClick: () => undefined | Promise<void>;
};

export function AuthWithProviderButton({
  provider,
  onClick,
  text = "Continue with",
}: AuthWithProviderButtonProps) {
  return (
    <button className={styles.button} type="button" onClick={onClick}>
      {text} {capitalizeFirstLetter(provider)} {providerIconMapping[provider]}
    </button>
  );
}
