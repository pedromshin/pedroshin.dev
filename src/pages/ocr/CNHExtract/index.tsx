import { useState } from "react";
import { Group, Stack, Text, Image, Button } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE, PDF_MIME_TYPE } from "@mantine/dropzone";

import { AnalyzeDocumentCommand } from "@aws-sdk/client-textract";
import { TextractClient } from "@aws-sdk/client-textract";
import { postProcessing } from "./postProcessing";

export type CNHDataType = Array<
  | {
      field: string;
      value?: string;
      error?: never;
    }
  | { field: string; value?: never; error?: string }
>;

export enum CNH_ALIAS_ENUM {
  CNH_DOCUMENT_NUMBER = "RG_DOCUMENT_NUMBER",
  CNH_OWNER_BIRTHDATE = "RG_DOCUMENT_EXPEDITION_DATE",
  CNH_DOCUMENT_EXPIRY_DATE = "RG_OWNER_PLACE_OF_BIRTH",
  CNH_OWNER_CPF = "RG_OWNER_BIRTHDATE",
  CNH_OWNER_NAME = "RG_OWNER_NAME",
}

const client = new TextractClient({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

const CNHExtract = () => {
  const [imageData, setImageData] = useState<{ Bytes: Uint8Array }>();
  const [imageUrl, setImageUrl] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [ocrResult, setOcrResult] = useState<CNHDataType>();
  const [fileName, setFileName] = useState<string>("");

  const readAsArrayBuffer = (file: File) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const loadFile = (file: File) => {
    setImageUrl(URL.createObjectURL(file));
    readAsArrayBuffer(file).then((result) => {
      setImageData({
        Bytes: new Uint8Array(result as ArrayBuffer),
      });
    });
    setFileName(file.name);
  };

  const params = {
    Document: imageData,
    FeatureTypes: ["QUERIES"],
    QueriesConfig: {
      Queries: [
        { Text: "no registro", Alias: CNH_ALIAS_ENUM.CNH_DOCUMENT_NUMBER },
        {
          Text: "data de nascimento",
          Alias: CNH_ALIAS_ENUM.CNH_OWNER_BIRTHDATE,
        },
        { Text: "validade", Alias: CNH_ALIAS_ENUM.CNH_DOCUMENT_EXPIRY_DATE },
        { Text: "cpf", Alias: CNH_ALIAS_ENUM.CNH_OWNER_CPF },
        { Text: "nome", Alias: CNH_ALIAS_ENUM.CNH_OWNER_NAME },
      ],
    },
  };

  const extract = async () => {
    let result: CNHDataType = [];
    try {
      const analyzeDoc = new AnalyzeDocumentCommand(params);
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

export default CNHExtract;
