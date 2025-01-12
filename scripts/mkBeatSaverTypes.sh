#!/usr/bin/env zsh

# This script generates the types for the BeatSaver API

SWAGGER_URL=https://api.beatsaver.com/docs/swagger.json
yes | npx openapi-typescript@5.4.1 $SWAGGER_URL --output src/lib/types/BeatSaverTypes.ts