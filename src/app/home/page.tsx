"use client";
import PageContainer from "@Components/templates/PageContainer";
import { links } from "../links";

import {
  IconArrowRight,
  IconExternalLink,
  IconSearch,
} from "@tabler/icons-react";

export default function Page() {
  const buttons = links.map((item, i) => {
    const hasSubitems = !!item.subitems;

    return (
      <div
        key={i}
        className="h-fit border rounded-3xl p-8 hover:bg-gray-normal"
      >
        <div className="mb-2">
          <a href={item.link} target="_blank" className="w-fit flex">
            <h1 className="flex flex-row items-center gap-4 font-bold text-4xl mb-2">
              {item.title}
              {!hasSubitems && <IconExternalLink />}
            </h1>
          </a>
          <p className="opacity-50">{item.description}</p>
        </div>
        {hasSubitems && (
          <ul className="flex flex-col list-disc ml-6 gap-4">
            {item.subitems.map((subitem, j) => (
              <li key={j}>
                <a
                  href={subitem.link}
                  className="w-fit flex flex-row items-center gap-2 text-base"
                  target="_blank"
                >
                  {subitem.title}
                  <IconExternalLink size={20} />
                </a>
                <p className="opacity-50">{subitem.description}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  });

  return (
    <PageContainer>
      <div className="flex flex-row flex-wrap justify-around p-24 gap-x-4 gap-y-8">
        {buttons}
      </div>
    </PageContainer>
  );
}
