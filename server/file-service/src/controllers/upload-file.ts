import { Request, Response } from 'express';
import { uploadFileToS3 } from '../utils/uploadFileToS3';

export const uploadFile = async (req: Request, res: Response) => {
  let data = Buffer.from('');

  req.on('data', (chunk) => {
    data = Buffer.concat([data, chunk]);
  });

  req.on('end', async () => {
    try {
      const boundary = req.headers['content-type']?.split('boundary=')[1] ?? '';
      const parts = data.toString().split(boundary);

      for (const part of parts) {
        if (part.includes('filename=')) {
          const rawFileData = part.split('\r\n\r\n')[1];
          const fileBuffer = Buffer.from(rawFileData.split('\r\n--')[0]);
          const contentTypeMatch = part.match(/Content-Type: (.*)/);
          const contentType = contentTypeMatch
            ? contentTypeMatch[1]
            : 'application/octet-stream';

          let folder = 'learnify/user-uploads'; // Default folder
          if (contentType.startsWith('image/')) {
            folder = 'learnify/user-uploads/images';
          } else if (contentType.startsWith('video/')) {
            folder = 'learnify/user-uploads/video';
          } else if (contentType === 'application/pdf') {
            folder = 'learnify/user-uploads/pdf';
          }

          const { url } = await uploadFileToS3(fileBuffer, contentType, folder);

          return res.status(200).json({
            url
          });
        }
      }

      res.status(400).json({ message: 'No file found in the request' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to upload the file' });
    }
  });

  req.on('error', (err) => {
    res.status(500).json({ message: 'Upload failed' });
  });
};
