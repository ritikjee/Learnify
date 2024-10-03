import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 } from 'uuid';
import s3 from './s3Client';

interface FileUploadResponse {
  signedUrl: string;
  url: string;
}

export const uploadFileToS3 = async (
  fileBuffer: Buffer,
  contentType: string,
  filePath: string
): Promise<FileUploadResponse> => {
  const key = `${filePath}/${v4()}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME as string,
    Key: key,
    Body: fileBuffer,
    ContentType: contentType
  });

  // Upload the file to S3
  await s3.send(command);

  // Generate a signed URL for accessing the file (optional)
  const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

  return {
    signedUrl,
    url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
  };
};
