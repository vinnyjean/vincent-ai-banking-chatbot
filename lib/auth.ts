import crypto from "crypto";

export type UserRole =
  | "admin"
  | "manager"
  | "analyst"
  | "customer-service"
  | "risk-fraud"
  | "user";

type SessionPayload = {
  username: string;
  role: UserRole;
  exp: number;
};

function getAuthSecret(): string {
  const secret = process.env.VINCENT_AUTH_SECRET;

  if (!secret) {
    throw new Error("VINCENT_AUTH_SECRET is not configured");
  }

  return secret;
}

function base64url(input: string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function sign(value: string): string {
  return base64url(
    crypto
      .createHmac("sha256", getAuthSecret())
      .update(value)
      .digest("base64")
  );
}

export function createSessionToken(
  username: string,
  role: UserRole = "user",
  expiresInSeconds = 60 * 60 * 8
): string {
  const payload: SessionPayload = {
    username,
    role,
    exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
  };

  const encodedPayload = base64url(JSON.stringify(payload));
  const signature = sign(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

export function verifySessionToken(
  token: string | undefined
): SessionPayload | null {
  if (!token) return null;

  const parts = token.split(".");

  if (parts.length !== 2) return null;

  const [encodedPayload, providedSignature] = parts;
  const expectedSignature = sign(encodedPayload);

  const provided = Buffer.from(providedSignature);
  const expected = Buffer.from(expectedSignature);

  if (provided.length !== expected.length) return null;

  if (!crypto.timingSafeEqual(provided, expected)) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8")
    ) as SessionPayload;

    if (!payload.username || !payload.role || !payload.exp) {
      return null;
    }

    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function hashPassword(password: string, salt?: string): string {
  const actualSalt = salt ?? crypto.randomBytes(16).toString("hex");

  const derivedKey = crypto.scryptSync(password, actualSalt, 64);

  return `scrypt:${actualSalt}:${derivedKey.toString("hex")}`;
}

export function verifyPassword(
  password: string,
  storedHash: string
): boolean {
  try {
    const [algorithm, salt, hash] = storedHash.split(":");

    if (algorithm !== "scrypt" || !salt || !hash) {
      return false;
    }

    const derivedKey = crypto.scryptSync(password, salt, 64);
    const storedKey = Buffer.from(hash, "hex");

    if (derivedKey.length !== storedKey.length) {
      return false;
    }

    return crypto.timingSafeEqual(derivedKey, storedKey);
  } catch {
    return false;
  }
}

export function hasRole(
  role: UserRole,
  allowedRoles: UserRole[]
): boolean {
  return allowedRoles.includes(role);
}
