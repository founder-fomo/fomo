import nodemailer, { Transporter } from "nodemailer";

let transporterPromise: Promise<Transporter> | null = null;

async function createTransporter(): Promise<Transporter> {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && port && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass }
    });
  }

  // Fallback: use Ethereal for dev/testing
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: { user: testAccount.user, pass: testAccount.pass }
  });
}

async function getTransporter(): Promise<Transporter> {
  if (!transporterPromise) transporterPromise = createTransporter();
  return transporterPromise;
}

export interface SendResult {
  messageId: string;
  previewUrl?: string;
}

export async function sendVerificationCodeEmail(toEmail: string, code: string): Promise<SendResult> {
  const transporter = await getTransporter();
  const from = process.env.EMAIL_FROM || "FOMO <no-reply@fomo.dev>";

  const info = await transporter.sendMail({
    from,
    to: toEmail,
    subject: "Your FOMO verification code",
    text: `Your verification code is ${code}. It expires in 5 minutes.`,
    html: `<p>Your verification code is <b>${code}</b>.</p><p>It expires in 5 minutes.</p>`
  });

  const previewUrl = nodemailer.getTestMessageUrl(info) || undefined;
  return { messageId: info.messageId, previewUrl };
}


