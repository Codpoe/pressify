import path from 'upath';
import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';

/**
 * Remark plugin to transform img src with base
 *
 * @example
 * `![alt](/a.png)` -> `<img alt="alt" src="{base}a.png" />`
 */
export const remarkImg: Plugin<[{ base: string }]> =
  ({ base }) =>
  tree => {
    visit(
      tree,
      (node: any) => node.type === 'image',
      (node: any, index, parent) => {
        const url: string = node.url;

        if (!url?.startsWith('/')) {
          return;
        }

        node.url = path.join(base, url);
      }
    );
  };
