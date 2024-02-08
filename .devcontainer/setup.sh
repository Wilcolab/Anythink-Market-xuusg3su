WILCO_ID="`cat .wilco`"
ENGINE_EVENT_ENDPOINT="${ENGINE_BASE_URL}/users/${WILCO_ID}/event"
CODESPACE_BACKEND_HOST=$(curl -s "${ENGINE_BASE_URL}/api/v1/codespace/backendHost?codespaceName=${CODESPACE_NAME}&portForwarding=${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}" | jq -r '.codespaceBackendHost')
CODESPACE_BACKEND_URL="https://${CODESPACE_BACKEND_HOST}"

# Update engine that codespace started for user
curl -L -X POST "${ENGINE_EVENT_ENDPOINT}" -H "Content-Type: application/json" --data-raw "{ \"event\": \"github_codespace_started\" }"

# Export backend envs when in codespaces
echo "export CODESPACE_BACKEND_HOST=\"${CODESPACE_BACKEND_HOST}\"" >> ~/.bashrc
echo "export CODESPACE_BACKEND_URL=\"${CODESPACE_BACKEND_URL}\"" >> ~/.bashrc
echo "export CODESPACE_WDS_SOCKET_PORT=443" >> ~/.bashrc
echo "export ENGINE_EVENT_ENDPOINT=\"${ENGINE_EVENT_ENDPOINT}\"" >> ~/.bashrc


# Export welcome prompt in bash:
echo "printf \"\n\n☁️☁️☁️️ Anythink: Develop in the Cloud ☁️☁️☁️\n\"" >> ~/.bashrc
echo "printf \"\n\x1b[31m \x1b[1m👉 Type: \\\`docker compose up\\\` to run the project. 👈\n\n\"" >> ~/.bashrc

nohup bash -c 'cd /wilco-agent && node agent.js &'
