'use strict'

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner")
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3")
const client = new S3Client({})

const errorResponse = error => ({
  statusCode: 400,
  body: JSON.stringify({
    error,
  }),
})

module.exports.url = async ({ headers: { origin }, body }) => {
  console.log(origin, body)

  if (!(process.env.DOMAIN_ALLOWLIST || '').split(' ').includes(origin)) {
    return errorResponse("Domain not allowed; have you updated the allow list?")
  }

  const { campaign, filename } = JSON.parse(body)

  if (!filename) return errorResponse("No filename")

  const command = new PutObjectCommand({
    Bucket: 'upload-sls',
    ACL: 'public-read',
    Key: `${campaign || 'default'}/${filename}`,
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
