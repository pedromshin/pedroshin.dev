import { useState } from "react";
import { Group, Stack, Text, Image, Button } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE, PDF_MIME_TYPE } from "@mantine/dropzone";

import { AnalyzeExpenseCommand, ExpenseField } from "@aws-sdk/client-textract";
import { TextractClient } from "@aws-sdk/client-textract";

const client = new TextractClient({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

type OCRResultType = { item: any; price: any; quantity: any }[];

export const ExpenseExtract = () => {
  const [imageData, setImageData] = useState<{ Bytes: Uint8Array }>();
  const [imageUrl, setImageUrl] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [ocrResult, setOcrResult] = useState<OCRResultType>();
  const [expenseData, setExpenseData] = useState<ExpenseField[]>();
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
  };

  const extract = async () => {
    let result: OCRResultType = [];
    try {
      const analyzeDoc = new AnalyzeExpenseCommand(params);
      setLoading(true);
      const data = await client.send(analyzeDoc);
      setExpenseData(data?.ExpenseDocuments?.[0]?.SummaryFields);
      let expenses: any = [];

      if (data) {
        data?.ExpenseDocuments?.forEach((doc) => {
          doc?.LineItemGroups?.forEach((items) => {
            items?.LineItems?.forEach((fields) => {
              fields?.LineItemExpenseFields?.forEach((expenseFields) => {
                expenses?.push(expenseFields);
              });
            });
          });
        });
      }
      setLoading(false);

      const items = expenses.filter((obj: any) => obj?.Type?.Text === "ITEM");
      const prices = expenses.filter((obj: any) => obj?.Type?.Text === "PRICE");
      const quantities = expenses.filter(
        (obj: any) => obj?.Type?.Text === "QUANTITY"
      );

      result = items.map((item: any, index: any) => ({
        item: item?.ValueDetection?.Text,
        price: parseFloat(prices?.[index]?.ValueDetection?.Text),
        quantity: parseInt(quantities?.[index]?.ValueDetection?.Text),
      }));

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
            <b>Análise de documento de despesa e nota fiscal</b>
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
                        Item
                      </th>
                      <th
                        style={{ textAlign: "start", border: "1px solid gray" }}
                      >
                        Price
                      </th>
                      <th
                        style={{ textAlign: "start", border: "1px solid gray" }}
                      >
                        Quantity
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {ocrResult.map((result, index) => (
                      <tr key={index}>
                        <td
                          style={{
                            textAlign: "start",
                            border: "1px solid gray",
                          }}
                        >
                          {result?.item}
                        </td>
                        <td
                          style={{
                            textAlign: "start",
                            border: "1px solid gray",
                          }}
                        >
                          {result?.price}
                        </td>
                        <td
                          style={{
                            textAlign: "start",
                            border: "1px solid gray",
                          }}
                        >
                          {result?.quantity}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <table>
                  <thead>
                    <tr>
                      <th
                        style={{ textAlign: "start", border: "1px solid gray" }}
                      >
                        LabelDetection
                      </th>
                      <th
                        style={{ textAlign: "start", border: "1px solid gray" }}
                      >
                        Type (Standandized key)
                      </th>
                      <th
                        style={{ textAlign: "start", border: "1px solid gray" }}
                      >
                        ValueDetection
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenseData?.map((item, index) => (
                      <tr key={index}>
                        <td
                          style={{
                            textAlign: "start",
                            border: "1px solid gray",
                          }}
                        >
                          {item?.LabelDetection?.Text}
                        </td>
                        <td
                          style={{
                            textAlign: "start",
                            border: "1px solid gray",
                          }}
                        >
                          {item?.Type?.Text}
                        </td>
                        <td
                          style={{
                            textAlign: "start",
                            border: "1px solid gray",
                          }}
                        >
                          {item?.ValueDetection?.Text}
                        </td>
                      </tr>
                    ))}
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
