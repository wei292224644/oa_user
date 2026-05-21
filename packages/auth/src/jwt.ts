import { SignJWT, jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET ?? "default-secret-change-me",
);

export interface JWTPayload {
  sub: string;
  phone: string;
  role: string;
  name: string | null;
}

export async function createToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(SECRET);
}

export async function verifyToken(
  token: string,
): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET, {
      clockTolerance: 60,
    });
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}
