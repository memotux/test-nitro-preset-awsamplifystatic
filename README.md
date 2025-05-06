# Test AWS Amplify Nitro Preset

[Original Post](https://github.com/nitrojs/nitro/issues/3288#issuecomment-2849288236)

## Issue

When you deploy a git-base (manual deploy does not have this problem) Nuxt project to AWS Amplify, Nitro auto-detect the Amplify environment and set the preset to `aws-amplify`. This is good IF you want or need to use Amplify "compute layer" (SSR). 👍

But 🤔, IF you want to build SSG or SPA you only need the "compute layer" on build. This is my case for 90% of my projects. This is why I use `nuxt generate` and not `nuxt build`. And have to say that before Nitro, Nuxt 3 and Amplify metaframeworks support, `nuxt generate` was the only build option in Amplify for Vue/Nuxt projects.

In local environment `nuxt generate` set the preset to `static`. But in Amplify environment, it is auto-detected, and set to `aws-amplify`. You can override this auto-detect and set the `nitro.preset` to `static`, but this result in a deploy error because AWS Amplify look for `.amplify-hosting` directory and `deploy-manifest.json` file.

## Solutions

### 🖥 Manual Deployments

Developers can generate the output files in local environment with `nuxt generate`, zip the files, and upload the zip archive to Amplify. Also, Amplify CLI have this option as part of it `hosting` feature, and executing `amplify publish` does this all process.

One drawback on this option it is that I can not benefit from Amplify Image optimizations that it is given when you build on an Amplify environment.

### 💅 New Nitro Preset

Add a new preset: `aws-amplify-static`. This preset it will extend `aws-amplify` preset, override `static` option, output directories, and **crawl links** (this is the reason why `aws-amplify` does not generate an `index.html` file).

This new preset will be auto detected because `static` option set to `true`, first by `nuxt generate`, second by this preset.

## Benefits

- `nuxt generate` work as expected on Amplify environment.
- AWS Amplify Image optimization for SSG?.
- Preset work on manual deployments?. In my test, uploading `.amplify-hosting` content does not work. I think it is because manual deploys expect static files only.

## This repository

So. This repository have the mission to try to test the diferent options with `aws-amplify` preset and AWS Amplify environment.

### What are the options

In AWS Amplify you have two options for deployments:

- Git-base
- Manual

With "Manual deployments" you only have the option to upload static files. So, in this case you `nuxt generate` your project in local environment and upload `.output/public` content to Amplify.

With "Git-base deployments" you use Amplify "compute layer" to build your projects. But, since Nuxt 3, you can choose build an SSR site with `nuxt build` or build an SSG site with `nuxt generate` (before Nuxt 3 this was the only option).

### The `nuxt generate` Issue

Manual deployments and Git-base deployment with `nuxt build` work as spected. But Gib-base deployment with `nuxt generate` have as Issue.

When `nuxt generate` is executed on a Amplify Git-base project, the preset is autodetected and set to `aws-amplify`. The current preset will not `crawlLinks`, resulting in a non-working static folder, when the expected result it is the same files and structure as when you execute `nuxt generate` in local environment.

### Finally, this repository

To test this issue, I have created this repository, with two branchs:

- preset (default)
- current

The `preset` branch it is what we expect the result to be. An `.amplify-hosting` directory with an `static` directoy wich content it is a working website, with the same result as in local environment `nuxt generate`. This branch use a `custom preset` to achive this result, and force `nitro.preset` option to this custom preset.

The `current` branch try to emulate what happen with current `aws-amplify` preset. Add a `env` variable to simulate Amplify environment and be autodetected by Nitro.

But this last branch have a `preset.mjs` file. If you copy the content of `./preset.mjs` file to `node_modules/nitropack/dist/presets/aws-amplify/preset.mjs` you will be able to test what will happen if this new preset it is merge.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Test `preset` branch

```bash
# npm
npm run generate

# pnpm
pnpm generate

# yarn
yarn generate

# bun
bun run generate
```

## Test `current` branch

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

```bash
# npm
npm run generate

# pnpm
pnpm generate

# yarn
yarn generate

# bun
bun run generate
```
