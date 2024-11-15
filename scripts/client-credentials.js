import { createDpopHeader, generateDpopKeyPair, buildAuthenticatedFetch } from '@inrupt/solid-client-authn-core';

const dpopKey = await generateDpopKeyPair();

// TODO:
const id = 'TOKEN';
const secret = 'SECRET';
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

// Do something
// const response1 = await authFetch('http://localhost:3000/private');
const response1 = await authFetch('http://localhost:3000/Tammy-DiPrima/profile/card#me');
console.log("Response:", await response1.text());
