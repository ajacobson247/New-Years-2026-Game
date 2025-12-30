"use client";

import React, { useActionState, useState } from "react";

type ActionState = { error?: string };

function SubmitButton({ pending }: { pending: boolean }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-3 rounded border border-black/10 bg-white/60 px-4 py-2 font-semibold dark:border-white/10 dark:bg-white/5"
    >
      {pending ? "Checking..." : "Submit"}
    </button>
  );
}

type ClueInputFieldProps = {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
};

export default function ClueInputField({ action }: ClueInputFieldProps) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    action,
    {} satisfies ActionState
  );
  const [value, setValue] = useState("");

  return (
    <form action={formAction} className="mt-6 flex w-full flex-col items-center">
      <input
        type="text"
        name="answer"
        placeholder="Enter your answer here"
        className="w-full max-w-md rounded border border-black/10 bg-white/70 p-3 text-foreground outline-none dark:border-white/10 dark:bg-white/5"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <SubmitButton pending={pending} />
      {state?.error ? <p className="mt-3 text-accent">{state.error}</p> : null}
    </form>
  );
}