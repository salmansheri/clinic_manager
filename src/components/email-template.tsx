import { format } from "date-fns";
import * as React from "react";

interface EmailTemplateProps {
  firstName: string;
  lastName: string;
  date: string;
  title: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
  lastName,
  date,
  title,
}) => (
  <div>
    <h1>
      Dear {firstName} {lastName}
    </h1>
    <article>{title}</article>
    <p>Scheduled on {format(date, "dd/MM/yyyy")}</p>

    <p>Best Regards, </p>
    <p>Clinic Manager Team</p>
  </div>
);
