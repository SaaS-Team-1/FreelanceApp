#!/bin/bash

sudo apt install -y curl python3.10 python3.10-venv openjdk-17-jdk
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

nvm install --lts
nvm alias default stable
nvm use stable
npm install -g firebase-tools
firebase login

npm i

cd functions 
npm i

cd ../frontend
npm i