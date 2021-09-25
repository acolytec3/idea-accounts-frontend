import { S3, Endpoint } from 'aws-sdk';

export const putImageOnS3 = async (profileId: string, avatar: Buffer): Promise<string> => {
  
      const s3 = new S3({
        s3ForcePathStyle: true,
        endpoint: new Endpoint(process.env.S3ENDPOINT),
        accessKeyId: process.env.S3ACCESSKEY,
        secretAccessKey: process.env.S3SECRETACCESSKEY,
      }) 
    
    const s3Params = {
      Bucket: process.env.S3NAME,
      Key: profileId + '.png',
      Body: avatar,
      ContentType: 'image/png',
      ACL: "public-read"
    };

    let res = await s3.putObject(s3Params).promise();
  
    if (process.env.NODE_ENV === 'development') {
      return `${process.env.S3ENDPOINT}/${process.env.S3NAME}/${profileId}.png`
    }
    else {
      return `https://${process.env.S3NAME}.s3.amazonaws.com/${process.env.S3NAME}/${profileId}.png`
    }
  
  }