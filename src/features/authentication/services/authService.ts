import prisma from "@/core/lib/prisma";
import bcrypt from "bcryptjs";
import { Role } from "@/generated/prisma";

interface RegisterData {
  email: string;
  password: string;
  role: Role;
}

interface RegisterResult {
  id: string;
  email: string;
  role: Role;
  createdAt: Date;
}

export class AuthService {
  /**
   * Validates email format
   */
  private static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validates password strength
   * Requirements: At least 8 characters, contains letter and number
   */
  private static validatePassword(password: string): {
    valid: boolean;
    message?: string;
  } {
    if (password.length < 8) {
      return {
        valid: false,
        message: "Password must be at least 8 characters long",
      };
    }

    if (!/[a-zA-Z]/.test(password)) {
      return {
        valid: false,
        message: "Password must contain at least one letter",
      };
    }

    if (!/\d/.test(password)) {
      return {
        valid: false,
        message: "Password must contain at least one number",
      };
    }

    return { valid: true };
  }

  /**
   * Hashes a password using bcrypt
   */
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Registers a new user with email, password, and role
   * @throws Error if validation fails or email already exists
   */
  static async register(data: RegisterData): Promise<RegisterResult> {
    const { email, password, role } = data;

    // Validate email format
    if (!this.validateEmail(email)) {
      throw new Error("Invalid email format");
    }

    // Validate password strength
    const passwordValidation = this.validatePassword(password);
    if (!passwordValidation.valid) {
      throw new Error(passwordValidation.message);
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error("Email already registered");
    }

    // Hash password
    const passwordHash = await this.hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role,
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return user;
  }
}
