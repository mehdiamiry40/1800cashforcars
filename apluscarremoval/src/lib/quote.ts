/**
 * The quote form ("Sell Your Car Today"), ported from Contact Form 7 form #33.
 * Field names, rules and response wording match what the WordPress form sent, so the
 * markup in the page content and any Tag Manager triggers built on it keep working.
 */
export const FORM_ID = 33;

export const MESSAGES = {
  sent: "Thank you for your message. It has been sent.",
  failed: "There was an error trying to send your message. Please try again later.",
  invalid: "One or more fields have an error. Please check and try again.",
  required: "Please fill out this field.",
  email: "Please enter an email address.",
  tooLong: "This field has a too long input.",
  rateLimited: "Too many requests. Please call us on 0423 514 111 instead.",
} as const;

export const FIELDS = [
  { name: "Name", label: "Name", max: 400 },
  { name: "your-email", label: "Email", max: 400, email: true },
  { name: "phone", label: "Phone", max: 400 },
  { name: "suburb", label: "Suburb", max: 400 },
  { name: "make-model", label: "Make & Model", max: 400 },
  { name: "price", label: "Expected Price", max: 400 },
  { name: "description", label: "Car Details", max: 2000 },
] as const;

export type FieldName = (typeof FIELDS)[number]["name"];
export type Quote = Record<FieldName, string>;
export type InvalidField = { field: FieldName; message: string };

export type FormResponse = {
  status: "mail_sent" | "validation_failed" | "mail_failed" | "spam";
  message: string;
  invalid_fields?: InvalidField[];
};

// Same shape Contact Form 7 accepts: something@domain.tld, no spaces.
const EMAIL = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

export function validateQuote(input: Record<string, unknown>): { quote: Quote; invalid: InvalidField[] } {
  const quote = {} as Quote;
  const invalid: InvalidField[] = [];
  for (const field of FIELDS) {
    const raw = input[field.name];
    const value = typeof raw === "string" ? raw.trim() : "";
    quote[field.name] = value;
    if (!value) invalid.push({ field: field.name, message: MESSAGES.required });
    else if (value.length > field.max) invalid.push({ field: field.name, message: MESSAGES.tooLong });
    else if ("email" in field && !EMAIL.test(value)) invalid.push({ field: field.name, message: MESSAGES.email });
  }
  return { quote, invalid };
}

export function leadSubject(quote: Quote): string {
  return `New quote request: ${quote["make-model"]} (${quote.suburb})`;
}

export function leadText(quote: Quote, page: string): string {
  return [...FIELDS.map((field) => `${field.label}: ${quote[field.name]}`), "", `Sent from: ${page}`].join("\n");
}
