import nodemailer from 'nodemailer'

export async function enviarEmailSenha(to: string, subject: string, html: string) {
  const transporter = nodemailer.createTransport({
    service: 'Outlook',
    auth: {
      user: 'seu-email@fatec.sp.gov.br',
      pass: 'sua-senha-ou-app-password',
    },
  })

  await transporter.sendMail({
    from: 'CroMo <seu-email@fatec.sp.gov.br>',
    to,
    subject,
    html,
  })
}
