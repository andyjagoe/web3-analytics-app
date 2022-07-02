import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

const config = {
    credentials: {
      accessKeyId: process.env.ATHENA_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.ATHENA_AWS_SECRET_ACCESS_KEY,
    },
    region: process.env.ATHENA_AWS_REGION
}
const s3Client = new S3Client(config)


export default async function handler(req, res) {
    const { userId, type, slug } = req.query
    const formattedType = type.toUpperCase()

    if (formattedType !== 'QUERY') return res.status(400).end()

    if (req.method === 'GET') {
        const getObjectParams = {
            Bucket: 'web3analytics-query-results',
            Key: `users/${userId}/query/${slug}.csv`
        }
        const objCommand = new GetObjectCommand(getObjectParams)
        const url = await getSignedUrl(s3Client, objCommand, { expiresIn: 3600 })
        res.status(200).json({signedUrl: url})
    }        
          
    res.end()
}