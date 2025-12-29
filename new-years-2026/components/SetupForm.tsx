"use client";

import { useFormState, useFormStatus } from "react-dom";

type SetupState = { error?: string };

type SetupFormProps = {
  action: (prev: SetupState, formData: FormData) => Promise<SetupState>;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="text-2xl mt-6 px-4 py-2 underline"
    >
      {pending ? "Starting..." : "Begin Game"}
    </button>
  );
}

export default function SetupForm({ action }: SetupFormProps) {
  const [state, formAction] = useFormState(action, {});

  return (
    <form action={formAction} className="flex flex-col items-center">
      <input
        type="text"
        name="teamName"
        placeholder="Enter your team name"
        className="p-2 border border-gray-300 rounded w-64"
        autoComplete="organization"
        maxLength={64}
        required
      />
      <SubmitButton />
      {state?.error ? <p className="mt-4 text-accent">{state.error}</p> : null}
    </form>
  );
}
