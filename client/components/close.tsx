import { FC, useRef, useState } from "react";

export const Close: FC = () => {
  const idInput = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsSubmitting(true);
    setError(null);

    const form = event.currentTarget;
    const data = {
      id: idInput.current?.value,
    };

    try {
      const response = await fetch(`/api/close`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        switch (response.status) {
          case 400:
            throw new Error("You must provide an issue ID.");
          case 410:
            throw new Error("The issue does not exist.");
          default:
            throw new Error("An unknown error occurred. Try again.");
        }
      }

      // Only reset form on successful submission.
      form.reset();
    } catch (error) {
      setError(
        typeof error === "object" && error !== null && "message" in error
          ? String(error.message)
          : "An unknown error occurred. Try again.",
      );
    }

    setIsSubmitting(false);
  };

  return (
    <>
      <h2>Close issue</h2>
      <form onSubmit={onSubmit}>
        <label>
          Issue ID:{" "}
          <input
            type="number"
            inputMode="numeric"
            pattern="[0-9]+"
            ref={idInput}
          />
        </label>
        <br />
        <input type="submit" value="Close bug report" disabled={isSubmitting} />
        {error && <p>{error}</p>}
      </form>
    </>
  );
};
