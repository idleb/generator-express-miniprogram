const CONF = {
  port: '3000',
  // 域名
  domain: '',

  // 微信小程序 App ID
  appId: '',

  // 微信小程序 App Secret
  appSecret: '',

  // 微信开放平台 App ID
  openAppId: '',

  // 微信开放平台 App Secret
  openAppSecret: '',
<% if (cos) { %>
  // 腾讯云相关配置可以查看云 API 秘钥控制台：https://console.cloud.tencent.com/capi
  qcloudAppId: '',
  qcloudSecretId: '',
  qcloudSecretKey: ''
<% } %>
};

module.exports =
  process.env.NODE_ENV === 'production'
    ? Object.assign({}, CONF, require('./prod'))
    : Object.assign({}, CONF, require('./dev'));
