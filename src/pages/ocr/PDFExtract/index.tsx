import { useState } from "react";
import { Group, Stack, Text, Button, Image } from "@mantine/core";
import { Dropzone, PDF_MIME_TYPE } from "@mantine/dropzone";

import { Block, DetectDocumentTextCommand } from "@aws-sdk/client-textract";
import { TextractClient } from "@aws-sdk/client-textract";

import * as pdfjsLib from "pdfjs-dist";
import * as pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const client = new TextractClient({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

export const PDFExtract = () => {
  const [imageUrl, setImageUrl] = useState<string>();
  const [imageData, setImageData] = useState<{ Bytes: Uint8Array }>();
  const [loading, setLoading] = useState<boolean>(false);
  const [ocrResult, setOcrResult] = useState<Block[]>();
  const [fileName, setFileName] = useState<string>("");

  const dataURItoBlob = (dataURI: string) => {
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };
  const loadFile = async (file: File) => {
    const data = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data });
    const loadedPdf = await loadingTask.promise;
    const firstPage = await loadedPdf.getPage(1);
    const viewport = firstPage.getViewport({ scale: 1 });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d")!;
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await firstPage.render({ canvasContext: context, viewport }).promise;
    const jpg = canvas.toDataURL("image/jpeg");
    const blob = dataURItoBlob(jpg);
    const url = URL.createObjectURL(blob);
    setImageUrl(url);
    setFileName(file.name);
    await fetch(url)
      .then((res) => {
        return res.arrayBuffer();
      })
      .then((buf) => {
        setImageUrl(url);
        setImageData({
          Bytes: new Uint8Array(buf),
        });
      });
  };

  const params = {
    Document: imageData,
  };

  const extract = async () => {
    try {
      const analyzeDoc = new DetectDocumentTextCommand(params);
      setLoading(true);
      const data = await client.send(analyzeDoc);
      setLoading(false);

      setOcrResult(data?.Blocks);
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
                {ocrResult.map((block) => (
                  <div key={block.Id}>
                    {block.Text && <p>{block.Text}</p>}
                    {block.Relationships &&
                      block?.Relationships?.[0]?.Ids?.map((id) => (
                        <p key={id}>
                          {ocrResult?.find((block) => block?.Id === id)?.Text}
                        </p>
                      ))}
                  </div>
                ))}
              </Text>
            </Stack>
          )}
        </Stack>
      </Group>
    </>
  );
};
