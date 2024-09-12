import prisma from "@/lib/prisma";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import argon2 from "argon2";

const app = new Hono()
  .get("/", async (c) => {
    try {
      const data = await prisma.receptionist.findMany();

      if (data.length === 0) {
        return c.json(
          {
            error: "Not Found",
          },
          404
        );
      }
      return c.json(
        {
          data,
        },
        200
      );
    } catch (error: any) {
      console.log(error.message);
      return c.json({ error: error.message }, 500);
    }
  })
  .post(
    "/",
    zValidator(
      "json",
      z.object({
        firstName: z.string().min(2, {
          message: "First name must contain minimum of 2 characters",
        }),
        lastName: z.string(),

        contactNumber: z.string(),
        email: z.string().email(),
        password: z.string(),
      })
    ),
    async (c) => {
      const values = c.req.valid("json");

      const hashedPassword = await argon2.hash(values.password);
      try {
        const data = await prisma.receptionist.create({
          data: {
            ...values,
            password: hashedPassword,
          },
        });

        if (!data) {
          return c.json(
            {
              error: "Not found",
            },
            404
          );
        }

        return c.json(
          {
            data,
          },
          201
        );
      } catch (error: any) {
        console.log(error.message);
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
