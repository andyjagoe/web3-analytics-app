import { DynamoDB } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb"

const config = {
    credentials: {
      accessKeyId: process.env.NEXT_AUTH_AWS_ACCESS_KEY,
      secretAccessKey: process.env.NEXT_AUTH_AWS_SECRET_KEY,
    },
    region: process.env.NEXT_AUTH_AWS_REGION,
};
  
const client = DynamoDBDocument.from(new DynamoDB(config), {
    marshallOptions: {
        convertEmptyValues: true,
        removeUndefinedValues: true,
        convertClassInstanceToMap: true,
    }   
})
  

export default {
  get: (params) => client.get(params),
  put: (params) => client.put(params),
  update: (params) => client.update(params),
  delete: (params) => client.delete(params),
  query: (params) => client.query(params),
}