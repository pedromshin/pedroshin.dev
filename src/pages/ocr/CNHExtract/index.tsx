import { useState } from "react";
import { Group, Stack, Text, Image, Button } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE, PDF_MIME_TYPE } from "@mantine/dropzone";

import { AnalyzeDocumentCommand } from "@aws-sdk/client-textract";
import { TextractClient } from "@aws-sdk/client-textract";
import { postProcessing } from "./postProcessing";
import { TextractableDocument } from "@/entities";
import { fileToBase64 } from "@/utils/fileToBase64";

export type CNHDataType = Array<
  | {
      field: string;
      value?: string;
      error?: never;
    }
  | { field: string; value?: never; error?: string }
>;

export enum CNH_ALIAS_ENUM {
  CNH_DOCUMENT_NUMBER = "CNH_DOCUMENT_NUMBER",
  CNH_OWNER_BIRTHDATE = "CNH_OWNER_BIRTHDATE",
  CNH_DOCUMENT_EXPIRY_DATE = "CNH_DOCUMENT_EXPIRY_DATE",
  CNH_OWNER_CPF = "CNH_OWNER_CPF",
  CNH_OWNER_NAME = "CNH_OWNER_NAME",
}

const client = new TextractClient({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

const queries = [
  { Text: "no registro", Alias: CNH_ALIAS_ENUM.CNH_DOCUMENT_NUMBER },
  {
    Text: "data de nascimento",
    Alias: CNH_ALIAS_ENUM.CNH_OWNER_BIRTHDATE,
  },
  { Text: "validade", Alias: CNH_ALIAS_ENUM.CNH_DOCUMENT_EXPIRY_DATE },
  { Text: "cpf", Alias: CNH_ALIAS_ENUM.CNH_OWNER_CPF },
  { Text: "nome", Alias: CNH_ALIAS_ENUM.CNH_OWNER_NAME },
];

const CNHExtract = () => {
  const [imageUrl, setImageUrl] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [ocrResult, setOcrResult] = useState<CNHDataType>();
  const [fileName, setFileName] = useState<string>("");
  const [textractableDocument, setTextractableDocument] =
    useState<TextractableDocument>();

  const loadFile = async (file: File) => {
    setImageUrl(URL.createObjectURL(file));
    setFileName(file.name);

    const textractableDocument = new TextractableDocument({
      fileType: file.type,
      base64: await fileToBase64(file),
      queries: queries,
    });

    setTextractableDocument(textractableDocument);

    if (await textractableDocument.bytes)
      setImageUrl(
        textractableDocument.mime +
          "," +
          textractableDocument.uint8ArrayToBase64(
            await textractableDocument.bytes
          )
      );
  };

  const extract = async () => {
    let result: CNHDataType = [];
    try {
      const analyzeDoc = new AnalyzeDocumentCommand(
        textractableDocument!.params
      );
      setLoading(true);
      const data = await client.send(analyzeDoc);
      setLoading(false);

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
            <b>CNH frente</b>
          </Text>
          <Text size="24" inline>
            Extrair valores padronizados da <b>frente</b> da CNH
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

          {!!imageUrl && (
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

export default CNHExtract;
