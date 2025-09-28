#!/bin/sh

pnpm run decrypt && pnpm run migrate:latest && node .output/server/index.mjs