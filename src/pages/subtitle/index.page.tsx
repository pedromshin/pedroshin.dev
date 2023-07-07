import useWhisper from "./useWhisper";
import { Group, Stack, Text } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE, PDF_MIME_TYPE } from "@mantine/dropzone";
import { useState } from "react";

const Subtitle = () => {
  const {
    recording,
    speaking,
    transcript,
    transcribing,
    pauseRecording,
    startRecording,
    stopRecording,
  } = useWhisper({
    apiKey: process.env.OPEN_AI_KEY,
  });

  const [fileName, setFileName] = useState<string>("");
  const [videoUrl, setVideoUrl] = useState<string>();

  const loadFile = (file: File) => {
    setVideoUrl(URL.createObjectURL(file));
    setFileName(file.name);

    console.log(file);
  };

  return (
    <>
      <Group align="initial" style={{ padding: "50px" }}>
        <Stack style={{ flex: "1" }}>
          <div style={{ marginBottom: "50px" }}>
            <p>Recording: {recording ? "Gravando" : ""}</p>
            <p>Speaking: {speaking ? "Falando" : ""}</p>
            <p>Transcripting: {transcribing}</p>
            <p>Transcribed Text: {transcript.text}</p>
            <button onClick={() => startRecording()}>Start</button>
            <button onClick={() => pauseRecording()}>Pause</button>
            <button onClick={() => stopRecording()}>Stop</button>
          </div>
          <Text size="40" inline>
            <b>Vídeo com audio</b>
          </Text>
          {/* <Text size="24" inline>
            Extrair valores padronizados do <b>verso</b> do RG (frente é a
            página com foto e polegar, que não carrega nenhum dado a ser
            extraído)
          </Text> */}
          <Dropzone
            onDrop={(files) => loadFile(files[0])}
            accept={["video/mp4"]}
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
      </Group>
    </>
  );
};

export default Subtitle;
