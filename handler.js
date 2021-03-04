'use strict'

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner")
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3")
const client = new S3Client({})

module.exports.url = async ({ body }) => {
  console.log(body)

  const { project, filename } = JSON.parse(body)
  const command = new PutObjectCommand({
    Bucket: 'upload-sls',
    ACL: 'public-read',
    Key: `${project || 'no-project'}/${filename}`,
  })
  const url = await getSignedUrl(client, command)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({
      url,
    }),
  }
}
