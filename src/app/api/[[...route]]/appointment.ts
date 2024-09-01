import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

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

    const data = await prisma.appointment.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!data) {
      return c.json(
        {
          error: "Not Found",
        },
        400
      );
    }

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
        doctorId: z.string(),
        notes: z.string(),
        date: z.string(),
      })
    ),
    async (c) => {
      const session = await auth();

      const values = c.req.valid("json");

      if (!session?.user?.email) {
        return c.json(
          {
            error: "Unauthorized",
          },
          401
        );
      }

      console.log(session?.user?.email);

      const findPatient = await prisma.patient.findUnique({
        where: {
          email: session?.user?.email,
        },
      });

      console.log(findPatient);

      if (!findPatient?.email) {
        return c.json(
          {
            error: "Cannot find Patient",
          },
          400
        );
      }

      const data = await prisma.appointment.create({
        data: {
          doctorId: values.doctorId,
          dateTime: values.date,
          patientId: findPatient?.id as string,
          notes: values.notes,
        },
      });

      return c.json(
        {
          data,
        },
        201
      );
    }
  );

export default app;
