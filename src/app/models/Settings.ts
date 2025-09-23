import { Document, Schema, model } from "mongoose";

export interface ISMSTemplate extends Document {
  title: string;
  body?: string;
  isActive?: boolean;
}

export interface IInvoiceSettings extends Document {
  invoiceNumber: string;
}

export interface ISiteSettings extends Document {
  siteName: string;
  logo?: string;
  mobile?: string;
  email?: string;
  address?: string;
}

const smsTemplateSchema = new Schema<ISMSTemplate>(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

const invoiceSettingsSchema = new Schema<IInvoiceSettings>(
  {
    invoiceNumber: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const siteSettingsSchema = new Schema<ISiteSettings>(
  {
    siteName: { type: String, required: true },
    logo: { type: String },
    mobile: { type: String },
    email: { type: String },
    address: { type: String },
  },
  {
    timestamps: true,
  }
);

export const SMSTemplate = model<ISMSTemplate>("SMSTemplate", smsTemplateSchema);
export const InvoiceSettings = model<IInvoiceSettings>("InvoiceSettings", invoiceSettingsSchema);
export const SiteSettings = model<ISiteSettings>("SiteSettings", siteSettingsSchema);
