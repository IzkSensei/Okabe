// Identity, affiliation, research interests and contact links live in ../config/profile.ts.
export interface Publication {
  title: string;
  authors: string[];
  venue?: string;
  year: number;
  status: "published" | "accepted" | "preprint" | "submitted";
  doi?: string; // A DOI such as 10.xxxx/xxxx, or its full https://doi.org/ URL.
  pdf?: string; // Use papers/file.pdf for a local file under public/.
  preprint?: string;
  code?: string;
  project?: string;
  selected?: boolean;
}

export interface CVEntry {
  title: string;
  institution?: string;
  period?: string;
  description?: string;
}

export interface Project {
  id: string; // Stable fragment for links to /cv/#project-id
  title: string;
  summary: string;
  shortSummary?: string;
  image?: string;
  tags: string[];
  selected: boolean;
  url?: string;
}

export interface CV {
  education: CVEntry[];
  research: CVEntry[];
  experience: CVEntry[];
  projects: Project[];
  publications: Publication[];
  skills: { area: string; tools: string[] }[];
  awards: CVEntry[];
  activities: CVEntry[];
}

export const cv: CV = {
  education: [
    {
      title: "M.Sc. in Computer Engineering",
      institution: "Politecnico di Torino",
      period: "2026–present",
    },
    {
      title: "B.Sc. in Computer Engineering",
      institution: "Isfahan University of Technology",
      period: "Completed July 2019",
    },
  ],
  research: [
    {
      title: "Undergraduate research in visual recognition",
      institution: "Isfahan University of Technology",
      description:
        "Built image datasets and evaluated recognition models for handwritten digits and serial numbers on metal slabs.",
    },
  ],
  experience: [
    {
      title: "Software Engineer",
      period: "July 2022 – November 2026",
      description:
        "Maintained an operational database as part of the software engineering team.",
    },
    { title: "Human Resources", period: "April – July 2022" },
  ],
  projects: [
    {
      id: "handwritten-digits",
      image: "illustrations/handwritten-digits.svg",
      shortSummary:
        "A bilingual dataset for reading irregular English and Persian digits.",
      title: "Recognizing irregular handwritten digits",
      summary:
        "A bilingual digit dataset with 30,000 Persian and 30,000 English samples after augmentation. The study compared neural networks on handwriting from people with disabilities.",
      tags: ["Computer vision", "Dataset design"],
      selected: true,
    },
    {
      id: "industrial-ocr",
      image: "illustrations/industrial-ocr.svg",
      shortSummary:
        "Recognizing stamped text under changing light on a factory floor.",
      title: "Reading serial numbers on metal slabs",
      summary:
        "An industrial OCR study using roughly 80,000 production images. Experiments compared detection and recognition models under changing light, surface noise, and brightness.",
      tags: ["Industrial OCR", "Machine learning"],
      selected: true,
    },
    {
      id: "indoor-localization",
      image: "illustrations/indoor-localization.svg",
      shortSummary: "Estimating indoor position from noisy wireless signals.",
      title: "Indoor localization with Wi-Fi fingerprints",
      summary:
        "Explored how additional features in wireless signal fingerprints affect indoor position estimates when signal strength fluctuates.",
      tags: ["Localization", "Wireless sensing"],
      selected: true,
    },
  ],
  publications: [
    // Replace these sample fields with a real citation, then uncomment the entry.
    // { title: '[Paper title]', authors: ['[Author name]'], venue: '[Venue]',
    //   year: 2026, status: 'published', selected: true,
    //   doi: '', pdf: '', preprint: '', code: '', project: '' },
  ],
  skills: [
    {
      area: "Programming & data",
      tools: ["Python", "SQL", "Data engineering"],
    },
    {
      area: "Machine learning",
      tools: ["TensorFlow", "Keras", "Image augmentation"],
    },
    {
      area: "Computer vision",
      tools: ["OCR", "Object detection", "Image classification"],
    },
  ],
  awards: [],
  activities: [],
};
