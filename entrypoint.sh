#!/bin/sh

pnpm run decrypt && pnpm run migrate:latest && pnpm run .output/server/index.mjs