import { useState } from "react";
import { Group, Stack, Text, Image, Button } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE, PDF_MIME_TYPE } from "@mantine/dropzone";

import {
  AnalyzeDocumentCommand,
  TextractClient,
} from "@aws-sdk/client-textract";
import { ufStates } from "./ufStates";
import { issuingAgency } from "./issuingAgency";

const client = new TextractClient({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

type RGDataType = { field: string; value: string }[];

const RGExtract = () => {
  const [imageData, setImageData] = useState<{ Bytes: Uint8Array }>();
  const [imageUrl, setImageUrl] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [ocrResult, setOcrResult] = useState<RGDataType>();
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
    Document: imageData!,
    FeatureTypes: ["QUERIES"],
    QueriesConfig: {
      Queries: [
        { Text: "registro geral", Alias: "RG_NUMBER" },
        { Text: "data de expedicao", Alias: "EXPEDITION_DATE" },
        { Text: "naturalidade", Alias: "PLACE_OF_BIRTH" },
        { Text: "data de nascimento", Alias: "BIRTHDATE" },
        { Text: "nome", Alias: "NAME" },
        {
          Text: "what is the content of the second line of filiacao?",
          Alias: "FATHER_NAME",
        },
        {
          Text: "what is the content of the first line of filiacao?",
          Alias: "MOTHER_NAME",
        },
        {
          Text: "city and state in 'doc origem'",
          Alias: "DOCUMENT_ORIGIN",
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
      setLoading(false);

      // check to match with orgao emissor
      // data?.Blocks?.map((block) => {
      //   issuingAgency.map((agency) => {
      //     const match = block.Text?.match(agency.sigla);
      //     if (block.Text?.includes(agency.sigla)) {
      //       console.log(match);
      //     }
      //   });
      // });

      const queryResults = data.Blocks?.filter(
        (block) =>
          block.BlockType === "QUERY" || block.BlockType === "QUERY_RESULT"
      );

      for (const block of queryResults ?? []) {
        if (block.BlockType === "QUERY") {
          const answerIds = block.Relationships?.[0]?.Ids ?? [];
          const queryResultBlock = queryResults?.find(
            (resultBlock) =>
              resultBlock.BlockType === "QUERY_RESULT" &&
              answerIds.includes(resultBlock?.Id ?? "")
          );
          const queryResultValue = queryResultBlock?.Text ?? "";
          result.push({
            field: block.Query?.Alias ?? "",
            value: queryResultValue,
          });

          if (block.Query?.Alias! === "DOCUMENT_ORIGIN") {
            const ufPattern = ufStates.join("|");
            const pattern = new RegExp(`(${ufPattern})\\b`);
            const uf = queryResultValue?.match(pattern);

            result.push({
              field: "EMISSION_UF_STATE",
              value: uf?.[1] ?? "",
            });
          }

          if (
            block.Query?.Alias! === "FATHER_NAME" ||
            block.Query?.Alias! === "MOTHER_NAME" ||
            block.Query?.Alias! === "NAME"
          ) {
            const queryResultBlockLine = data.Blocks?.find((resultBlock) => {
              const resultBlockTop =
                resultBlock.Geometry?.BoundingBox?.Top?.toFixed(3);
              const resultBlockLeft =
                resultBlock.Geometry?.BoundingBox?.Left?.toFixed(3);
              const queryResultBlockTop =
                queryResultBlock?.Geometry?.BoundingBox?.Top?.toFixed(3);
              const queryResultBlockLeft =
                queryResultBlock?.Geometry?.BoundingBox?.Left?.toFixed(3);

              return (
                resultBlock.BlockType === "LINE" &&
                Math.abs(+resultBlockTop! - +queryResultBlockTop!) < 0.02 &&
                Math.abs(+resultBlockLeft! - +queryResultBlockLeft!) < 0.02
              );
            });

            result.push({
              field: `NORMALIZED_${block.Query?.Alias}` ?? "",
              value: queryResultBlockLine?.Text ?? "",
            });
          }
        }
      }

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
