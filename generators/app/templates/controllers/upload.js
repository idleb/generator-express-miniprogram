const readChunk = require('read-chunk');
const fileType = require('file-type');
const cos = require('../lib/cos');

/**
 * 对象上传 API
 * @param {express request} req
 * @return {Promise} 上传任务的 Promise 对象
 */
module.exports = (req, res) => {
  const type = req.params.type;
  const file = req.files.file;
  if (!type || !validFileType(file.path, type)) {
    res.json({ code: 2001, msg: '不支持的文件类型' });
  } else {
    cos
      .save(file, type)
      .then(data => {
        res.json(data);
      })
      .catch(e => {
        res.send(e);
      });
  }
};
// 判断文件类型
function validFileType(path, type) {
  const mimeRegex = {
    image: /^image\/\S+/gi,
    audio: /^audio\/(mpeg|mp3)/gi,
    video: /^video\/mp4/gi
  }[type];
  const buffer = readChunk.sync(path, 0, 262);
  const resultType = fileType(buffer);
  if (!(resultType && mimeRegex && mimeRegex.test(resultType.mime))) {
    return false;
  }
  return true;
}
