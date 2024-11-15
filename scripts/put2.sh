#!/bin/bash

curl -X POST \
  -H "Authorization: Basic $(echo -n 'YOUR_CLIENT_ID:YOUR_CLIENT_SECRET' | base64)" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials&scope=webid" \
  http://localhost:3000/.oidc/token

curl -X PUT \
  -H "Content-Type: text/plain" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d "abc" \
  http://localhost:3000/Pod-Name/myfile.txt
