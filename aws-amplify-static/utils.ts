import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { Nitro } from "nitropack/types";
import { joinURL } from "ufo";
import type {
  AmplifyDeployManifest,
  AmplifyRoute,
} from "./types";

export async function writeAmplifyFiles(nitro: Nitro) {
  const outDir = nitro.options.output.dir;

  // Generate routes
  const routes: AmplifyRoute[] = [];

  let hasWildcardPublicAsset = false;

  if (nitro.options.awsAmplify?.imageOptimization) {
    const { path, cacheControl } =
      nitro.options.awsAmplify?.imageOptimization || {};
    if (path) {
      routes.push({
        path,
        target: {
          kind: "ImageOptimization",
          cacheControl,
        },
      });
    }
  }

  for (const publicAsset of nitro.options.publicAssets) {
    if (!publicAsset.baseURL || publicAsset.baseURL === "/") {
      hasWildcardPublicAsset = true;
      continue;
    }
    routes.push({
      path: `${publicAsset.baseURL!.replace(/\/$/, "")}/*`,
      target: {
        kind: "Static",
        cacheControl:
          publicAsset.maxAge > 0
            ? `public, max-age=${publicAsset.maxAge}, immutable`
            : undefined,
      },
      fallback: publicAsset.fallthrough ? { kind: "Static" } : undefined,
    });
  }
  if (hasWildcardPublicAsset) {
    routes.push({
      path: "/*.*",
      target: {
        kind: "Static",
      },
      fallback: { kind: "Static" },
    });
  }
  routes.push({
    path: "/*",
    target: { kind: "Static" },
    fallback:
      hasWildcardPublicAsset && nitro.options.awsAmplify?.catchAllStaticFallback
        ? {
          kind: "Static",
        }
        : undefined,
  });

  // Prefix with baseURL
  for (const route of routes) {
    if (route.path !== "/*") {
      route.path = joinURL(nitro.options.baseURL, route.path);
    }
  }

  // Generate deploy-manifest.json
  const deployManifest: AmplifyDeployManifest = {
    version: 1,
    routes,
    imageSettings: nitro.options.awsAmplify?.imageSettings || undefined,
    computeResources: undefined,
    framework: {
      name: nitro.options.framework.name || "nitro",
      version: nitro.options.framework.version || "0.0.0",
    },
  };
  await writeFile(
    resolve(outDir, "deploy-manifest.json"),
    JSON.stringify(deployManifest, null, 2)
  );
}