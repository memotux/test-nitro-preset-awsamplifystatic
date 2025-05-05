export default defineNitroConfig(
  {
    extends: 'aws-amplify',
    static: true,
    prerender: {
      crawlLinks: true
    },
    serveStatic: false,
    output: {
      dir: "{{ rootDir }}/.amplify-hosting",
      publicDir: "{{ output.dir }}/static{{ baseURL }}",
    },
    commands: {
      preview: "npx serve ./static",
    },
  }
);