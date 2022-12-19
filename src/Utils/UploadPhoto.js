const { CatchAsync } = require('../Error/CatchAsync');
const aws = require('aws-sdk');
const AppError = require('../Error/AppError');

exports.uploadPhots = CatchAsync(async (req, res, next) => {
  req.body.address = req.body.address ? JSON.parse(req.body.address) : '';
  if (req.files && req.files.length) {
    aws.config.update({
      accessKeyId: process.env.AWS_ACCESSES,
      secretAccessKey: process.env.AWS_SEC_key,
      region: process.env.AWS_REGION,
    });
    const file = req.files[0];
    const ext = file.mimetype.split('/')[1];
    if (!['jpg', 'jpeg', 'png', 'svg'].includes(ext)) {
      return next(new AppError(`You can upload only images!`, 400));
    }
    req.body.profileImage = await new Promise((resolve, reject) => {
      const s3 = new aws.S3({ apiVersion: '2006-03-01' });

      const uploadParams = {
        ACL: 'public-read',
        //   Bucket: 'classroom-training-bucket',
        Bucket: 'jivan-demo-s3',
        Key: 'group33/' + file.originalname,
        Body: file.buffer,
      };
      s3.upload(uploadParams, (err, data) => {
        if (err) {
          return reject({ error: err });
        }
        return resolve(data.Location);
      });
    });
  }
  next();
});
