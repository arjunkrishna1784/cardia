/**
 * Central CARDIA site content configuration.
 *
 * Edit copy, navigation, team members, and contact details here rather than
 * inside individual components.
 */

export interface TeamMember {
  name: string;
  /** TODO: add role once confirmed. Do not invent titles. */
  role?: string;
  /** TODO: add a short bio once confirmed. Do not invent biographies. */
  bio?: string;
  linkedin?: string;
  github?: string;
  /** Path to a photo in /public, e.g. "/team/name.jpg" */
  photo?: string;
}

export interface ResearchArea {
  id: string;
  index: string;
  title: string;
  body: string;
}

export interface PipelineStage {
  index: string;
  title: string;
  body: string;
}

export interface ResearchPaper {
  id: string;
  title: string;
  authors: string;
  tags: string[];
  /** One-sentence framing of the scientific question. */
  question: string;
  /** What the study actually did. */
  approach: string;
  /** Findings stated as in the paper, without extra clinical claims. */
  findings: string[];
  /** The paper's own limitation / non-deployment caveat. */
  caveat: string;
  pdf: string;
}

export const cardia = {
  name: "CARDIA",
  fullName: "Computational Analytics & Research in Disease Informatics and AI",

  description:
    "A cardiovascular bioinformatics startup developing ML and NLP pipelines for disease research.",

  hero: {
    eyebrow: "Cardiovascular Bioinformatics × AI",
    headline: ["Decoding cardiovascular", "disease through data."],
    supporting:
      "CARDIA develops computational pipelines that combine machine learning, natural language processing, and disease informatics to investigate complex cardiovascular disease.",
    credibility: "Research accepted at IEEE MIT URTC & BMES",
  },

  nav: [
    { label: "Research", href: "#research" },
    { label: "Technology", href: "#technology" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ],

  recognition: ["IEEE MIT URTC", "BMES"],

  research: [
    {
      id: "disease-informatics",
      index: "01",
      title: "Disease Informatics",
      body: "Mapping complex cardiovascular disease information into structured, computationally accessible representations.",
    },
    {
      id: "machine-learning",
      index: "02",
      title: "Machine Learning",
      body: "Developing machine-learning pipelines to identify patterns across high-dimensional cardiovascular research data.",
    },
    {
      id: "biomedical-nlp",
      index: "03",
      title: "Biomedical NLP",
      body: "Using natural language processing to extract and connect information from biomedical literature and disease research.",
    },
  ] satisfies ResearchArea[],

  papers: [
    {
      id: "ppg-biomarkers",
      title:
        "Interpretable Mechanistic Photoplethysmography Biomarkers for Accessible Cardiovascular Risk Screening",
      authors:
        "Anishsairam Murari, Aayush Pal, Anshul Palreddy, Arjun Krishnamurthy, and Romir Kadiam",
      tags: ["Photoplethysmography", "Interpretable ML", "Cardiovascular screening"],
      question:
        "Does PPG pulse morphology carry information about elevated systolic blood pressure beyond heart rate, and can that information be expressed as physiologically grouped biomarkers rather than a black-box waveform model?",
      approach:
        "Using the PhysioNet Pulse Transit Time PPG Dataset (66 records from 22 subjects during sitting, walking, and running), the study built a reproducible pipeline: winsorization, detrending, 0.5–8 Hz bandpass filtering, 10-second overlapping segments, and signal-quality filtering. Engineered features were grouped into amplitude/perfusion, timing/autonomic, morphology/derivative, and complexity families. A heart-rate-only logistic regression baseline was compared with a full mechanistic logistic regression model and a random-forest comparator under 5-fold subject-grouped cross-validation, so no subject appeared in both train and test folds.",
      findings: [
        "Mechanistic logistic regression reached segment-level ROC-AUC 0.666 and record-level ROC-AUC 0.715, versus 0.434 for heart rate alone and 0.672 for random forest at the record level.",
        "Timing features were the strongest single family, but the full biomarker set performed best, supporting complementary information across waveform properties.",
        "Decay time, rise time, sample entropy, pulsatility index, and amplitude variability were among the strongest features, with cautious links to vascular runoff, upstroke dynamics, perfusion, and waveform irregularity.",
      ],
      caveat:
        "This is a screening research framework on a small public dataset, not a diagnostic device. It does not replace cuff-based blood-pressure measurement, and there was no external validation cohort.",
      pdf: "/research/ppg-biomarkers-cardiovascular-risk-screening.pdf",
    },
    {
      id: "biomarker-subgroups",
      title:
        "Clinically Interpretable Validation of Mechanistic Cardiovascular Biomarkers Across Demographic and Physiological Subgroups",
      authors:
        "Arjun Krishnamurthy, Anishsairam Murari, Anshul Palreddy, and Aayush Pal",
      tags: ["Subgroup validation", "Calibration", "Cardiovascular biomarkers"],
      question:
        "If a cardiovascular model uses familiar physiologic markers — blood pressure, cholesterol, glucose, BMI — does aggregate performance still hide failures in discrimination, calibration, fairness, or decision utility across patient subgroups?",
      approach:
        "A public cardiovascular dataset was filtered for physiologic plausibility to 68,599 observations (33,934 labeled cardiovascular-disease-positive). Logistic regression and random forest models used systolic and diastolic blood pressure, pulse pressure, mean arterial pressure, cholesterol, fasting glucose, BMI, and lifestyle covariates. Validation went beyond overall AUC: held-out discrimination, expected calibration error, age/sex/blood-pressure subgroup metrics, population stability, permutation importance, and decision-curve analysis.",
      findings: [
        "Random forest overall AUC was 0.784 (95% CI 0.776–0.790), similar to logistic regression at 0.781 — moderate aggregate discrimination using only interpretable inputs.",
        "Subgroup AUC ranged from 0.592 in the elevated-blood-pressure stratum to 0.820 in ages ≤45. The largest AUC gap was 0.127 across baseline blood-pressure categories.",
        "Age-related output and error-rate disparities were substantially larger than sex-related disparities. Blood-pressure-derived features were both highly important and among the most distributionally unstable predictors.",
      ],
      caveat:
        "Physiologic interpretability is not deployment readiness. The public tabular label is not a prospectively adjudicated clinical endpoint, and the study has no external validation, medication data, or longitudinal follow-up.",
      pdf: "/research/cardiovascular-biomarker-subgroup-validation.pdf",
    },
    {
      id: "lexical-leakage",
      title:
        "Lexical Leakage and Shortcut Sensitivity in Public Mental-Health Text Classification: An Interpretable Validation Study",
      authors: "CARDIA researchers (authors withheld for double-blind review)",
      tags: ["Biomedical NLP", "Shortcut learning", "Benchmark auditing"],
      question:
        "When public mental-health text classifiers report high accuracy, how much of that performance is reusable language signal versus lexical leakage, crisis phrases, post length, duplicates, or platform artifacts?",
      approach:
        "The study audited 49,451 public texts labeled Normal, Anxiety, Depression, or Suicidal — dataset labels, not clinician-confirmed diagnoses. TF-IDF logistic regression, calibrated linear SVM, naive Bayes, and a secondary random forest were evaluated on a four-class task and three one-vs-normal tasks. The audit included keyword and crisis-term ablations, artifact removal, length-matched evaluation, near-duplicate-safe splits, calibration, and categorization of top lexical features.",
      findings: [
        "Four-class TF-IDF logistic regression reached macro F1 0.776. Best one-vs-normal AUROCs were 0.984–0.988 — strong dataset-label predictability.",
        "Keyword removal did not erase performance, so models were not relying on a handful of label words alone. Length sensitivity remained high (up to ~0.48), and several task/model pairs were tagged high shortcut risk by the paper's heuristic audit rule.",
        "Top features mixed symptom language with leakage, crisis terms, and unclear n-grams. The authors treat the result as a robustness audit of public benchmarks, not evidence for clinical screening.",
      ],
      caveat:
        "This work does not diagnose mental-health status and is not for clinical deployment. Public posts are not psychiatric assessments; suicidal-language is a dataset category, not a suicide-risk system.",
      pdf: "/research/lexical-leakage-mental-health-text-classification.pdf",
    },
    {
      id: "refchain",
      title:
        "Context-Length Lower Bounds for Reference Resolution in Transformer Language Models",
      authors: "Arjun Krishnamurthy and Vaibhav Gollapalli",
      tags: ["NLP", "Long-context models", "Discourse theory"],
      question:
        "Is long-context failure in language models mainly a retrieval / “lost in the middle” problem, or does discourse reference impose a structural limit that extra context-window size cannot remove?",
      approach:
        "The paper models reference resolution as depth-sensitive state tracking: anaphoric depth k (chained resolution steps) and distractor interference η (competing candidates per step). It derives that resolving such chains requires effective attention support Ω(k · η), not merely a longer nominal context window. RefChain, a 4,800-passage controlled benchmark, varies pronouns, definite descriptions, bridging anaphora, and discourse deixis across depths 1–6 and interference 1–4. Eleven language models and four baselines were evaluated in forced-choice resolution.",
      findings: [
        "Accuracy fell monotonically with depth: frontier models were near ceiling at k = 1 and approached chance (~25–39%) by k = 6. Interference degraded performance independently of depth.",
        "Empirical accuracy tracked the predicted depth–interference scaling (aggregate R² = 0.87). Errors correlated with discourse structure, not token distance.",
        "Larger context windows did not rescue performance when all needed information already fit in 4K tokens. Chain-of-thought improved scores but did not remove the depth bound.",
      ],
      caveat:
        "RefChain is template-constructed and measures structural capacity rather than naturalistic coreference. Closed-source models are API-only, so internal attention support is inferred behaviorally.",
      pdf: "/research/context-length-lower-bounds-reference-resolution.pdf",
    },
  ] satisfies ResearchPaper[],

  pipeline: [
    {
      index: "01",
      title: "Acquire",
      body: "Literature, disease information, and research datasets.",
    },
    {
      index: "02",
      title: "Structure",
      body: "Normalize and organize biomedical information.",
    },
    {
      index: "03",
      title: "Analyze",
      body: "Apply ML, NLP, and computational methods.",
    },
    {
      index: "04",
      title: "Discover",
      body: "Surface patterns, relationships, and research hypotheses.",
    },
  ] satisfies PipelineStage[],

  about: {
    headline: "Built to make cardiovascular research more computable.",
    body: "CARDIA — Computational Analytics & Research in Disease Informatics and AI — is a cardiovascular bioinformatics startup developing machine learning and natural language processing pipelines for disease research.",
    team: "Our five-person team works across computational biology, artificial intelligence, and cardiovascular disease informatics.",
    recognition: "Our research has been accepted at IEEE MIT URTC and BMES.",
  },

  /**
   * TODO: Add role, bio, LinkedIn, GitHub, and photo for each member.
   * Do not invent titles, biographies, or affiliations.
   */
  team: [
    { name: "Arjun Krishnamurthy" },
    { name: "Anish Murari" },
    { name: "Romir Kadiam" },
    { name: "Anshul Palreddy" },
    { name: "Aayush Pal" },
  ] as TeamMember[],

  contact: {
    // TODO: Add the real CARDIA contact email. CTAs fall back to an in-page
    // anchor until this is provided — do not fabricate an address.
    email: "",
  },
} as const;

export type Cardia = typeof cardia;
