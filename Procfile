web: node build/server.js
release: ENV_SILENT=true node ./build/ace migration:run --force && node ./build/ace db:seed