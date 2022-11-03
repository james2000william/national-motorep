import {
  Tree,
  formatFiles,
  installPackagesTask,
  generateFiles,
  joinPathFragments,
  updateJson,
} from '@nrwl/devkit';

interface NewCloudflareWorker {
  name: string;
}

export default async function (host: Tree, schema: NewCloudflareWorker) {
  generateFiles(
    host,
    joinPathFragments(__dirname, './files'),
    `./services/${schema.name}`,
    {
      name: schema.name,
    }
  );
  updateJson(host, 'workspace.json', (pkgJson) => {
    pkgJson.projects = pkgJson.projects ?? {};
    pkgJson.projects[schema.name] = `services/${schema.name}`;
    return pkgJson;
  });
  await formatFiles(host);
  return () => {
    installPackagesTask(host);
  };
}
