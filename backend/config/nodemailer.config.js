const nodemailer = require("nodemailer");

const user = "maxionyxboox@gmail.com";
const pass = "nsxtsgpxyaxfjalr"; // Uses google's app specific password

const transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  auth: {
    user: user,
    pass: pass,
  },
});

const sendConfirmationEmail = (name, email, confirmationCode) => {
  transport
    .sendMail({
      from: user,
      to: email,
      subject: "[IFRC] Please confirm your email address",
      html: `
          <table border="0" cellpadding="0" cellspacing="0" style="border-collapse:separate;width:100%;">
            <tbody>
              <tr>
                <td style="display:block;margin:0;">
                  <table align="center" border="0" cellpadding="0" cellspacing="0" style="border-collapse:separate;width:55%;">
                    <tbody>
                      <tr>
                        <td>
                          <h1>Email Confirmation</h1>
                          <h2 style="font-weight:400;">Hello ${name}, </h2>
                          <p>Thank you for creating an IFRC account. Please confirm your email address by clicking the button below</p>
                          <a href=http://localhost/register-confirm/${confirmationCode} style="box-sizing:border-box;text-decoration:none;background-color:#0d6efd;border:solid 1px #007bff;border-radius:4px;color:#ffffff;font-size:16px;font-weight:bold;margin:0;padding:9px 25px;display:inline-block;letter-spacing:1px">Click here</a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        `,
    })
    .catch((err) => {
      return err;
    });
};

module.exports = sendConfirmationEmail;
