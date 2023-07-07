import useWhisper from "./useWhisper";

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

  console.log({ recording, speaking, transcribing, transcript });

  return (
    <div>
      <p>Recording: {recording ? "Gravando" : ""}</p>
      <p>Speaking: {speaking ? "Falando" : ""}</p>
      <p>Transcripting: {transcribing}</p>
      <p>Transcribed Text: {transcript.text}</p>
      <button onClick={() => startRecording()}>Start</button>
      <button onClick={() => pauseRecording()}>Pause</button>
      <button onClick={() => stopRecording()}>Stop</button>
    </div>
  );
};

export default Subtitle;
