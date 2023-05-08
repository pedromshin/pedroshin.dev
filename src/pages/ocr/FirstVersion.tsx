import { useState } from "react";
import { Group, Stack, Text, Image, Button } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE, PDF_MIME_TYPE } from "@mantine/dropzone";

import { AnalyzeDocumentCommand } from "@aws-sdk/client-textract";
import { TextractClient } from "@aws-sdk/client-textract";

//trigger
interface Block {
  Id: string;
  BlockType: string;
  EntityTypes: string[];
  Relationships?: Relationship[];
  SelectionStatus?: string;
  Text?: string;
}

interface Relationship {
  Type: string;
  Ids: string[];
}

interface KeyMap {
  [blockId: string]: Block;
}

interface ValueMap {
  [blockId: string]: Block;
}

interface BlockMap {
  [blockId: string]: Block;
}

const client = new TextractClient({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

const FirstVersion = () => {
  const [imageData, setImageData] = useState<{ Bytes: Uint8Array }>();
  const [imageUrl, setImageUrl] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [ocrResult, setOcrResult] =
    useState<{ field: string; value: string }[]>();

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
  };

  const params = {
    Document: imageData,
    FeatureTypes: ["FORMS"],
  };

  function get_kv_map(response: any): [KeyMap, ValueMap, BlockMap] {
    const blocks = response.Blocks;

    // get key and value maps
    const key_map: KeyMap = {};
    const value_map: ValueMap = {};
    const block_map: BlockMap = {};
    for (const block of blocks) {
      const block_id = block.Id;
      block_map[block_id] = block;
      if (block.BlockType == "KEY_VALUE_SET") {
        if (block.EntityTypes.includes("KEY")) {
          key_map[block_id] = block;
        } else {
          value_map[block_id] = block;
        }
      }
    }

    return [key_map, value_map, block_map];
  }

  function get_kv_relationship(
    key_map: KeyMap,
    value_map: ValueMap,
    block_map: BlockMap
  ): Record<string, string[]> {
    const kvs: Record<string, string[]> = {};
    for (const [block_id, key_block] of Object.entries(key_map)) {
      const value_block = find_value_block(key_block, value_map);
      const key = get_text(key_block, block_map);
      const val = get_text(value_block, block_map);
      kvs[key] = [...(kvs[key] || []), val];
    }
    return kvs;
  }

  function find_value_block(key_block: Block, value_map: ValueMap): Block {
    for (const relationship of key_block.Relationships || []) {
      if (relationship.Type == "VALUE") {
        for (const value_id of relationship.Ids) {
          const value_block = value_map[value_id];
          return value_block;
        }
      }
    }
    throw new Error("No value block found");
  }

  function get_text(result: Block, blocks_map: BlockMap): string {
    let text = "";
    if (result.Relationships) {
      for (const relationship of result.Relationships) {
        if (relationship.Type == "CHILD") {
          for (const child_id of relationship.Ids) {
            const word = blocks_map[child_id];
            if (word.BlockType == "WORD") {
              text += word.Text + " ";
            }
            if (word.BlockType == "SELECTION_ELEMENT") {
              if (word.SelectionStatus == "SELECTED") {
                text += "X ";
              }
            }
          }
        }
      }
    }
    return text;
  }

  const extract = async () => {
    try {
      const analyzeDoc = new AnalyzeDocumentCommand(params);
      setLoading(true);
      const data = await client.send(analyzeDoc);
      setLoading(false);
      const [key_map, value_map, block_map] = get_kv_map(data);
      const kv_relations = get_kv_relationship(key_map, value_map, block_map);
      let result = [];

      for (const [key, value] of Object.entries(kv_relations)) {
        result.push({ field: key.slice(0, -1), value: value[0] });
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
          <Text size="xl" inline>
            Primeira versão de testes - detecta tudo que consegue relacionar uma
            chave-valor
          </Text>
          <Dropzone
            onDrop={(files) => loadFile(files[0])}
            accept={[...IMAGE_MIME_TYPE, ...PDF_MIME_TYPE]}
            multiple={false}
          >
            <Text size="xl" inline>
              Drag image here or click to select file
            </Text>
          </Dropzone>

          {!!imageData && (
            <Image src={imageUrl} style={{ width: "100%" }} alt="dropzone" />
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

export default FirstVersion;
