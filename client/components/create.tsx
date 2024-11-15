import { FC, useRef, useState } from "react";

export const Create: FC = () => {
  const parentIdInput = useRef<HTMLInputElement>(null);
  const descriptionInput = useRef<HTMLTextAreaElement>(null);
  const linkInput = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsSubmitting(true);
    setError(null);

    const form = event.currentTarget;
    const parentIdValue = parentIdInput.current?.value;
    const data = {
      parentId: parentIdValue === "" ? undefined : parentIdValue,
      description: descriptionInput.current?.value,
      link: linkInput.current?.value,
    };

    try {
      const response = await fetch(`/api/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        switch (response.status) {
          case 400:
            throw new Error("You must provide a description and a link.");
          case 409:
            throw new Error("The parent issue does not exist.");
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
      <h2>Create a new issue</h2>
      <form onSubmit={onSubmit}>
        <label>
          Parent issue ID:{" "}
          <input
            type="number"
            inputMode="numeric"
            pattern="[0-9]+"
            ref={parentIdInput}
          />
        </label>
        <br />
        <label>
          Description: <textarea required ref={descriptionInput} />
        </label>
        <br />
        <label>
          Link: <input type="url" required ref={linkInput} />
        </label>
        <br />
        <input
          type="submit"
          value="Create new bug report"
          disabled={isSubmitting}
        />
        {error && <p>{error}</p>}
      </form>
    </>
  );
};
