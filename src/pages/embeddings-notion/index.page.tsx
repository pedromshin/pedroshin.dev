import { useState } from "react";
import { NotionPageResponse, ParagraphBlock } from "./types";

const EmbeddingsNotion = (data: NotionPageResponse) => {
  const [pageContent, setPageContent] = useState<NotionPageResponse>(data);

  return (
    <>
      {
        (pageContent?.results?.[0] as ParagraphBlock).paragraph.rich_text[0]
          .plain_text
      }
    </>
  );
};

export default EmbeddingsNotion;

export async function getServerSideProps() {
  const res = await import("../api/notion/fetch.page");
  const data = await res.default();

  return { props: data };
}
