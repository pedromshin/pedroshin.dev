import { useState } from "react";
import { Group, Stack, Text, Image, Button } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE, PDF_MIME_TYPE } from "@mantine/dropzone";

import * as pdfjsLib from "pdfjs-dist";

import {
  AnalyzeDocumentCommand,
  TextractClient,
} from "@aws-sdk/client-textract";
import { postProcessing } from "./postProcessing";
import { convertDataUrlToBytes } from "@/utils/convertDataUrlToBytes";
import { readAsArrayBuffer } from "@/utils/readFileAsArrayBuffer";

const client = new TextractClient({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

export type RGDataType = Array<
  | {
      field: string;
      value?: string;
      error?: never;
    }
  | { field: string; value?: never; error?: string }
>;

export enum RG_ALIAS_ENUM {
  RG_DOCUMENT_NUMBER = "RG_DOCUMENT_NUMBER",
  RG_DOCUMENT_EXPEDITION_DATE = "RG_DOCUMENT_EXPEDITION_DATE",
  RG_OWNER_PLACE_OF_BIRTH = "RG_OWNER_PLACE_OF_BIRTH",
  RG_OWNER_BIRTHDATE = "RG_OWNER_BIRTHDATE",
  RG_OWNER_NAME = "RG_OWNER_NAME",
  RG_OWNER_FATHER_NAME = "RG_OWNER_FATHER_NAME",
  RG_OWNER_MOTHER_NAME = "RG_OWNER_MOTHER_NAME",
  RG_DOCUMENT_ORIGIN = "RG_DOCUMENT_ORIGIN",
}

const RGExtract = () => {
  const [imageData, setImageData] = useState<{ Bytes: Uint8Array }>();
  const [imageUrl, setImageUrl] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [ocrResult, setOcrResult] = useState<RGDataType>();
  const [fileName, setFileName] = useState<string>("");

  const loadFile = (file: File) => {
    setImageUrl(URL.createObjectURL(file));
    setFileName(file.name);

    readAsArrayBuffer(file).then((arrayBuffer) => {
      if (file.type === "application/pdf") {
        // Use pdfjs-dist to extract the first page as an image
        const uint8Array = new Uint8Array(arrayBuffer);

        // Use pdfjs-dist to extract the first page as an image
        const loadingTask = pdfjsLib.getDocument(uint8Array);

        loadingTask.promise.then((pdf) => {
          pdf.getPage(1).then((page) => {
            const viewport = page.getViewport({ scale: 1 });
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");

            canvas.height = viewport.height;
            canvas.width = viewport.width;

            page
              .render({
                canvasContext: context!,
                viewport: viewport,
              })
              .promise.then(() => {
                const imageDataUrl = canvas.toDataURL("image/png");
                setImageUrl(imageDataUrl);
                setImageData({ Bytes: convertDataUrlToBytes(imageDataUrl) });
              });
          });
        });
      } else {
        setImageData({
          Bytes: new Uint8Array(arrayBuffer as ArrayBuffer),
        });
      }
    });
  };

  const params = {
    Document: imageData!,
    FeatureTypes: ["QUERIES"],
    QueriesConfig: {
      Queries: [
        { Text: "registro geral", Alias: RG_ALIAS_ENUM.RG_DOCUMENT_NUMBER },
        {
          Text: "data de expedicao",
          Alias: RG_ALIAS_ENUM.RG_DOCUMENT_EXPEDITION_DATE,
        },
        { Text: "naturalidade", Alias: RG_ALIAS_ENUM.RG_OWNER_PLACE_OF_BIRTH },
        { Text: "data de nascimento", Alias: RG_ALIAS_ENUM.RG_OWNER_BIRTHDATE },
        { Text: "nome", Alias: RG_ALIAS_ENUM.RG_OWNER_NAME },
        {
          Text: "what is the content of the first line of filiacao?",
          Alias: RG_ALIAS_ENUM.RG_OWNER_FATHER_NAME,
        },
        {
          Text: "what is the content of the second line of filiacao?",
          Alias: RG_ALIAS_ENUM.RG_OWNER_MOTHER_NAME,
        },
        {
          Text: "city and state in 'doc origem'",
          Alias: RG_ALIAS_ENUM.RG_DOCUMENT_ORIGIN,
        },
      ],
    },
  };

  const extract = async () => {
    let result: RGDataType = [];
    try {
      const analyzeDoc = new AnalyzeDocumentCommand(params);

      setLoading(true);

      const data = await client.send(analyzeDoc);

      const blocks = data.Blocks;

      if (blocks) {
        result.push(...postProcessing(blocks));
      }

      setLoading(false);

      setOcrResult(result);
    } catch (error) {
      setLoading(false);
    } finally {
    }
  };

  return (
    <>
      <Group align="initial" style={{ padding: "50px" }}>
        <Stack style={{ flex: "1" }}>
          <Text size="40" inline>
            <b>RG verso</b>
          </Text>
          <Text size="24" inline>
            Extrair valores padronizados do <b>verso</b> do RG (frente é a
            página com foto e polegar, que não carrega nenhum dado a ser
            extraído)
          </Text>
          <Dropzone
            onDrop={(files) => loadFile(files[0])}
            accept={[...IMAGE_MIME_TYPE, ...PDF_MIME_TYPE]}
            multiple={false}
          >
            {!!fileName ? (
              <Text size="xl" inline>
                {fileName}
              </Text>
            ) : (
              <Text size="xl" inline>
                Drag image here or click to select file
              </Text>
            )}
          </Dropzone>

          {!!imageData && (
            <Image
              src={imageUrl}
              style={{ width: "100%", maxWidth: 400, height: "auto" }}
              alt="dropzone"
            />
          )}
        </Stack>

        <Stack style={{ flex: "1" }}>
          <Button
            style={{
              background: "blue",
            }}
            onClick={extract}
          >
            {loading ? "Carregando..." : "Extrair"}
          </Button>

          {!!ocrResult && (
            <Stack>
              <Text size="xl">RESULT</Text>
              <Text
                style={{
                  fontFamily: "monospace",
                  padding: "10px",
                }}
              >
                <table>
                  <thead>
                    <tr>
                      <th
                        style={{ textAlign: "start", border: "1px solid gray" }}
                      >
                        Campo
                      </th>
                      <th
                        style={{ textAlign: "start", border: "1px solid gray" }}
                      >
                        Valor
                      </th>
                      <th
                        style={{ textAlign: "start", border: "1px solid gray" }}
                      >
                        Erro
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {ocrResult.map((entry, index) => {
                      return (
                        <tr key={index}>
                          <td
                            style={{
                              textAlign: "start",
                              border: "1px solid gray",
                            }}
                          >
                            {entry.field}
                          </td>
                          <td
                            style={{
                              textAlign: "start",
                              border: "1px solid gray",
                            }}
                          >
                            {entry.value}
                          </td>
                          <td
                            style={{
                              textAlign: "start",
                              border: "1px solid gray",
                            }}
                          >
                            {entry.error}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </Text>
            </Stack>
          )}
        </Stack>
      </Group>
    </>
  );
};

export default RGExtract;
