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
  .get(
    "/patient/:id",
    zValidator(
      "param",
      z.object({
        id: z.string(),
      })
    ),
    async (c) => {
      const { id } = c.req.valid("param");
      const session = await auth();

      if (!session?.user?.email) {
        return c.json(
          {
            error: "Unauthorized",
          },
          401
        );
      }

      const data = await prisma.appointment.findUnique({
        where: {
          id: id,
        },
        include: {
          doctor: true,
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
    }
  )
  .get("/patient", async (c) => {
    const session = await auth();

    if (!session?.user?.email) {
      return c.json(
        {
          error: "Unauthorized",
        },
        401
      );
    }

    const patient = await prisma.patient.findUnique({
      where: {
        email: session?.user?.email,
      },
    });

    if (!patient) {
      return c.json(
        {
          error: "Cannot Find Patient",
        },
        400
      );
    }

    const data = await prisma.appointment.findMany({
      where: {
        patientId: patient.id,
      },
      include: {
        doctor: true,
      },
    });

    if (!data) {
      return c.json(
        {
          error: "Cannot Find Appointments",
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

      const findPatient = await prisma.patient.findUnique({
        where: {
          email: session?.user?.email,
        },
      });

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
  )
  .patch(
    "/patient/update/:id",
    zValidator(
      "param",
      z.object({
        id: z.string(),
      })
    ),
    zValidator(
      "json",
      z.object({
        doctorId: z.string(),
        notes: z.string(),
        date: z.string(),
      })
    ),
    async (c) => {
      const param = c.req.valid("param");
      const values = c.req.valid("json");
      const session = await auth();

      const patient = await prisma.patient.findUnique({
        where: {
          email: session?.user?.email as string,
        },
      });

      if (!patient?.email) {
        return c.json(
          {
            error: "Cannot Find Patient",
          },
          404
        );
      }

      const data = await prisma.appointment.update({
        where: {
          id: param.id,
        },
        data: {
          notes: values.notes,
          dateTime: values.date,
        },
      });

      if (!data) {
        return c.json(
          {
            error: "Cannot Update",
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
    }
  );

export default app;
