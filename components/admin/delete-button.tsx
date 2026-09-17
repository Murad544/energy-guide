"use client";

export function DeleteButton({
  action,
}: {
  action: (formData: FormData) => void | Promise<void>;
}) {
  return (
    <button
      className="text-sm font-semibold text-red-600 hover:underline"
      formAction={action}
      onClick={(event) => {
        if (!window.confirm("Bu qeydi silmək istədiyinizə əminsiniz?"))
          event.preventDefault();
      }}
      type="submit"
    >
      Sil
    </button>
  );
}
