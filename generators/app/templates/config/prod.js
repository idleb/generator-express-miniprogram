const CONF = {
  // MySQL Config
  mysql: {
    host: '',
    port: 3306,
    user: 'root',
    db: '',
    pass: '',
    char: 'utf8mb4',
    log: false
  },
<% if (cos) { %>
  cos: {
    /**
     * 区域
     * 华北：cn-north
     * 华东：cn-east
     * 华南：cn-south
     * 西南：cn-southwest
     * 新加坡：sg
     * @see https://www.qcloud.com/document/product/436/6224
     */
    region: 'cn-north',
    // CDN
    cdn: true,
    // Bucket 名称
    prefix: 'loopify'
  },
<% } %>
  // hostname
  host: '',
  // cookie 秘钥
  secret: ''
};

module.exports = CONF;
