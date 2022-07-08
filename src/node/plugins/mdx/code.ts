import path from 'upath';
import { visit } from 'unist-util-visit';
import { Parser } from 'acorn';
import jsx from 'acorn-jsx';
import type { Plugin } from 'unified';
import type {
  MdxJsxAttribute,
  MdxJsxExpressionAttribute,
  MdxJsxFlowElement,
} from 'mdast-util-mdx-jsx';
import type { MdxjsEsm } from 'mdast-util-mdxjs-esm';
import type { Code } from 'mdast';
import { CODE_DEMO_MODULE_ID_PREFIX } from '../../common/constants.js';
import { MdxOptions } from '../../common/types.js';
import { getHighlighter, Highlighter } from './highlight.js';

const parser = Parser.extend(jsx());

const moduleIdToCodeMap = new Map<
  string,
  {
    importSource: string;
    code: string;
    language?: string;
  }
>();

function checkIsDemo(meta: string) {
  return /(^|\s)(demo|demo=\{true\})($|\s)/.test(meta);
}

function getCodeDemoId(currentSize: number) {
  return `__code_demo_${currentSize}`;
}

function getCodeDemoModuleId(filePath: string, codeDemoId: string) {
  return path.normalize(
    `${CODE_DEMO_MODULE_ID_PREFIX}${filePath}/${codeDemoId}.tsx`
  );
}

/**
 * Remark plugin to transform code to <Demo/>
 */
export const remarkMdxCodeDemo: Plugin = () => (tree: any, file) => {
  const imports: Omit<MdxjsEsm, 'value'>[] = [];

  visit(tree, 'code', (node: Code, index, parent) => {
    if (!node.meta) {
      return;
    }

    if (!checkIsDemo(node.meta)) {
      return;
    }

    const filePath = path.normalize(file.path);
    const codeDemoId = getCodeDemoId(imports.length);
    const codeDemoModuleId = getCodeDemoModuleId(filePath, codeDemoId);

    if (!node.value.includes('export default')) {
      return file.fail('Demo must have the default export');
    }

    const prevCode = moduleIdToCodeMap.get(codeDemoModuleId);
    const hasChanged = Boolean(prevCode && prevCode.code !== node.value);

    // if the code value has changed, append timestamp to refresh demo import.
    // if not changed, use previous importSource
    const importSource = hasChanged
      ? `${codeDemoModuleId}?v=${Date.now()}`
      : prevCode?.importSource || codeDemoModuleId;

    // store the code content for loading the component
    moduleIdToCodeMap.set(codeDemoModuleId, {
      importSource,
      code: node.value,
      language: node.lang ?? undefined,
    });

    // push `import * as __code_demo_0 from '/@pressify/code-demo/xxx'`
    imports.push({
      type: 'mdxjsEsm',
      data: {
        estree: {
          type: 'Program',
          sourceType: 'module',
          body: [
            {
              type: 'ImportDeclaration',
              specifiers: [
                {
                  type: 'ImportNamespaceSpecifier',
                  local: {
                    type: 'Identifier',
                    name: codeDemoId,
                  },
                },
              ],
              source: {
                type: 'Literal',
                value: importSource,
                raw: JSON.stringify(importSource),
              },
            },
          ],
        },
      },
    });

    // spread imported codeDemoId
    // <Demo {...codeDemoId} />
    const demoAttributes: (MdxJsxAttribute | MdxJsxExpressionAttribute)[] = [
      {
        type: 'mdxJsxExpressionAttribute',
        value: `...${codeDemoId}`,
        data: {
          estree: {
            type: 'Program',
            sourceType: 'module',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'SpreadElement',
                      argument: {
                        type: 'Identifier',
                        name: codeDemoId,
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      },
    ];

    const demoNode: MdxJsxFlowElement = {
      type: 'mdxJsxFlowElement',
      name: 'Demo',
      attributes: demoAttributes,
      // set children for render
      // <Demo>
      //   <codeDemoId.default />
      // </Demo>
      children: [
        {
          type: 'mdxJsxFlowElement',
          name: `${codeDemoId}.default`,
          attributes: [],
          children: [],
        },
      ],
    };

    parent.children[index!] = demoNode;
  });

  // add imports
  tree.children.unshift(...imports);
};

/**
 * Remark plugin for parsing markdown code block metadata
 *
 * Based on https://github.com/remcohaszing/remark-mdx-code-meta
 */
export const remarkMdxCodeMeta: Plugin = () => (tree: any) => {
  visit(tree, 'code', (node: Code, index, parent) => {
    const code = JSON.stringify(`${node.value}\n`);
    const codeProps = [
      node.lang ? `className="language-${node.lang}"` : '',
      node.meta,
      'codeBlock',
    ]
      .filter(Boolean)
      .join(' ');

    const value = `<pre><code ${codeProps}>{${code}}</code></pre>`;
    const estree = parser.parse(value, { ecmaVersion: 'latest' });

    parent.children[index!] = {
      type: 'mdxFlowExpression',
      value,
      data: { estree },
    };
  });
};

let getHighlighterPromise: Promise<Highlighter> | null = null;

export async function loadCodeDemo(
  moduleId: string,
  options: Pick<MdxOptions, 'transformDemo' | 'theme'>
) {
  const { code, language } = moduleIdToCodeMap.get(moduleId) || {};

  if (!code) {
    throw new Error(`Code content of ${moduleId} is empty`);
  }

  const finalCode = options.transformDemo?.(code) || code;

  if (!getHighlighterPromise) {
    getHighlighterPromise = getHighlighter(options.theme);
  }

  const { highlight, theme } = await getHighlighterPromise;

  let codeHtml: string;

  if (typeof theme === 'string') {
    codeHtml = highlight(finalCode, language);
  } else {
    codeHtml =
      highlight(finalCode, language, 'light') +
      highlight(finalCode, language, 'dark');
  }

  return `
${finalCode}

export const code = ${JSON.stringify(finalCode)};
export const codeHtml = ${JSON.stringify(codeHtml)};
export const meta = {};
export const language = '${language || ''}';
`;
}
