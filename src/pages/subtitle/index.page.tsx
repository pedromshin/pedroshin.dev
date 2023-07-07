import useWhisper from "./useWhisper";
import { Button, Group, Select, Stack, Text } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { RawAxiosRequestHeaders } from "axios";
import { useState } from "react";

const config = {
  apiKey: "",
  autoStart: false,
  autoTranscribe: true,
  mode: "transcriptions",
  nonStop: false,
  removeSilence: false,
  streaming: false,
  timeSlice: 1_000,
  onDataAvailable: undefined,
  onTranscribe: undefined,
};

const OPEN_AI_KEY = process.env.OPEN_AI_KEY;

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
    apiKey: OPEN_AI_KEY,
  });
  const [fileName, setFileName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [audioResult, setAudioResult] = useState<any>();
  const [videoTranscript, setVideoTranscript] = useState<string>();
  const [error, setError] = useState<string>();
  const [language, setLanguage] = useState<string>("pt");

  function bufferToWave(audioBuffer: AudioBuffer) {
    const numOfChan = audioBuffer.numberOfChannels;
    const length = audioBuffer.length * numOfChan * 2 + 44;
    const buffer = new ArrayBuffer(length);
    const view = new DataView(buffer);
    const channels = [];
    let i,
      sample,
      offset = 0,
      pos = 0;

    // Write WAVE header
    setUint32(0x46464952); // "RIFF"
    setUint32(length - 8); // file length - 8
    setUint32(0x45564157); // "WAVE"

    setUint32(0x20746d66); // "fmt " chunk
    setUint32(16); // length = 16
    setUint16(1); // PCM (uncompressed)
    setUint16(numOfChan);
    setUint32(audioBuffer.sampleRate);
    setUint32(audioBuffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
    setUint16(numOfChan * 2); // block-align
    setUint16(16); // 16-bit (hardcoded in this demo)

    setUint32(0x61746164); // "data" - chunk
    setUint32(length - pos - 4); // chunk length

    // Write interleaved data
    for (i = 0; i < audioBuffer.numberOfChannels; i++)
      channels.push(audioBuffer.getChannelData(i));

    while (pos < length) {
      for (i = 0; i < numOfChan; i++) {
        // interleave channels
        sample = Math.max(-1, Math.min(1, channels[i][offset])); // clamp
        sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0; // scale to 16-bit signed int
        view.setInt16(pos, sample, true); // write 16-bit sample
        pos += 2;
      }
      offset++; // next source sample
    }

    // Helper functions
    function setUint16(data: any) {
      view.setUint16(pos, data, true);
      pos += 2;
    }

    function setUint32(data: any) {
      view.setUint32(pos, data, true);
      pos += 4;
    }

    // Return the Blob containing the WAV file
    return new Blob([buffer], { type: "audio/wav" });
  }

  const sampleRate = 16000;
  const numberOfChannels = 1;
  let myBuffer: AudioBuffer;

  const loadFile = async (file: File) => {
    setFileName(file.name);

    const audioContext = new window.AudioContext();
    const reader = new FileReader();
    const videoFileAsBuffer = await new Promise<ArrayBuffer>((resolve) => {
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.readAsArrayBuffer(file);
    });

    const decodedAudioData = await audioContext.decodeAudioData(
      videoFileAsBuffer
    );
    const duration = decodedAudioData.duration;

    myBuffer = decodedAudioData;
    const offlineAudioContext = new OfflineAudioContext(
      numberOfChannels,
      sampleRate * duration,
      sampleRate
    );
    const soundSource = offlineAudioContext.createBufferSource();
    soundSource.buffer = myBuffer;
    soundSource.connect(offlineAudioContext.destination);
    soundSource.start();

    const renderedBuffer = await offlineAudioContext.startRendering();
    const wavFileBlob = bufferToWave(renderedBuffer);
    setAudioResult(new File([wavFileBlob], "audio.wav"));
  };

  const extract = async () => {
    setLoading(true);
    const body = new FormData();
    body.append("file", audioResult);
    body.append("model", "whisper-1");
    if (config.mode === "transcriptions") {
      body.append("language", language);
    }

    const headers: RawAxiosRequestHeaders = {};
    headers["Content-Type"] = "multipart/form-data";
    headers["Authorization"] = `Bearer ${OPEN_AI_KEY}`;
    const { default: axios } = await import("axios");
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/audio/" + config.mode,
        body,
        {
          headers,
        }
      );

      setVideoTranscript(response.data.text);
      setLoading(false);
      return response.data.text;
    } catch (error) {
      setError((error as any)?.response?.data?.error.message);
    }
    setLoading(false);
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
          <Select
            label="Língua falada no vídeo"
            placeholder="Pick one"
            value={language}
            onChange={(value) => setLanguage(value as any)}
            data={[
              { value: "pt", label: "Português" },
              { value: "en", label: "Inglês" },
            ]}
          />
          {/* <Text size="24" inline>
            Extrair valores padronizados do <b>verso</b> do RG (frente é a
            página com foto e polegar, que não carrega nenhum dado a ser
            extraído)
          </Text> */}
          <Dropzone
            onDrop={async (files) => await loadFile(files[0])}
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
          <Stack style={{ flex: "1" }}>
            <Button
              style={{
                background: "blue",
              }}
              onClick={extract}
            >
              {loading ? "Carregando..." : "Extrair"}
            </Button>

            {!!videoTranscript && (
              <Stack>
                <Text size="xl" inline>
                  {videoTranscript}
                </Text>
              </Stack>
            )}
            {error}
          </Stack>
        </Stack>
      </Group>
    </>
  );
};

export default Subtitle;
