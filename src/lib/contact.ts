export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactResult {
  /** False until a real endpoint exists. The UI tells the visitor nothing was delivered. */
  delivered: boolean;
}

/**
 * No contact endpoint exists on the backend yet, so nothing is sent.
 * To connect one, replace the body with a request, for example
 * `await api.post("/contact", message)`, and return `{ delivered: true }`.
 */
export async function sendContactMessage(message: ContactMessage): Promise<ContactResult> {
  void message;
  await new Promise((resolve) => setTimeout(resolve, 600));
  return { delivered: false };
}