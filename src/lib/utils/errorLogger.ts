export const errorLogger = (
  description: string,
  error: Error,
  data: Record<string, unknown> = {}
) => {
  try {
    const errorMessage = `
Description: "${description}"
Scope data: 
${JSON.stringify(data, null, 2)}
Error: ${error}`;

    console.error(errorMessage);
  } catch (loggingError) {
    console.error("Unexpected error during error logging\n", loggingError);
  }
};
