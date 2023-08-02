type LinkType =
  | {
      title: string;
      description?: string;
      link: string;
      subitems?: never; // Ensure there are no subitems when link is present
    }
  | {
      title: string;
      description?: string;
      link?: never; // Ensure there is no link when subitems are present
      subitems: LinkType[];
    };

export const links: LinkType[] = [
  {
    title: "OCR",
    description: "",
    subitems: [
      {
        title: "OCR pdf",
        link: "/ocr",
        description: "Extract text from image",
      },
    ],
  },
  {
    title: "Audio",
    description: "Extract subtitle from video and transcribe audio",
    subitems: [
      {
        title: "Subtitle generation",
        link: "/audio/subtitle",
        description: "Generate subtitles from a video",
      },
      {
        title: "Audio transcription",
        link: "/audio/transcription",
        description: "Transcribe audio from a voice recording",
      },
    ],
  },
  {
    title: "Image",
    link: "/image",
    description: "Generate images by a text prompt (R$0,20 per image)",
  },
  {
    title: "Chatbot",
    description: "Open chatbot",
    subitems: [
      {
        title: "Open",
        link: "/chatbot/open",
        description: "Default chatbot with gpt-3.5-turbo",
      },
      {
        title: "Flash chatbot (word embeddings)",
        link: "/chatbot/flash",
        description: "Chatbot trained with content from a Notion page",
      },
    ],
  },
  {
    title: "Em desenvolvimento/criação",
    subitems: [
      {
        title: "Resumé",
        link: "/",
        description: "Extract standard data from resumé",
      },
      {
        title: "Machine learning algorithms",
        description: "Chatbot trained with content from a Notion page",
        subitems: [
          {
            title: "Genetic algorithm",
            link: "/ml/genetic",
            description:
              "Prediction of suvivability of Titanic passengers determined by genetic algorithm",
          },
          {
            title: "Support 'scalar' machine with Newcomb-Benford's law",
            link: "/ml/scalar-machine",
            description: "Fraud detection with Newcomb-Benford's law",
          },
        ],
      },
    ],
  },
];
