# Publishing to npm

This guide walks you through publishing the SW Combine SDK to npm.

## Prerequisites

1. **npm Account** - Create one at https://www.npmjs.com/signup
2. **2FA Enabled** - npm requires 2FA for publishing packages
3. **Git Repository** - Your code should be in a public Git repository

## One-Time Setup

### 1. Update package.json

Replace these placeholder values in `package.json`:

```json
{
  "author": "Your Name <your.email@example.com>",
  "repository": {
    "type": "git",
    "url": "https://github.com/YOUR_USERNAME/swcombine-sdk-nodejs.git"
  },
  "bugs": {
    "url": "https://github.com/YOUR_USERNAME/swcombine-sdk-nodejs/issues"
  },
  "homepage": "https://github.com/YOUR_USERNAME/swcombine-sdk-nodejs#readme"
}
```

### 2. Check Package Name Availability

```bash
npm view swcombine-sdk

# If it exists, choose a different name in package.json:
# "name": "@yourorg/swcombine-sdk"  (scoped package)
# or
# "name": "swcombine-api-sdk"  (different name)
```

### 3. Login to npm

```bash
npm login
# Enter your username, password, email, and 2FA code
```

## Pre-Publish Checklist

Before every publish, verify:

### 1. All Tests Pass

```bash
npm test
npm run test:integration  # If you have valid credentials
```

### 2. Build Successfully

```bash
npm run build

# Verify dist/ directory structure
ls -R dist/
# Should see: dist/cjs/, dist/esm/, dist/types/
```

### 3. Test Locally with npm pack

This simulates what will be published:

```bash
# Create a tarball
npm pack

# This creates: swcombine-sdk-0.1.0.tgz

# Test it in another directory
cd /tmp
mkdir test-install
cd test-install
npm init -y
npm install /path/to/swcombine-sdk-nodejs/swcombine-sdk-0.1.0.tgz

# Test importing
node -e "const sdk = require('swcombine-sdk'); console.log(sdk.SWCombine)"
```

### 4. Check What Will Be Published

```bash
npm publish --dry-run

# This shows exactly what files will be included
# Verify:
# ✓ dist/ is included
# ✓ README.md is included
# ✓ LICENSE is included
# ✗ src/, tests/, scripts/ are NOT included
# ✗ .env files are NOT included
```

### 5. Verify README

- Make sure README.md has:
  - Installation instructions
  - Quick start examples
  - API documentation links
  - License information

### 6. Update Version (Semantic Versioning)

```bash
# For first release (0.1.0 → 1.0.0)
npm version 1.0.0

# For patches (1.0.0 → 1.0.1)
npm version patch

# For minor features (1.0.0 → 1.1.0)
npm version minor

# For breaking changes (1.0.0 → 2.0.0)
npm version major
```

This automatically:
- Updates version in package.json
- Creates a git commit
- Creates a git tag

## Publishing

### First Publication (v1.0.0)

```bash
# Final check
npm run lint
npm test
npm run build

# Publish (with public access for first scoped package)
npm publish --access public

# Or for unscoped packages
npm publish
```

### Subsequent Releases

```bash
# 1. Make your changes and commit them
git add .
git commit -m "Add new feature"

# 2. Update version
npm version minor  # or patch/major

# 3. Build and test
npm run build
npm test

# 4. Publish
npm publish

# 5. Push to Git (including tags)
git push origin main --tags
```

## Publishing Workflow Script

Create `scripts/publish-release.sh`:

```bash
#!/bin/bash
set -e  # Exit on error

echo "🚀 Starting release process..."

# Check if working directory is clean
if [[ -n $(git status -s) ]]; then
  echo "❌ Error: Working directory not clean. Commit or stash changes."
  exit 1
fi

# Run tests
echo "🧪 Running tests..."
npm test

# Build
echo "📦 Building..."
npm run build

# Get version type from argument
VERSION_TYPE=${1:-patch}

echo "📝 Bumping version ($VERSION_TYPE)..."
npm version $VERSION_TYPE

NEW_VERSION=$(node -p "require('./package.json').version")

echo "🚀 Publishing version $NEW_VERSION..."
npm publish

echo "📤 Pushing to git..."
git push origin main --tags

echo "✅ Successfully published version $NEW_VERSION!"
echo "📦 Package: https://www.npmjs.com/package/swcombine-sdk"
```

Make it executable:

```bash
chmod +x scripts/publish-release.sh
```

Usage:

```bash
./scripts/publish-release.sh patch   # 1.0.0 → 1.0.1
./scripts/publish-release.sh minor   # 1.0.0 → 1.1.0
./scripts/publish-release.sh major   # 1.0.0 → 2.0.0
```

## Post-Publication

### 1. Verify on npm

```bash
# Check package page
open https://www.npmjs.com/package/swcombine-sdk

# Verify it can be installed
npm install swcombine-sdk
```

### 2. Create GitHub Release

Go to your GitHub repository:

1. Click "Releases"
2. Click "Create a new release"
3. Select the tag (e.g., `v1.0.0`)
4. Add release notes
5. Publish release

### 3. Update Documentation

Update README.md if needed and republish:

```bash
# Make README changes
git add README.md
git commit -m "Update README"

# Don't bump version, just republish
npm publish
```

## Troubleshooting

### "You must verify your email"

```bash
npm profile get
# Check if email is verified
# If not, check your email for verification link
```

### "Package name taken"

Choose a different name or use scoped package:

```json
{
  "name": "@yourusername/swcombine-sdk"
}
```

Then publish with:

```bash
npm publish --access public
```

### "402 Payment Required"

You're trying to publish a scoped private package without a paid plan.
Use `--access public`:

```bash
npm publish --access public
```

### "Version already published"

You must increment the version:

```bash
npm version patch
npm publish
```

### Build Errors

Make sure all devDependencies are installed:

```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Unpublishing (Emergency Only)

⚠️ **Only use in first 72 hours or for security issues**

```bash
# Unpublish specific version
npm unpublish swcombine-sdk@1.0.0

# Unpublish entire package (use with extreme caution!)
npm unpublish swcombine-sdk --force
```

Better approach: Deprecate instead

```bash
npm deprecate swcombine-sdk@1.0.0 "Version 1.0.0 has security issues, please upgrade to 1.0.1"
```

## Beta/Alpha Releases

For pre-release testing:

```bash
# Version as beta
npm version 1.1.0-beta.0

# Publish with beta tag
npm publish --tag beta

# Users install with:
# npm install swcombine-sdk@beta
```

## Keeping Package Up to Date

```bash
# Check for outdated dependencies
npm outdated

# Update dependencies
npm update

# Test after updating
npm test
npm run build

# Publish patch
npm version patch
npm publish
```

## Package Size

Check bundle size:

```bash
# See what's in the package
npm pack --dry-run

# Install package-size analyzer
npx package-size swcombine-sdk@latest
```

Aim for:
- ✅ < 500KB excellent
- ⚠️ 500KB - 1MB acceptable
- ❌ > 1MB consider optimization

## Resources

- [npm Publishing Guide](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [Semantic Versioning](https://semver.org/)
- [npm CLI Documentation](https://docs.npmjs.com/cli/)
