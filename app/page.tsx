"use client";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@Api/auth/[...nextauth]/route";
// import { redirect } from "next/navigation";
import { LinkType, links, rootSlug } from "@App/links";

import { IconExternalLink } from "@tabler/icons-react";
import Link from "next/link";

export default () => {
  // const session = await getServerSession(authOptions);
  // if (!session) redirect("/login");

  const renderLink = (
    item: LinkType,
    index: number,
    isRoot: boolean,
    currentPath: string
  ) => {
    const hasSubitems = !!item.subitems;

    const cardContainerStyle =
      "border rounded-3xl py-6 px-8 hover:bg-gray-normal h-fit m-auto max-w-full overflow-scroll no-scrollbar";
    const cardTitleStyle =
      "flex flex-row items-center gap-2 md:gap-4 font-bold text-xl md:text-4xl mb-2 break-words";
    const subItemTitleStyle =
      "w-fit flex flex-row items-center gap-2 text-sm md:text-base";

    const newPath = item.external ? item.slug : `${currentPath}${item.slug}`;

    return (
      <div key={index} className={isRoot ? cardContainerStyle : ""}>
        <div className="mb-2">
          {!hasSubitems && (
            <Link href={newPath} target="_blank" className="w-fit">
              <h1 className={isRoot ? cardTitleStyle : subItemTitleStyle}>
                {!isRoot && (
                  <IconExternalLink
                    size={20}
                    className="min-w-[20px] xs:hidden"
                  />
                )}
                {index === 0 ? item.title : <span>{item.title}</span>}
                {isRoot && (
                  <IconExternalLink
                    size={20}
                    className="min-w-[20px] xs:hidden"
                  />
                )}
                <IconExternalLink
                  size={20}
                  className="min-w-[20px] hidden xs:block"
                />
              </h1>
            </Link>
          )}
          {hasSubitems && (
            <h1 className={isRoot ? cardTitleStyle : subItemTitleStyle}>
              {item.title}
            </h1>
          )}
          <p className="opacity-60 flex max-w-sm">{item.description}</p>
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
    <div className="flex flex-row flex-wrap justify-around p-16 md:p-24 gap-x-4 gap-y-8">
      {links.map((item, i) => renderLink(item, i, true, rootSlug))}
    </div>
  );
};
