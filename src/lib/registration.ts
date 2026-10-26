export type Registration = {
  firstName: string;
  lastName: string;
  email: string;
  school: string;
  grade: string;
  role: string;
  teamName?: string;
  dietary?: string;
  tshirtSize: string;
  emergencyName: string;
  emergencyPhone: string;
  codeOfConduct: boolean;
  photoRelease: boolean;
};

/**
 * Integration seam: this is the only place that talks to a back end.
 *
 * The live site writes each registration to Firebase Realtime Database:
 *
 *   import { ref, push } from "firebase/database";
 *   await push(ref(db, "registrations"), { ...data, timestamp: Date.now(), status: "pending" });
 *
 * Wire that in here (and `npm i firebase`), or set VITE_REGISTRATION_ENDPOINT
 * to a URL that accepts the same JSON via POST.
 *
 * In development the submission is simulated so the form can be tested.
 * In a production build with nothing configured it throws, so the visitor sees
 * the failure message instead of a false "You're Registered!".
 */
export async function submitRegistration(data: Registration): Promise<void> {
  const endpoint = import.meta.env.VITE_REGISTRATION_ENDPOINT as string | undefined;

  if (endpoint) {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, timestamp: Date.now(), status: "pending" }),
    });
    if (!res.ok) throw new Error(`Registration endpoint responded ${res.status}`);
    return;
  }

  if (import.meta.env.DEV) {
    console.info("[dev] registration not sent:", data);
    await new Promise((r) => setTimeout(r, 600));
    return;
  }

  throw new Error("Registration back end is not configured (see src/lib/registration.ts).");
}
