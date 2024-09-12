import { Hono } from "hono";
import { handle } from "hono/vercel";
import Doctor from "./doctor";
import Patient from "./patient";
import Receptionist from "./receptionist";
import Appointment from "./appointment";
import { HTTPException } from "hono/http-exception";

const app = new Hono().basePath("/api");

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }

  console.log(err.message);

  return c.json({ error: err.message }, 500);
});

const routes = app
  .route("/doctor", Doctor)
  .route("/patient", Patient)
  .route("/receptionist", Receptionist)
  .route("/appointment", Appointment);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
