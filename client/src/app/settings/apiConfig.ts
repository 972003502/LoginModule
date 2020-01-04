const hostUrl = 'http://localhost:3000/';

export const apiConfig = {
  host: hostUrl,
  registerApi: hostUrl + 'api/register',
  loginApi: hostUrl + 'api/login',
  saltApi: hostUrl + 'api/salt',
  userInfoApi: hostUrl + 'api/userInfo',
  authApi: hostUrl + 'api/auth',
  registerCaptchaApi: hostUrl + 'api/register/captcha',
  loginCaptchaApi: hostUrl + 'api/login/captcha',
  resetPwdCaptchalApi: hostUrl + 'api/resetPwd/captcha',
  resetPasswordApi: hostUrl + 'api/resetPwd',
};
