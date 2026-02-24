import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { AuthService } from "@/features/authentication/services/authService";
import { RegisterSchema } from "@/core/utils/validation";

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate request body using centralized schema
    const validationResult = RegisterSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.issues.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 },
      );
    }

    const { email, password, role } = validationResult.data;

    // Extra security: Prevent ADMIN role registration
    if (role === "ADMIN") {
      return NextResponse.json(
        {
          error: "Cannot register as administrator through public registration",
        },
        { status: 403 },
      );
    }

    // Register user
    const user = await AuthService.register({ email, password, role });

    // Return user data (excluding password hash)
    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
        message: "User registered successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    // Handle duplicate email error
    if (error instanceof Error) {
      if (error.message === "Email already registered") {
        return NextResponse.json(
          { error: "Email already registered" },
          { status: 409 },
        );
      }

      // Handle other validation errors
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Handle unexpected errors
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
