import polka from 'polka';
import sirv from 'sirv';
import compression from 'compression';
import getPort from 'get-port';
import consola from 'consola';
import { resolveConfig } from './common/config.js';
import { UserConfig } from './common/types.js';

export interface ServeOptions {
  port?: number;
}

export async function serve(
  root = process.cwd(),
  options: ServeOptions = {},
  userConfig?: UserConfig
) {
  const { base, outDir } = await resolveConfig(root, userConfig);
  const port = await getPort({ port: options.port || 5000 });

  const compress = compression();

  const serve = sirv(outDir, {
    etag: true,
    single: true,
    maxAge: 31536000,
    immutable: true,
    setHeaders(res, pathname) {
      if (!pathname.includes('/assets/')) {
        // force server validation for non-asset files since they are not
        // fingerprinted.
        res.setHeader('cache-control', 'no-cache');
      }
    },
  });

  const app = polka();

  if (base === '/') {
    app.use(compress, serve);
  } else {
    app.use(base.replace(/\/$/, ''), compress, serve);
  }

  app.listen(port, (err: any) => {
    if (err) {
      throw err;
    }
    consola.log(`Built site served at http://localhost:${port}${base}\n`);
  });
}
