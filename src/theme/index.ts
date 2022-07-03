import './styles/vars.css';
import './styles/base.css';
import './styles/nprogress.css';

import { Layout } from './components/Layout';
import { NotFound } from './components/NotFound';
import { mdxComponents } from './components/Mdx';

export * from './types';

export default {
  Layout,
  NotFound,
  mdxComponents,
};
