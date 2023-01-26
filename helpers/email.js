import nodemailer from 'nodemailer'

const createNodemailerTransport = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  })
}

export const emailRegistro = async ({ nombre, email, token }) => {
  const transport = createNodemailerTransport()
  const mailOptions = {
    from: '"Uptask: Administrador de Proyectos" <cuentas@uptask.com>',
    to: email,
    subject: 'Uptask: Comprueba tu cuenta',
    html: `<p>Hola: ${nombre}, comprueba tu cuenta en UpTask</p>
    <p>Tu cuenta ya esta casi lista, solo debes comprobarla en el siguiente enlace:</p>
    <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar cuenta</a>
    <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
    `
  }

  await transport.sendMail(mailOptions)
}

export const emailOlvidePassword = async ({ nombre, email, token }) => {
  const transport = createNodemailerTransport()

  const mailOptions = {
    from: '"Uptask: Administrador de Proyectos" <cuentas@uptask.com>',
    to: email,
    subject: 'Uptask: Reestablece tu Password',
    html: `<p>Hola: ${nombre}, haz solicitado reestablecer tu password</p>
    <p>Sigue el siguiente enlace para generar un nuevo password:</p>
    <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer Password</a>
    <p>Si tu no solicitaste este email puedes ignorar el mensaje.</p>
    `
  }

  await transport.sendMail(mailOptions)
}
