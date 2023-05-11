import { useState } from "react";
import { Group, Stack, Text, Image, Button } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE, PDF_MIME_TYPE } from "@mantine/dropzone";

import { AnalyzeDocumentCommand } from "@aws-sdk/client-textract";
import { TextractClient } from "@aws-sdk/client-textract";
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

const RGHighContrastExtract = () => {
  const [imageData, setImageData] = useState<{ Bytes: Uint8Array }>();
  const [imageUrl, setImageUrl] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [ocrResult, setOcrResult] = useState<RGDataType>();
  const [fileName, setFileName] = useState<string>("");

  const loadFile = (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const img = new window.Image();
      img.src = reader.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const avg = (r + g + b) / 3;
          data[i] = data[i + 1] = data[i + 2] = avg > 128 ? 255 : 0;
        }
        ctx.putImageData(imageData, 0, 0);
        const url = canvas.toDataURL();
        setImageUrl(url);
        fetch(url)
          .then((res) => res.arrayBuffer())
          .then((buf) => {
            setImageData({
              Bytes: new Uint8Array(buf),
            });
          });
      };
    };
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

      queryResults?.map((block, index) => {
        const queryResultValue = queryResults?.[index + 1]?.Text;

        if (block.BlockType === "QUERY") {
          result.push({
            field: block.BlockType === "QUERY" ? block.Query?.Alias! : "",
            value: queryResultValue ?? "",
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
        }
      });

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
            <b>RG verso P&B Alto Contraste</b>
          </Text>
          <Text size="24" inline>
            Análise do RG com tratamento de preto e branco de alto contraste
            prévio à análise de OCR.
          </Text>
          <Text size="24" inline>
            Acabou sendo pior do que a análise em cor normal, mas talvez a gente
            encontre um uso pra ela
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

export default RGHighContrastExtract;
