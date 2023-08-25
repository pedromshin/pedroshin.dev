import { ListBlockChildrenResponse } from "@notionhq/client/build/src/api-endpoints";

type NotionBlocksType = ListBlockChildrenResponse["results"];

export default (blocks: NotionBlocksType): string[] => {
  const texts: string[] = [];

  const recursivelyFindText = (block: NotionBlocksType[0]) => {
    if (typeof block === "object" && block !== null) {
      if (block.hasOwnProperty("plain_text")) {
        texts.push((block as any).plain_text as string);
      } else {
        for (const key in block) {
          recursivelyFindText((block as any)[key]);
        }
      }
    }
  };

  blocks.forEach((block) => recursivelyFindText(block));

  return texts;
};
