import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import fs from "fs/promises";
import path from "path";
import ffmpeg from "fluent-ffmpeg";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

const key = process.env.KEY as string;
const inputBucket = process.env.INPUT_BUCKET as string;
const outputBucket = process.env.OUTPUT_BUCKET as string;

const RESOLUTIONS = [
  { name: "360px", width: 480, height: 360 },
  { name: "480px", width: 858, height: 480 },
  { name: "720px", width: 1280, height: 720 },
];

async function init() {
  try {
    // Step 1: Download the input video from S3 and save it to the 'input' folder
    const command = new GetObjectCommand({
      Bucket: inputBucket,
      Key: key,
    });

    const inputFile = await s3.send(command);

    if (!inputFile.Body) {
      throw new Error("File body is empty.");
    }

    const chunks: Uint8Array[] = [];
    for await (const chunk of inputFile.Body as any) {
      chunks.push(chunk);
    }

    const fileBuffer = Buffer.concat(chunks);
    const inputFilePath = path.join(__dirname, "../input", "input.mp4");
    await fs.writeFile(inputFilePath, fileBuffer);

    console.log("File successfully downloaded to", inputFilePath);

    // Step 2: Process the video to different resolutions using ffmpeg
    const promises = RESOLUTIONS.map((resolution) => {
      const outputFilePath = path.resolve(
        __dirname,
        "../output",
        `${resolution.name}.mp4`
      );

      return new Promise<void>((resolve, reject) => {
        ffmpeg(inputFilePath)
          .output(outputFilePath)
          .withVideoCodec("libx264")
          .withAudioCodec("aac")
          .withSize(`${resolution.width}x${resolution.height}`)
          .on("end", async () => {
            try {
              // Step 3: Upload the processed video to the corresponding S3 path
              const fileContent = await fs.readFile(outputFilePath);
              const s3Key = `learnify/${key}/${resolution.name}.mp4`;

              const putCommand = new PutObjectCommand({
                Bucket: outputBucket,
                Key: s3Key,
                Body: fileContent,
                ContentType: "video/mp4",
              });

              await s3.send(putCommand);
              console.log(`File uploaded to S3: ${s3Key}`);

              resolve();
            } catch (uploadError) {
              console.error("Error uploading file to S3:", uploadError);
              reject(uploadError);
            }
          })
          .on("error", (ffmpegError) => {
            console.error("Error processing video with ffmpeg:", ffmpegError);
            reject(ffmpegError);
          })
          .format("mp4")
          .run();
      });
    });

    // Step 4: Wait for all resolutions to be processed and uploaded
    await Promise.all(promises);
    console.log("All files processed and uploaded successfully.");
  } catch (error) {
    console.error(
      "Error downloading, processing, or uploading the file:",
      error
    );
  }
}

init();
