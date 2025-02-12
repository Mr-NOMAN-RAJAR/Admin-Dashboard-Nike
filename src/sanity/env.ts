export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-02-05";

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  "Missing environment variable: NEXT_PUBLIC_SANITY_DATASET"
);

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  "Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID"
);
export const token = assertValue(
  "skJfM5uJYNPE8vTUcJ14w95EbwX3KCbkO310i49UuSg2meoOBxBXDKhlQDmoFghskNNCaAkagXlSi5LsueRG0EWK8tlHj7dVgcmc8A3fscwIqJ1Ig1vM7GkXRU9XKW9thRrTmJ9dEmAl3lQOx3Gp9xE3biJswLx9i8AAckuqkpSJZPeg5St4",
  "Missing environment variable: NEXT_API_token"
);

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage);
  }

  return v;
}
