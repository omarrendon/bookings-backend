import React from "react";
import { render } from "@react-email/render";
// Provider
import { EmailProviderFactory } from "../providers/EmailProviderFactory";
// Templates
import * as bookingRegisterTemplate from "../templates/BookingRegisterTemplate";
import * as bookingConfirmationTemplate from "../templates/BookingConfirmationTemplate";
import * as bookingCancelationTemplate from "../templates/BookingCancelationTemplate";
import * as bookingRescheduleTemplate from "../templates/BookingRescheduleTemplate";
import * as newReservationTemplate from "../templates/NewReservationTemplate";
import * as validateBusinessCountTemplate from "../templates/ValidateBusinessCountTemplate";
import * as passwordResetTemplate from "../templates/PasswordResetTemplate";
import * as confirmPasswordHasBeenUpdated from "../templates/ConfirmPasswordHasBeenUpdated";
import * as businessCreatedTemplate from "../templates/BusinessCreatedTemplate";
import * as clientCancelledReservationTemplate from "../templates/ClientCancelledReservationTemplate";

import { BusinessContactInfo } from "../templates/components/BusinessContact";

interface IReservationEmailFields {
  to: string;
  toBusiness: string;
  name: string;
  businessName: string;
  reservationId: string | number;
  startTime: string;
  endTime: string;
  products: object[];
  businessContact?: BusinessContactInfo;
}

interface IReservationStatusEmailFields {
  to: string;
  name: string;
  businessName: string;
  startTime: string;
  endTime: string;
  status: string;
  products: object[];
  businessContact?: BusinessContactInfo;
}

interface IClientCancelledEmailFields {
  to: string;
  name: string;
  businessName: string;
  startTime: string;
  endTime?: string;
  products?: object[];
  customerEmail?: string;
  reservationId?: string | number;
}

interface EmailTemplate<T extends object> {
  default: React.ComponentType<T>;
  subject: (data: T) => string;
}

export class EmailService {
  private provider;

  constructor() {
    this.provider = EmailProviderFactory.create();
  }

  private async dispatch<T extends object>(
    recipient: string,
    template: EmailTemplate<T>,
    data: T,
  ): Promise<void> {
    const element = React.createElement(template.default, data);
    const html = await render(element);
    const subjectLine = template.subject(data);
    await this.provider.sendEmail(recipient, subjectLine, html);
  }

  public async sendEmailToRegisterReservation(fields: IReservationEmailFields) {
    const { to, toBusiness: _toBusiness, ...body } = fields;
    await this.dispatch(to, bookingRegisterTemplate, body);
  }

  public async sendEmailToConfirmReservation(fields: IReservationStatusEmailFields) {
    const { to, ...body } = fields;
    await this.dispatch(to, bookingConfirmationTemplate, body);
  }

  public async sendEmailToCancelReservation(fields: IReservationStatusEmailFields) {
    const { to, ...body } = fields;
    await this.dispatch(to, bookingCancelationTemplate, body);
  }

  public async sendEmailToRescheduleReservation(fields: IReservationStatusEmailFields) {
    const { to, ...body } = fields;
    await this.dispatch(to, bookingRescheduleTemplate, body);
  }

  public async sendEmailToNewReservation(fields: IReservationEmailFields) {
    const { toBusiness, to: customerEmail, ...body } = fields;
    await this.dispatch(toBusiness, newReservationTemplate, { ...body, customerEmail });
  }

  public async sendEmailToValidateBusiness(to: string, userId: string) {
    await this.dispatch(to, validateBusinessCountTemplate, { userId });
  }

  public async sendEmailToResetPassword(to: string, resetLinkToken: string) {
    await this.dispatch(to, passwordResetTemplate, { resetLink: resetLinkToken });
  }

  public async sendEmailToConfirmPasswordUpdate(to: string) {
    await this.dispatch(to, confirmPasswordHasBeenUpdated, {} as never);
  }

  public async sendEmailToClientCancellation(fields: IClientCancelledEmailFields) {
    const { to, ...body } = fields;
    await this.dispatch(to, clientCancelledReservationTemplate, body);
  }

  public async sendBussinesCreated(to: string, businessName: string) {
    await this.dispatch(to, businessCreatedTemplate, { businessName });
  }
}
