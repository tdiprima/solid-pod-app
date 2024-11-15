#!/bin/bash

curl -X POST \
  -d "client_id=YOUR_CLIENT_ID&client_secret=YOUR_CLIENT_SECRET&grant_type=client_credentials&username=YOUR_USERNAME&password=YOUR_PASSWORD" \
  http://localhost:3000/.oidc/token

curl -X PUT \
  -H "Content-Type: text/plain" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d "abc" \
  http://localhost:3000/Pod-Name/myfile.txt
