import { CopyObjectCommand, DeleteObjectCommand, GetObjectCommand, GetObjectCommandInput, GetObjectCommandOutput, S3Client } from "@aws-sdk/client-s3";
import { PARSED_FOLDER_NAME, UPLOADED_FOLDER_NAME } from "src/constants/http-request";
import { Readable } from "stream";

const csv = require('csv-parser');
const s3Client = new S3Client({region: process.env.REGION});

export const fileParser = async(objectKey) => {
  const bucketParams = {
    Bucket: process.env.BUCKET,
    Key: objectKey
  };

  const getObject = new GetObjectCommand(bucketParams)
  const s3Object = await s3Client.send(getObject);

  console.log("s3Object loaded", s3Object);

  return parseCsvFile(bucketParams, objectKey, s3Object);
}

const parseCsvFile = async(bucketParams: GetObjectCommandInput, objectKey, s3Object: GetObjectCommandOutput) => {
  await new Promise((res, rej) => {
    const file = (s3Object.Body as Readable);

    file
      .pipe(csv())
      .on("data", (data) => console.log("Record:", data))
      .on("end", async () => {
        console.log("Finish parsing CSV file");

        try {
          await copyParsedFile(objectKey);
          await deleteParsedFile(bucketParams);

          console.log("Finish copy and delete file");

          return res('Success');
        } catch (error) {
          console.log(`Error copying or deleting file: ${error}`);

          return rej(error);
        }
      })
      .on("error", (error) => {
        console.log(error);

        return rej(error)
      })
    });
  }

const copyParsedFile = async(objectKey) => {
  const copyObjectCommand = new CopyObjectCommand({
    Bucket: process.env.BUCKET,
    CopySource: `${process.env.BUCKET}/${objectKey}`,
    Key: objectKey.replace(UPLOADED_FOLDER_NAME, PARSED_FOLDER_NAME)
  });

  await s3Client.send(copyObjectCommand);
}

const deleteParsedFile = async(bucketParams) => {
  const deleteObjectCommand = new DeleteObjectCommand(bucketParams)

  await s3Client.send(deleteObjectCommand)
}