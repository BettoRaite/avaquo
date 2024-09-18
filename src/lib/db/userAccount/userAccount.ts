import { sendPasswordResetEmail } from "firebase/auth";
import { forgotPasswordSchema } from "../../schemas/schemas";
import { auth } from "../firebase";
import { FirebaseError } from "firebase/app";
import { FirebaseErrorObject } from "../../utils/definitions";

export async function handleSendingPasswordResetEmail(
  params: ReturnType<typeof forgotPasswordSchema.parse>
): Promise<FirebaseErrorObject | void> {
  try {
    const { email } = forgotPasswordSchema.parse(params);
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    if (error instanceof FirebaseError) {
      console.error("Failed to send password reset email", error);
      return {
        message: error.message,
        code: error.code,
      };
    }
    throw error;
  }
}
