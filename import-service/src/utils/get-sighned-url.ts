import { PutObjectCommand, PutObjectCommandInput, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import * as dotenv from 'dotenv';
import * as process from 'process';

dotenv.config();

const { BUCKET, REGION } = process.env;

export const getSignedUrlHandler = async(name: string) => {
  const s3Client = new S3Client({region: REGION});
  const input: PutObjectCommandInput = {
    Bucket: BUCKET,
    Key: `uploaded/${name}`,
    ContentType: 'text/csv'
  };
  const command = new PutObjectCommand(input);
  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 });

  return signedUrl;
}