"use client";
import PageContainer from "@Components/templates/PageContainer";
import { LinkType, links, rootSlug } from "../links";

import {
  IconArrowRight,
  IconExternalLink,
  IconSearch,
} from "@tabler/icons-react";
import Link from "next/link";

export default function Page() {
  const renderLink = (
    item: LinkType,
    index: number,
    isRoot: boolean,
    currentPath: string
  ) => {
    const hasSubitems = !!item.subitems;

    const cardContainerStyle =
      "border rounded-3xl py-6 px-8 hover:bg-gray-normal h-fit";
    const cardTitleStyle =
      "flex flex-row items-center gap-2 md:gap-4 font-bold text-xl md:text-4xl mb-2";
    const subItemTitleStyle =
      "w-fit flex flex-row items-center gap-2 text-sm md:text-base";

    const newPath = `${currentPath}${item.slug}`;

    return (
      <div key={index} className={isRoot ? cardContainerStyle : ""}>
        <div className="mb-2">
          {!hasSubitems ? (
            <Link href={newPath} target="_blank" className="w-fit flex">
              <h1 className={isRoot ? cardTitleStyle : subItemTitleStyle}>
                {index === 0 ? item.title : <span>{item.title}</span>}
                <IconExternalLink size={20} />
              </h1>
            </Link>
          ) : (
            <h1 className={isRoot ? cardTitleStyle : subItemTitleStyle}>
              {item.title}
            </h1>
          )}
          <p className="opacity-50">{item.description}</p>
        </div>
        {hasSubitems && (
          <ul
            className={
              index === 0
                ? "flex flex-col list-disc ml-4 md:ml-6 gap-2 md:gap-4"
                : "list-disc ml-4 md:ml-6 gap-2 md:gap-4"
            }
          >
            {item.subitems!.map((subitem: LinkType, j: number) => (
              <li key={j}>{renderLink(subitem, j, false, newPath)}</li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  return (
    <PageContainer>
      <div className="flex flex-row flex-wrap justify-around p-16 md:p-24 gap-x-4 gap-y-8">
        {links.map((item, i) => renderLink(item, i, true, rootSlug))}
      </div>
    </PageContainer>
  );
}
