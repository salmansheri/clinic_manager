import { EmailTemplate } from "@/components/email-template";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { resend } from "@/lib/resend";
import { generateUniqueToken } from "@/lib/utils";
import { zValidator } from "@hono/zod-validator";
import { format } from "date-fns";
import { Hono } from "hono";
import { string, z } from "zod";

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
  .get("/today", async (c) => {
    const session = await auth();

    const todayDate = format(new Date(), "dd-MM-yyyy");

    if (!session?.user?.email) {
      return c.json(
        {
          error: "Unauthorized",
        },
        401
      );
    }

    const doctor = await prisma.doctor.findUnique({
      where: { email: session?.user?.email },
    });

    if (!doctor?.email) {
      return c.json(
        {
          error: "Doctor not Found",
        },
        404
      );
    }

    const data = await prisma.appointment.findMany({
      where: {
        doctorId: doctor?.id,
      },
      include: {
        doctor: true,
        patient: true,
        token: true,
      },
    });

    if (!data) {
      console.log("Cannot find data");
      return c.json(
        {
          error: "Cannot find Appointments",
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
  })
  .get("/receptionist/approved/appointments", async (c) => {
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
      where: {
        status: "APPROVED",
      },
      include: {
        doctor: true,
        patient: true,
        token: true,
      },
    });

    if (!data) {
      console.log("Cannot find data");
      return c.json(
        {
          error: "Cannot find Appointments",
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
  )
  .post(
    "/patient/delete",

    zValidator(
      "json",
      z.object({
        ids: z.array(z.string()),
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

      const data = await prisma.appointment.deleteMany({
        where: {
          id: {
            in: values.ids,
          },
        },
      });

      if (!data) {
        return c.json(
          {
            error: "Cannot Delete",
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
  .post(
    "/doctor/approved/status/:id",
    zValidator(
      "param",
      z.object({
        id: z.string(),
      })
    ),

    async (c) => {
      const session = await auth();
      const params = c.req.valid("param");

      if (!session?.user?.email) {
        return c.json(
          {
            error: "Unauthorized",
          },
          404
        );
      }

      const doctor = await prisma.doctor.findUnique({
        where: {
          email: session?.user?.email,
        },
      });

      if (!doctor) {
        return c.json(
          {
            error: "Cannot find doctor",
          },
          400
        );
      }

      const appointment = await prisma.appointment.findUnique({
        where: {
          id: params.id,
        },
        include: {
          patient: true,
        },
      });
      if (!appointment) {
        return c.json(
          {
            error: "Cannot Find Appointment",
          },
          400
        );
      }

      const approveAppointment = await prisma.appointment.update({
        where: {
          id: params.id,
        },
        data: {
          status: "APPROVED",
        },
      });

      if (!approveAppointment) {
        return c.json(
          {
            error: "Cannot Update",
          },
          400
        );
      }

      const patientEmail = appointment.patient.email;
      try {
        const { data, error } = await resend.emails.send({
          from: "Clinic Manager <onboarding@resend.dev>",
          to: [patientEmail],
          subject: `Appointment Approved!`,
          react: EmailTemplate({
            firstName: appointment.patient.firstName,
            lastName: appointment.patient.lastName,
            date: appointment.dateTime,
            title: `Your Appointment With Dr. ${doctor.firstName} ${doctor.lastName} has been Approved!`,
          }),
        });

        if (error) {
          return c.json(
            {
              error: error.message,
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
      } catch (error: any) {
        console.log(error);
        return c.json({
          error: error.message,
        });
      }
    }
  )
  .post(
    "/receptionist/assignToken/:id",
    zValidator(
      "param",
      z.object({
        id: z.string(),
      })
    ),
    async (c) => {
      const session = await auth();
      const params = c.req.valid("param");

      if (!session?.user?.email) {
        return c.json(
          {
            error: "Unauthorized",
          },
          404
        );
      }

      const receptionist = await prisma.receptionist.findUnique({
        where: {
          email: session?.user?.email,
        },
      });

      if (!receptionist?.email) {
        return c.json(
          {
            error: "Not Allowed",
          },
          400
        );
      }

      const appointment = await prisma.appointment.findUnique({
        where: {
          id: params.id,
        },
        include: {
          patient: true,
        },
      });

      if (!appointment) {
        return c.json(
          {
            error: "Cannot find Appointment",
          },
          400
        );
      }

      const tokenNumber = await generateUniqueToken();

      const token = await prisma.token.create({
        data: {
          number: tokenNumber,
          status: "WAITING",
          appointmentId: appointment?.id!,
        },
      });

      if (!token.id) {
        return c.json(
          {
            error: "Cannot Assign Token",
          },
          400
        );
      }

      const { data, error } = await resend.emails.send({
        from: "Clinic Manager <onboarding@resend.dev>",
        to: [`${appointment?.patient?.email}`],
        subject: "Token Has been Assigned",
        react: EmailTemplate({
          firstName: appointment?.patient?.firstName,
          lastName: appointment?.patient?.lastName,
          title: `Your Token has been assigned and Your Token number is ${token.number}`,
          date: appointment?.dateTime,
        }),
      });

      if (error) {
        c.json(
          {
            error: error.message,
          },
          400
        );
      }

      return c.json({
        token,
        data,
      });
    }
  )
  .post(
    "/receptionist/call/:id",
    zValidator(
      "param",
      z.object({
        id: z.string(),
      })
    ),
    async (c) => {
      const session = await auth();
      const params = c.req.valid("param");

      if (!session?.user?.email) {
        return c.json(
          {
            error: "Unauthorized",
          },
          404
        );
      }

      const receptionist = await prisma.receptionist.findUnique({
        where: {
          email: session?.user?.email,
        },
      });

      if (!receptionist?.email) {
        return c.json(
          {
            error: "Not Allowed",
          },
          400
        );
      }

      const appointment = await prisma.appointment.findUnique({
        where: {
          id: params.id,
        },
        include: {
          patient: true,
        },
      });

      if (!appointment) {
        return c.json(
          {
            error: "Cannot find Appointment",
          },
          400
        );
      }

      const token = await prisma.token.update({
        where: {
          appointmentId: appointment.id!,
        },
        data: {
          status: "CALLED",
        },
      });

      if (!token.id) {
        return c.json(
          {
            error: "Cannot Assign Token",
          },
          400
        );
      }

      const { data, error } = await resend.emails.send({
        from: "Clinic Manager <onboarding@resend.dev>",
        to: [`${appointment?.patient?.email}`],
        subject: "You have been Called",
        react: EmailTemplate({
          firstName: appointment?.patient?.firstName,
          lastName: appointment?.patient?.lastName,
          title: `You have been Called Next`,
          date: appointment?.dateTime,
        }),
      });

      if (error) {
        c.json(
          {
            error: error.message,
          },
          400
        );
      }

      return c.json({
        token,
        data,
      });
    }
  )
  .post(
    "/doctor/appointment/cancel/:id",
    zValidator(
      "param",
      z.object({
        id: z.string(),
      })
    ),
    async (c) => {
      const session = await auth();
      const params = c.req.valid("param");

      if (!session?.user?.email) {
        return c.json(
          {
            error: "Unauthorized",
          },
          404
        );
      }

      const doctor = await prisma.doctor.findUnique({
        where: {
          email: session?.user?.email,
        },
      });

      if (!doctor?.email) {
        return c.json(
          {
            error: "Not Allowed",
          },
          400
        );
      }

      const appointment = await prisma.appointment.findUnique({
        where: {
          id: params.id,
        },
        include: {
          patient: true,
        },
      });

      if (!appointment) {
        return c.json(
          {
            error: "Cannot find Appointment",
          },
          400
        );
      }

      const updatedAppointment = await prisma.appointment.update({
        where: {
          id: appointment.id!,
        },
        data: {
          status: "CANCELLED",
        },
      });
      if (!appointment.id) {
        return c.json(
          {
            error: "Cannot Cancel appointment",
          },
          400
        );
      }

      const { data, error } = await resend.emails.send({
        from: "Clinic Manager <onboarding@resend.dev>",
        to: [`${appointment?.patient?.email}`],
        subject: "Appointment Cancelled!",
        react: EmailTemplate({
          firstName: appointment?.patient?.firstName,
          lastName: appointment?.patient?.lastName,
          title: `Your appointment has been cancelled`,
          date: appointment?.dateTime,
        }),
      });

      if (error) {
        c.json(
          {
            error: error.message,
          },
          400
        );
      }

      return c.json({
        updatedAppointment,
        data,
      });
    }
  );

export default app;
