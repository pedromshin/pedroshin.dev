export type LinkType = {
  title: string;
  description?: string;
  slug: string;
  subitems?: LinkType[];
  external?: boolean;
};

export const rootSlug = "/projects";

export const links: LinkType[] = [
  {
    title: "Live object detection and classification",
    slug: "https://detect.pedroshin.dev",
    external: true,
    description: "Real time object detection through camera feed.",
  },
  {
    title: "Python Jupyter Notebooks",
    slug: "https://python.pedroshin.dev",
    external: true,
    description: "WASM powered JupyterLab notebooks runninng in the browser",
  },
  {
    title: "Machine learning algorithms",
    description: "Algorithms implemented in Python running in browser",
    slug: "/machine-learning",
    subitems: [
      {
        title: "Genetic algorithm",
        slug: "/genetic-algorithm",
        description:
          "Prediction of suvivability of Titanic passengers determined by quaternion representation of individuals in genetic algorithm + monitoring of randomness by Hurst exponent.",
      },
    ],
  },
  {
    title: "3D physics studies in three.js",
    slug: "https://3d.pedroshin.dev",
    external: true,
    description: "",
  },
  {
    title: "Image Generation",
    slug: "/image",
    description: "Generate images with text prompts",
  },
  {
    title: "Embeddings 3D",
    slug: "/embeddings",
    description:
      "Visualize multi-dimensional word embeddings in 3D with t-SNE algorithm in Three.js",
  },
  {
    title: "Websocket talk room",
    slug: "/talk",
    description: "",
  },
  {
    title: "Bitcoin Websocket real-time price",
    slug: "/websocket",
    description: "Flask API with websocket to stream Bitcoin price",
  },
  {
    title: "Chatbot",
    description: "Open chatbot",
    slug: "/chatbot",
    subitems: [
      {
        title: "Open",
        slug: "/open",
        description: "Default chatbot with gpt-4",
      },
      {
        title: "Trained chatbot (word embeddings)",
        slug: "/notion",
        description: "Chatbot trained with content from a Notion page",
      },
    ],
  },
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
    ],
  },
  {
    title: "Frontend frameworks",
    description: "Subdomains deployed in various frontend frameworks",
    slug: "/",
    subitems: [
      {
        title: "Angular",
        slug: "https://angular.pedroshin.dev",
        external: true,
      },
      {
        title: "Solid",
        slug: "https://solid.pedroshin.dev",
        external: true,
      },
      {
        title: "Svelte",
        slug: "https://svelte.pedroshin.dev",
        external: true,
      },
      {
        title: "Vue",
        slug: "https://vue.pedroshin.dev",
        external: true,
      },
      {
        title: "Astro",
        slug: "https://astro.pedroshin.dev",
        external: true,
      },
    ],
  },
  {
    title: "Em desenvolvimento / criação",
    slug: "/development",
    subitems: [
      {
        title: "OCR",
        description: "",
        slug: "/ocr",
        subitems: [
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
        title: "Resumé data extraction",
        slug: "/resume-extraction",
        description: "Extract standard data from resumé",
      },
      {
        title: "Machine learning algorithms",
        description: "Algorithms implemented in Python running in browser",
        slug: "/machine-learning",
        subitems: [
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
          {
            title: "Mahalanobis Classifier",
            slug: "/mahalanobis",
            description:
              "Big data classification algorithm using Mahalanobis distance to determine the probability of a point belonging to a class",
          },
        ],
      },
    ],
  },
];
