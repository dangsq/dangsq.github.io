#!/bin/bash
set -e

echo "📦 Building..."
npm run build

echo "🚀 Switching to main branch..."
git stash push -m "auto-deploy" 2>/dev/null || true
git checkout main
git pull origin main

echo "📋 Copying build files..."
rm -rf assets index.html 404.html .nojekyll
cp -r dist/* .
cp index.html 404.html
touch .nojekyll

echo "📝 Committing..."
git add -A
git commit -m "Deploy: $(date +'%Y-%m-%d %H:%M')"

echo "☁️  Pushing to GitHub..."
git push origin main

echo "✨ Switching back to docs..."
git checkout docs
git stash pop 2>/dev/null || true

echo "✅ Deployed to https://dangsq.github.io 🎉"
