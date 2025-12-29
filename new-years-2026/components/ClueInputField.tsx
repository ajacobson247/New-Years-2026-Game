'use client';
import React, { useState } from "react";

export default function ClueInputField({ onSubmit }: { onSubmit: (value: string) => void }) {
  const [value, setValue] = useState("");

  const checkSubmission = (e: React.FormEvent) => {
    e.preventDefault();

    if (!value.trim()) return;
    
    onSubmit(value);
  }

  return (
    <input
      type="text"
      placeholder="Enter your answer here"
      className="w-full max-w-md p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          checkSubmission(e);
        }
      }}
    />
  );
}