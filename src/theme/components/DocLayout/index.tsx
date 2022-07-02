import React, { useMemo, useState } from 'react';
import { matchPath, Page, useAppState } from 'pressify/client';
import { Sidebar, SidebarIndicator } from '../Sidebar';
import { Mdx } from '../Mdx';
import { UpdateInfo } from '../UpdateInfo';
import { PrevNext } from '../PrevNext';
import { Toc } from '../Toc';
import { Loading } from '../Loading';
import './style.css';
import { useSidebar } from '../../hooks/useSidebar';
import { SidebarItem } from '../../types';

export const DocLayout: React.FC = () => {
  const { pagePath, pageModule } = useAppState();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebar = useSidebar();

  const activeSidebar = useMemo<SidebarItem[]>(() => {
    if (!pagePath || !sidebar?.length) {
      return [];
    }

    const res: SidebarItem[] = [];

    const find = (items: SidebarItem[]) => {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];

        if (item.link && matchPath(item.link, pagePath)) {
          res.push(item);
          return true;
        }

        if (item.items?.length) {
          res.push(item);

          if (find(item.items)) {
            return true;
          }
          res.pop();
        }
      }

      return false;
    };

    find(sidebar);

    return res;
  }, [pagePath, sidebar]);

  const hasSidebar = sidebar && sidebar?.length > 0 && activeSidebar.length > 0;
  const hasToc = !__HASH_ROUTER__ && Boolean(pageModule?.toc?.length);

  return (
    <>
      {hasSidebar && (
        <SidebarIndicator
          activeItems={activeSidebar}
          onOpenChange={setSidebarOpen}
        />
      )}
      <div className="max-w-[90rem] w-full mx-auto flex relative">
        {hasSidebar && (
          <Sidebar
            items={sidebar}
            activeItems={activeSidebar}
            open={sidebarOpen}
            onOpenChange={setSidebarOpen}
          />
        )}
        <div
          key={pagePath}
          className={`flex-1 w-full ${
            hasSidebar ? 'lg:pl-[var(--left-aside-width)]' : ''
          } ${hasSidebar || hasToc ? 'xl:pr-[var(--right-aside-width)]' : ''}`}
        >
          <div className="max-w-[850px] min-w-0 w-full mx-auto pt-8 pb-24 px-6 md:px-8">
            <Mdx className="mb-16">
              <Page fallback={<Loading className="text-xl" />} />
            </Mdx>
            <UpdateInfo />
            <PrevNext />
          </div>
        </div>
        {(hasSidebar || hasToc) && (
          <div className="hidden xl:block absolute top-0 right-0 w-[var(--right-aside-width)] h-full">
            <div className="sticky top-[calc(var(--header-height)+var(--banner-height))] max-h-[calc(100vh-var(--header-height)-var(--banner-height))] pt-8 pb-24 overflow-y-auto">
              <Toc />
            </div>
          </div>
        )}
      </div>
    </>
  );
};
