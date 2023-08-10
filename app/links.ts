export type LinkType = {
  title: string;
  description?: string;
  slug: string;
  subitems?: LinkType[];
};

export const rootSlug = "/projects";

export const links: LinkType[] = [
  {
    title: "OCR",
    description: "",
    slug: "/ocr",
    subitems: [
      {
        title: "RG",
        slug: "/rg",
        description: "Extract standardized data from identity card",
      },
      {
        title: "CNH",
        slug: "/cnh",
        description: "Extract standardized data from driver's license",
      },
      {
        title: "Expense receipt",
        slug: "/expense-receipt",
        description: "Extract standardized data from expense receipt",
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
    slug: "/development",
    subitems: [
      {
        title: "Resumé data extraction",
        slug: "/resume-extraction",
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
              "Prediction of suvivability of Titanic passengers determined by quaternion representation of individuals in genetic algorithm + monitoring of randomness by Hurst exponent.",
          },
          {
            title: "Statistical fraud detection with Newcomb-Benford's law",
            slug: "/fraud-detection",
            description:
              "Detection of accounting anomalies applying a dataset to a Chi-Squared test to Newcomb-Benford's law expected values",
          },
          {
            title: "Support 'scalar' machine",
            slug: "/scalar-machine",
            description:
              "Algorithmic separation of a datasets into smaller subsets using Fisher's Linear Discriminant",
          },
          {
            title: "Bigdata Dendrogram",
            slug: "/dendrogram",
            description:
              "Hierarchical clustering of n-dimensional dataset by measuring euclidian cophenetic distance between attributes",
          },
          {
            title: "MacQueen's K-meanS clustering",
            slug: "/kmeans",
            description:
              "Unsupervised learning algorith to partition n-dataset in k clusters by minimizing mean intra-cluster distance between points",
          },
        ],
      },
    ],
  },
];