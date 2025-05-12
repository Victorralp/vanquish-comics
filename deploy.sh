#!/bin/bash

# Install dependencies with legacy peer deps
npm install --legacy-peer-deps

# Force install React 18.2.0
npm install react@18.2.0 react-dom@18.2.0 --legacy-peer-deps

# Build the project
npm run build 