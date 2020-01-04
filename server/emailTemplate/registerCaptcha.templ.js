/**
 * Create HTML template for email captcha.
 * @param {string} captcha The captcha to be inserted in the template
 * @return {string} HTML template
 */
function captchaTempl(captcha) {
  const date = new Date().toDateString();
  return `
  <!DOCTYPE html>
  <html>
  
  <head>
    <style>
      .main {
        margin: auto;
        width: 500px;
      }
  
      h2 {
        color: rgb(75, 75, 75);
      }
  
      .content {
        color: rgb(95, 95, 95);
        font-size: 16px;
      }
  
      .captcha {
        text-align: center;
        font-size: 40px;
        color: rgb(250, 53, 53);
      }
  
      .Inscription {
        color: rgb(75, 75, 75);
        font-size: 18px;
      }
  
      .footer {
        font-size: 15px;
        color: rgb(95, 95, 95);
      }
    </style>
  </head>
  
  <body>
    <div class="main">
      <h2>Dear user:</h2>
      <p class="content">Hi, you are applying for the register account service.
        The email verification code for this request is:</p>
      <p class="captcha">${captcha}</p>
      <p class="content">Tip: In order to protect the security of your account,
        please complete verification within 5 minutes.
        If you do not do it yourself,
        please ignore the email.
      </p>
      <br>
      <p class="Inscription">LoginModule
        <br>${date}
      </p>
      <P class="footer">
        (This is a system E-mail, please do not reply directly.)
      </P>
    </div>
  </body>
  
  </html>`;
}

module.exports = captchaTempl;
