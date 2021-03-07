# S3 Uploader

Generate signed urls to allow file uploads from microsites, etc.

## Setup

Be sure to add the microsite domain to the `DOMAIN_ALLOWLIST` variable.

## Usage

Fetch the signed upload url:

    const apiUrl = 'https://api.getup.org.au/upload-url'
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        campaign: 'campaign-name',
        filename: 'example.png',
      })
    }
    const { url } = await (await fetch(apiUrl, options)).json()

Grab the file content as a blob (e.g. using `html-to-image`):

    import { toPng } from 'html-to-image'
    const dataUrl = await toPng(document.getElementById('image'))
    const body = await (await fetch(dataUrl)).blob()

Upload the file:

    await fetch(url, { method: 'PUT', body })

The file goes into the `uploads-sls` bucket and will be served by Cloudfront at:

    https://uploads.getup.org.au/campaign-name/example.png

or if no `campaign` key is specified:

    https://uploads.getup.org.au/default/example.png
