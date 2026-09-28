export function getJwtSecret(): string | undefined {
  const secret = process.env.JWT_SECRET?.trim();
  return secret && secret.length >= 32 ? secret : undefined;
}