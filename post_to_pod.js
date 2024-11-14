import fs from 'fs';
import { createDpopHeader, generateDpopKeyPair, buildAuthenticatedFetch } from '@inrupt/solid-client-authn-core';

const dpopKey = await generateDpopKeyPair();

// TODO:
const id = 'TOKEN_ID';
const secret = 'TOKEN_SECRET';

const authString = `${encodeURIComponent(id)}:${encodeURIComponent(secret)}`;
const tokenUrl = 'http://localhost:3000/.oidc/token';

const response = await fetch(tokenUrl, {
  method: 'POST',
  headers: {
    authorization: `Basic ${Buffer.from(authString).toString('base64')}`,
    'content-type': 'application/x-www-form-urlencoded',
    dpop: await createDpopHeader(tokenUrl, 'POST', dpopKey),
  },
  body: 'grant_type=client_credentials&scope=webid',
});

const { access_token: accessToken } = await response.json();
const authFetch = await buildAuthenticatedFetch(accessToken, { dpopKey });

// Read file contents
const filePath = './test_document.ttl';
const fileContent = fs.readFileSync(filePath, 'utf-8');

// Upload the file to the POD
const uploadUrl = 'http://localhost:3000/Tammy-DiPrima/test_document.ttl';
const uploadResponse = await authFetch(uploadUrl, {
  method: 'PUT',
  headers: {
    'content-type': 'text/turtle',
  },
  body: fileContent,
});

console.log("Upload response status:", uploadResponse.status);
if (uploadResponse.ok) {
  console.log("File uploaded successfully.");
} else {
  console.error("File upload failed:", await uploadResponse.text());
}
