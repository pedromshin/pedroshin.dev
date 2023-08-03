export type LinkType = {
  title: string;
  description?: string;
  slug: string;
  subitems?: LinkType[];
};

export const links: LinkType[] = [
  {
    title: "OCR",
    description: "",
    slug: "/ocr",
    subitems: [
      {
        title: "CNH",
        slug: "/cnh",
        description: "Extract text from image",
      },
    ],
  },
  {
    title: "Audio",
    description: "Extract subtitle from video and transcribe audio",
    slug: "/audio",
    subitems: [
      {
        title: "Subtitle generation",
        slug: "/subtitle",
        description: "Generate subtitles from a video",
      },
      {
        title: "Audio transcription",
        slug: "/transcription",
        description: "Transcribe audio from a voice recording",
      },
    ],
  },
  {
    title: "Image",
    slug: "/image",
    description: "Generate images by a text prompt (R$0,20 per image)",
  },
  {
    title: "Chatbot",
    description: "Open chatbot",
    slug: "/chatbot",
    subitems: [
      {
        title: "Open",
        slug: "/open",
        description: "Default chatbot with gpt-3.5-turbo",
      },
      {
        title: "Flash chatbot (word embeddings)",
        slug: "/flash",
        description: "Chatbot trained with content from a Notion page",
      },
    ],
  },
  {
    title: "Em desenvolvimento/criação",
    slug: "/dev",
    subitems: [
      {
        title: "Resumé",
        slug: "/resume",
        description: "Extract standard data from resumé",
      },
      {
        title: "Machine learning algorithms",
        description: "Chatbot trained with content from a Notion page",
        slug: "/machine-learning",
        subitems: [
          {
            title: "Genetic algorithm",
            slug: "/genetic-algorithm",
            description:
              "Prediction of suvivability of Titanic passengers determined by genetic algorithm",
          },
          {
            title: "Support 'scalar' machine with Newcomb-Benford's law",
            slug: "/scalar-machine",
            description: "Fraud detection with Newcomb-Benford's law",
          },
        ],
      },
    ],
  },
];
