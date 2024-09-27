#!/bin/sh

bun run decrypt && bun run migrate:latest && bun run .output/server/index.mjs