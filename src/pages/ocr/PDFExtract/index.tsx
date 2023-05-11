import { useState } from "react";
import { Group, Stack, Text, Button } from "@mantine/core";
import { Dropzone, PDF_MIME_TYPE } from "@mantine/dropzone";

import { DetectDocumentTextCommand } from "@aws-sdk/client-textract";
import { TextractClient } from "@aws-sdk/client-textract";

const client = new TextractClient({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

type OCRDataType = string;

export const PDFExtract = () => {
  const [imageData, setImageData] = useState<{ Bytes: Uint8Array }>();
  const [loading, setLoading] = useState<boolean>(false);
  const [ocrResult, setOcrResult] = useState<string>();
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
    readAsArrayBuffer(file).then((result) => {
      setImageData({
        Bytes: new Uint8Array(result as ArrayBuffer),
      });
      setFileName(file.name);
    });
  };

  // TODO MUDAR PARA APONTAR PARA OBJETO EM S3
  const params = {
    Document: imageData,
  };

  const extract = async () => {
    let result: OCRDataType = "";
    try {
      const analyzeDoc = new DetectDocumentTextCommand(params);
      setLoading(true);
      const data = await client.send(analyzeDoc);
      console.log(data);
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
            <b>Extração de texto de PDF.</b>
          </Text>
          <Dropzone
            onDrop={(files) => loadFile(files[0])}
            accept={PDF_MIME_TYPE}
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
                {ocrResult!}
              </Text>
            </Stack>
          )}
        </Stack>
      </Group>
    </>
  );
};
