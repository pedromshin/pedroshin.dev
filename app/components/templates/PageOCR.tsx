"use client";
import { useState } from "react";

import Dropzone from "@Components/atoms/Dropzone";
import OCRResultTable from "@Components/molecules/OCRResultTable";
import Heading from "@Components/organisms/Heading";
import { TextractableDocumentResultType } from "@App/types/TextractableDocumentResultType";
import Input from "../atoms/Input";
import Accordion, {
  AccordionBody,
  AccordionHeader,
} from "@material-tailwind/react/components/Accordion";
import { IconArrowDown } from "@tabler/icons-react";

export default ({
  fetchURL,
  queries,
  title,
  description,
}: {
  fetchURL: string;
  title: string;
  description?: string;
  queries: { Text: string; Alias: string }[];
}) => {
  const [loading, setLoading] = useState(false);
  const [OCRResult, setOCRResult] = useState<TextractableDocumentResultType[]>(
    []
  );
  const [documentQueries, setDocumentQueries] = useState(queries);

  const [openConfig, setOpenConfig] = useState<boolean>(false);

  return (
    <>
      <Heading title={title} description={description}>
        <div className="flex flex-col w-full gap-8">
          <Accordion open={openConfig} className="pt-12 px-12">
            <AccordionHeader
              onClick={() => setOpenConfig((prev) => !prev)}
              className="text-2xl md:text-4xl font-bold mb-2 md:mb-4 text-white hover:text-white justify-between [&>span]:hidden"
            >
              <h1>Customise queries</h1>
              <IconArrowDown />
            </AccordionHeader>
            <AccordionBody>
              <div className="flex flex-col gap-8 w-full mt-2 text-base md:text-xl text-white hover:text-white">
                {documentQueries.map((query) => {
                  return (
                    <Input
                      key={query.Alias}
                      label={`Query for: ${query.Alias}`}
                      value={query.Text}
                      onChange={(e) => {
                        setDocumentQueries(
                          documentQueries.map((documentQuery) => {
                            if (documentQuery.Alias !== query.Alias)
                              return documentQuery;
                            return {
                              ...documentQuery,
                              Text: e.target.value,
                            };
                          })
                        );
                      }}
                    />
                  );
                })}
              </div>
            </AccordionBody>
          </Accordion>
          <Dropzone
            multiple
            accept="image/png, image/jpeg, application/pdf"
            onSubmit={async (_, base64s) => {
              if (base64s.length === 0) setOCRResult([]);
              setLoading(true);
              const results = Promise.all(
                base64s.map(async (base64) => {
                  const result = await fetch(fetchURL, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      document: base64.split(",")[1],
                      queries: documentQueries,
                    }),
                  });

                  return await result.json();
                })
              );

              setOCRResult(await results.finally(() => setLoading(false)));
            }}
            submitText="Extrair"
            loading={loading}
          />
          {OCRResult.map((OCRResult, index) => (
            <OCRResultTable key={index} data={OCRResult} />
          ))}
        </div>
      </Heading>
    </>
  );
};
