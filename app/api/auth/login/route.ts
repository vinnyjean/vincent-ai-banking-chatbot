import { NextResponse } from "next/server";
import {
  createSessionToken,
  verifyPassword,
  UserRole,
} from "@/lib/auth";

const SESSION_COOKIE = "vincent_session";

function getConfiguredUser() {
  const username = process.env.VINCENT_ADMIN_USERNAME;
  const passwordHash = process.env.VINCENT_V4_PASSWORD_HASH;

  if (!username || !passwordHash) {
    throw new Error("Vincent authentication credentials are not configured");
  }

  return {
    username,
    passwordHash,
    role: "admin" as UserRole,
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const username =
      typeof body?.username === "string"
        ? body.username.trim()
        : "";

    const password =
      typeof body?.password === "string"
        ? body.password
        : "";

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required." },
        { status: 400 }
      );
    }

    const configuredUser = getConfiguredUser();

    const usernameMatches =
      username.toLowerCase() === configuredUser.username.toLowerCase();

 const passwordMatches = usernameMatches
  ? verifyPassword(password, configuredUser.passwordHash)
  : false;

if (!usernameMatches) {
  return NextResponse.json(
    { error: "USERNAME_MISMATCH" },
    { status: 401 }
  );
}

if (!passwordMatches) {
  return NextResponse.json(
    {
      error: "PASSWORD_MISMATCH",
      hashFormat: configuredUser.passwordHash.startsWith("scrypt:"),
      hashParts: configuredUser.passwordHash.split(":").length,
      hashLength: configuredUser.passwordHash.length,
    },
    { status: 401 }
  );
}

    const token = createSessionToken(
      configuredUser.username,
      configuredUser.role
    );

    const response = NextResponse.json({
      success: true,
      role: configuredUser.role,
    });

    response.cookies.set({
      name: SESSION_COOKIE,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return response;
  } catch (error) {
    console.error("Vincent login error:", error);

    return NextResponse.json(
      { error: "Unable to process login." },
      { status: 500 }
    );
  }
}
