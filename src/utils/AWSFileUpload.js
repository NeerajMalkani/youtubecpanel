import AWS from "aws-sdk";
import { awsCreds } from "./credentials";

const S3_BUCKET = awsCreds.awsBucket;
const REGION = awsCreds.awsRegion;

AWS.config.update({
  accessKeyId: awsCreds.awsAccessKey,
  secretAccessKey: awsCreds.awsSecretKey,
});

const myBucket = new AWS.S3({
  params: { Bucket: S3_BUCKET },
  region: REGION,
});

export const UploadImageToS3WithNativeSdk = (file, fileName, callBack) => {
  const params = {
    ACL: "public-read",
    Body: file,
    Bucket: S3_BUCKET,
    Key: fileName,
  };

  myBucket
    .putObject(params)
    .on("httpUploadProgress", (evt) => {
      // setProgress(Math.round((evt.loaded / evt.total) * 100));
    })
    .send((err) => {
      if (err) {
        callBack(err);
      } else {
        callBack("Success", fileName);
      }
    });
};

export const DeleteImageToS3WithNativeSdk = (fileName, callBack) => {
  const params = {
    Bucket: S3_BUCKET,
    Key: fileName,
  };

  myBucket.deleteObject(params).send((err) => {
    if (err) {
      callBack(err);
    } else {
      callBack("Success", fileName);
    }
  });
};

export const GetObjectsFromS3 = (callBack) => {
  const params = {
    Bucket: S3_BUCKET,
    Delimiter: '',
    Prefix: '',
  };

  myBucket.listObjectsV2(params, (err, data) => {
    if (err) {
      callBack(null);
    } else {
      callBack(data.Contents);
    }
  });
};