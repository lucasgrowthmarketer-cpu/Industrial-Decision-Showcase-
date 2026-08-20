// Formulaire de contact : Google SMTP via lucas@industrialdecision.com.
// Variables Railway requises : SMTP_USER, SMTP_PASS (mot de passe d'application
// Google, 2FA obligatoire, genere sur LE compte lucas@ : lecon HealthUnion 535).
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  let body: { nom?: string; societe?: string; email?: string; message?: string; site?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false }, { status: 400 }); }

  // honeypot : le champ "site" est invisible, un bot le remplit
  if (body.site) return NextResponse.json({ ok: true });

  const { nom, societe, email, message } = body;
  if (!nom || !email || !message || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) {
    console.error("SMTP_USER / SMTP_PASS non configures");
    return NextResponse.json({ ok: false, error: "config" }, { status: 500 });
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", port: 465, secure: true, auth: { user, pass },
  });

  try {
    await transporter.sendMail({
      from: `"Industrial Digital Experience" <${user}>`,
      to: user,
      replyTo: email,
      subject: `[Showcase] Demande de démo · ${nom}${societe ? " · " + societe : ""}`,
      text: `Nom : ${nom}\nSociété : ${societe ?? "-"}\nEmail : ${email}\n\n${message}`,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Envoi SMTP echoue:", e);
    return NextResponse.json({ ok: false, error: "send" }, { status: 502 });
  }
}
