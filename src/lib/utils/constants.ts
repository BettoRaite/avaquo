export const FIREBASE_ERROR_MESSAGES: Record<string, string | undefined> = {
  "auth/email-already-in-use": "a user with that email already exists.",
  "auth/wrong-password": "wrong password.",
  "auth/user-not-found": "account does not exist.",
  "(auth/network-request-failed)":
    "It seems we're having trouble connecting to our servers. Please ensure you have a stable internet connection and try again.",
};

export const PASSWORD_MIN_LEN = 8;

export const ERROR_MESSAGES = {
  common: {
    unexpectedError: "An unexpected error has occured\n",
  },
};
