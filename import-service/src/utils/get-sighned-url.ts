import { PutObjectCommand, PutObjectCommandInput, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const getSignedUrlHandler = async(name: string) => {
  const s3Client = new S3Client({region: process.env.REGION});
  const input: PutObjectCommandInput = {
    Bucket: process.env.BUCKET,
    Key: `uploaded/${name}`,
    ContentType: 'text/csv'
  };
  const command = new PutObjectCommand(input);
  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 });

  return signedUrl;
}