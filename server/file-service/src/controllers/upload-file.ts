import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Request, Response } from 'express';
import mimeTypes from 'mime-types';
import { v4 } from 'uuid';
import s3 from '../utils/s3Client';

export const uploadFile = async (req: Request, res: Response) => {
  const { fileName } = req.body;

  if (!fileName) {
    return res.status(400).json({ message: 'Filename is required' });
  }

  const contentType = mimeTypes.lookup(fileName);
  const fileType = contentType.toString().split('/')[0];

  const acceptedFileTypePatterns = [/^image\/.*$/, /^video\/.*$/, /^.*\/pdf$/];

  if (!acceptedFileTypePatterns.some((pattern) => pattern.test(fileType))) {
    return res.status(400).json({ message: 'Invalid file type' });
  }
  const key = `learnify/user-uploads/${fileType}/${v4()}`;

  try {
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME as string,
      Key: key,
      ContentType: contentType as string
    });

    const signedUrl = await getSignedUrl(s3, command);

    return res.status(200).json({
      signedUrl,
      url: `${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};
