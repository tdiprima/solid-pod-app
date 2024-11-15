#!/bin/bash
# https://communitysolidserver.github.io/CommunitySolidServer/7.x/usage/starting-server/#via-docker

# Clone the repo to get access to the configs
# git clone https://github.com/CommunitySolidServer/CommunitySolidServer.git
cd $HOME/trabajo/CommunitySolidServer

# Run the image, serving your `~/Solid` directory on `http://localhost:3000`
# docker run --rm -v "$HOME/Solid:/data" -p 3000:3000 -it solidproject/community-server:latest

# Port 3003
# docker run --rm -v "$HOME/Solid:/data" -p 3003:3003 -it solidproject/community-server:latest -p 3003

# Persist the container
# docker run --name solid-server -v "$HOME/Solid:/data" -p 3000:3000 -d solidproject/community-server:latest

# Persist port 3003
docker run -v "$HOME/Solid:/data" -p 3003:3003 -it --name solid-server solidproject/community-server:latest
