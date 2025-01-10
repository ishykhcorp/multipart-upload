import AWS from "aws-sdk";
import type {
  CreateMultipartUploadRequest,
  AbortMultipartUploadRequest,
  CompleteMultipartUploadRequest
} from "aws-sdk/clients/s3";
import bodyParser from "body-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";

const app = express();
app.use(cors());
app.use(bodyParser.json());
console.log("process.env >", process.env);
const port = process.env.PORT || 5000;

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const s3 = new AWS.S3();

app.post("/init-upload", async (req, res) => {
  const { fileName, fileType } = req.body;

  try {
    const params: CreateMultipartUploadRequest = {
      Bucket: process.env.S3_BUCKET as string,
      Key: fileName,
      ContentType: fileType
    };

    const { UploadId } = await s3.createMultipartUpload(params).promise();
    res.json({ uploadId: UploadId });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error starting upload");
  }
});

app.post("/pre-signed-url", async (req, res) => {
  const { fileName, partNumber, uploadId } = req.body;

  try {
    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: fileName,
      PartNumber: partNumber,
      UploadId: uploadId
    };

    const url = await s3.getSignedUrlPromise("uploadPart", params);
    res.json({ url });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating presigned URL");
  }
});

app.post("/complete-upload", async (req, res) => {
  const { fileName, uploadId, parts } = req.body;

  try {
    const params: CompleteMultipartUploadRequest = {
      Bucket: process.env.S3_BUCKET as string,
      Key: fileName,
      UploadId: uploadId,
      MultipartUpload: {
        Parts: parts
      }
    };

    const result = await s3.completeMultipartUpload(params).promise();
    res.json({ result });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error completing upload");
  }
});

app.post("/abort-upload", async (req, res) => {
  const { fileName, uploadId } = req.body;

  try {
    const params: AbortMultipartUploadRequest = {
      Bucket: process.env.S3_BUCKET as string,
      Key: fileName,
      UploadId: uploadId
    };

    await s3.abortMultipartUpload(params).promise();
    res.send("Upload aborted");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error aborting upload");
  }
});

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
