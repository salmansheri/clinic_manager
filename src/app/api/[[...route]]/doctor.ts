import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import prisma from "@/lib/prisma";
import argon2 from "argon2";
import { auth } from "@/lib/auth";

const app = new Hono()
  .get("/", async (c) => {
    const session = await auth();

    if (!session?.user?.email) {
      return c.json(
        {
          error: "Unauthorized",
        },
        401
      );
    }
    const data = await prisma.doctor.findMany();

    return c.json({
      data,
    });
  })
  .post(
    "/",
    zValidator(
      "json",
      z.object({
        firstName: z.string(),

        lastName: z.string(),
        spacialization: z.string(),
        contactNumber: z.string(),
        email: z.string().email(),
        password: z.string(),
      })
    ),
    async (c) => {
      const values = c.req.valid("json");
      const hashedPassword = await argon2.hash(values.password);

      try {
        const data = await prisma.doctor.create({
          data: {
            firstName: values.firstName,
            lastName: values.lastName,
            contactNumber: values.contactNumber,
            email: values.email,
            password: String(hashedPassword),
            specialization: values.spacialization,
          },
        });

        return c.json(
          {
            data: data,
          },
          201
        );
      } catch (error: any) {
        console.log(error);
        return c.json({ message: error.message }, 500);
      }
    }
  );

export default app;
