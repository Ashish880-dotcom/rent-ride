import { describe, it, expect, beforeEach } from "@jest/globals";
import { AuthService } from "./authService";
import { prisma } from "@/core/lib/prisma";
import { Role } from "@/generated/prisma";

describe("AuthService", () => {
  describe("register", () => {
    it("should successfully register a user with valid data", async () => {
      const testEmail = `test-${Date.now()}@example.com`;

      const result = await AuthService.register({
        email: testEmail,
        password: "Password123",
        role: Role.USER,
      });

      expect(result).toHaveProperty("id");
      expect(result.email).toBe(testEmail);
      expect(result.role).toBe(Role.USER);
      expect(result).not.toHaveProperty("passwordHash");

      // Cleanup
      await prisma.user.delete({ where: { id: result.id } });
    });

    it("should reject invalid email format", async () => {
      await expect(
        AuthService.register({
          email: "invalid-email",
          password: "Password123",
          role: Role.USER,
        }),
      ).rejects.toThrow("Invalid email format");
    });

    it("should reject weak password (too short)", async () => {
      await expect(
        AuthService.register({
          email: "test@example.com",
          password: "Pass1",
          role: Role.USER,
        }),
      ).rejects.toThrow("Password must be at least 8 characters long");
    });

    it("should reject password without letters", async () => {
      await expect(
        AuthService.register({
          email: "test@example.com",
          password: "12345678",
          role: Role.USER,
        }),
      ).rejects.toThrow("Password must contain at least one letter");
    });

    it("should reject password without numbers", async () => {
      await expect(
        AuthService.register({
          email: "test@example.com",
          password: "Password",
          role: Role.USER,
        }),
      ).rejects.toThrow("Password must contain at least one number");
    });

    it("should reject duplicate email", async () => {
      const testEmail = `duplicate-${Date.now()}@example.com`;

      // Create first user
      const firstUser = await AuthService.register({
        email: testEmail,
        password: "Password123",
        role: Role.USER,
      });

      // Try to create duplicate
      await expect(
        AuthService.register({
          email: testEmail,
          password: "Password456",
          role: Role.OWNER,
        }),
      ).rejects.toThrow("Email already registered");

      // Cleanup
      await prisma.user.delete({ where: { id: firstUser.id } });
    });

    it("should hash password before storing", async () => {
      const testEmail = `hash-test-${Date.now()}@example.com`;
      const password = "Password123";

      const result = await AuthService.register({
        email: testEmail,
        password,
        role: Role.USER,
      });

      // Fetch user from database to check password hash
      const user = await prisma.user.findUnique({
        where: { id: result.id },
      });

      expect(user?.passwordHash).toBeDefined();
      expect(user?.passwordHash).not.toBe(password);
      expect(user?.passwordHash.length).toBeGreaterThan(20);

      // Cleanup
      await prisma.user.delete({ where: { id: result.id } });
    });
  });

  describe("hashPassword", () => {
    it("should generate different hashes for same password", async () => {
      const password = "TestPassword123";

      const hash1 = await AuthService.hashPassword(password);
      const hash2 = await AuthService.hashPassword(password);

      expect(hash1).not.toBe(hash2);
      expect(hash1.length).toBeGreaterThan(20);
      expect(hash2.length).toBeGreaterThan(20);
    });
  });
});
