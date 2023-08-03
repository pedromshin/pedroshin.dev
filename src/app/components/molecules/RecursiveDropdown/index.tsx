"use client";
import { useState } from "react";
import { IconExternalLink, IconChevronDown } from "@tabler/icons-react";
import { LinkType, rootSlug } from "@Src/app/links";
import Link from "next/link";

export default ({ links }: { links: LinkType[] }) => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleSubMenu = (index: number) => {
    if (openItems.includes(index)) {
      setOpenItems(openItems.filter((item) => item !== index));
    } else {
      setOpenItems([...openItems, index]);
    }
  };

  const renderLink = (
    item: LinkType,
    index: number,
    isRoot: boolean,
    currentPath: string
  ) => {
    const hasSubitems = !!item.subitems;
    const isOpen = openItems.includes(index);

    const cardContainerStyle = "hover:bg-gray-normal";
    const cardTitleStyle =
      "flex flex-row items-center gap-2 mb-2 cursor-pointer";
    const subItemTitleStyle =
      "w-fit flex flex-row items-center gap-2 text-base";

    const newPath = `${currentPath}${item.slug}`;

    return (
      <div key={index} className={isRoot ? cardContainerStyle : ""}>
        <div className="mb-2">
          {!hasSubitems ? (
            <Link href={newPath} target="_blank">
              <h1
                className={isRoot ? cardTitleStyle : subItemTitleStyle}
                onClick={() => hasSubitems && toggleSubMenu(index)}
              >
                {index === 0 ? item.title : <span>{item.title}</span>}
                <IconExternalLink size={20} />
              </h1>
            </Link>
          ) : (
            <button onClick={() => hasSubitems && toggleSubMenu(index)}>
              <h1 className={isRoot ? cardTitleStyle : subItemTitleStyle}>
                {item.title}
                <IconChevronDown size={20} />
              </h1>
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
