import prisma from "@/lib/prisma";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import argon2 from "argon2";

const app = new Hono()
  .get("/", async (c) => {
    const data = await prisma.doctor.findMany();

    return c.json(
      {
        data,
      },
      200
    );
  })
  .post(
    "/",
    zValidator(
      "json",
      z.object({
        firstName: z.string(),

        lastName: z.string(),
        dateOfBirth: z.string(),
        gender: z.string(),
        medicalHistory: z.string(),
        contactNumber: z.string(),
        address: z.string(),
        email: z.string().email(),
        password: z.string(),
      })
    ),
    async (c) => {
      const values = c.req.valid("json");
      const hashedPassword = await argon2.hash(values.password);

      try {
        const data = await prisma.patient.create({
          data: {
            ...values,
            password: hashedPassword,
          },
        });

        return c.json(
          {
            data,
          },
          201
        );
      } catch (error: any) {
        console.log(`Patient Create error ${error.message}`);
        return c.json(
          {
            error: error.message,
          },
          500
        );
      }
    }
  );

export default app;
