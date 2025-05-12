#!/bin/bash

# Install dependencies with legacy peer deps
npm install --legacy-peer-deps

# Force install React 18.2.0
npm install react@18.2.0 react-dom@18.2.0 --legacy-peer-deps

# Install tailwindcss and related dependencies explicitly
npm install tailwindcss@3.3.0 postcss@8.4.31 autoprefixer@10.4.16 --legacy-peer-deps

# Create any missing components directory
mkdir -p src/components

# Build the project
npm run build 