"use client";
import { useState } from "react";
import { IconExternalLink, IconChevronDown } from "@tabler/icons-react";
import { LinkType, rootSlug } from "@App/links";
import Link from "next/link";

export default ({ links }: { links: LinkType[] }) => {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleSubMenu = (slug: string) => {
    if (openItems.includes(slug)) {
      setOpenItems(openItems.filter((item) => item !== slug));
    } else {
      setOpenItems([...openItems, slug]);
    }
  };

  const renderLink = (
    item: LinkType,
    index: number,
    isRoot: boolean,
    currentPath: string
  ) => {
    const hasSubitems = !!item.subitems;
    const isOpen = openItems.includes(item.slug);

    const cardContainerStyle = "hover:bg-gray-normal";

    const buttonStyle = "flex flex-row items-center gap-2 mb-2 cursor-pointer";

    const subItemTitleStyle =
      "w-fit flex flex-row items-center gap-2 text-base text-start";

    const newPath = item.external ? item.slug : `${currentPath}${item.slug}`;

    return (
      <div key={index} className={cardContainerStyle}>
        <div className="mb-2">
          {!hasSubitems ? (
            <Link href={newPath} target="_blank">
              <button
                onClick={() => hasSubitems && toggleSubMenu(item.slug)}
                className={buttonStyle}
              >
                <h1 className={subItemTitleStyle}>
                  {index === 0 ? item.title : <span>{item.title}</span>}
                </h1>
                <IconExternalLink size={20} />
              </button>
            </Link>
          ) : (
            <button
              onClick={() => hasSubitems && toggleSubMenu(item.slug)}
              className={buttonStyle}
            >
              <h1 className={subItemTitleStyle}>{item.title}</h1>
              <IconChevronDown size={20} />
            </button>
          )}
        </div>
        {hasSubitems && isOpen && (
          <ul
            className={
              index === 0
                ? "flex flex-col list-disc ml-6 gap-4"
                : "list-disc ml-6 gap-4"
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
    <>
      {links.map((item: LinkType, i: number) =>
        renderLink(item, i, true, rootSlug)
      )}
    </>
  );
};
