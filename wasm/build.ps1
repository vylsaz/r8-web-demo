$ParentPath = Split-Path $PSScriptRoot -Parent
docker build --no-cache -t build-wasm $PSScriptRoot -f "$PSScriptRoot/Dockerfile"
docker run -v "${ParentPath}:/out" --rm -d build-wasm
