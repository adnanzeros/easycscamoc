// ============================================================
// CSCA Mathematics Unlimited Mock Generator
// ============================================================

export type OptionId = 'A' | 'B' | 'C' | 'D';

export type QuizMode = 'single' | 'all';

export type ExplanationLanguage = 'en' | 'bn';

export type MathTopic =
  | 'Sets & Inequalities'
  | 'Functions & Calculus'
  | 'Geometry & Algebra'
  | 'Probability & Statistics';

export interface MathQuestion {
  id: string;
  number: number;
  topic: MathTopic;
  question: string;

  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };

  correctOption: OptionId;

  explanation: {
    en: string;
    bn: string;
  };
}

export interface MathMockExam {
  examId: string;
  examNumber: number;
  title: string;
  subject: 'Mathematics';
  minutes: 50;
  totalQuestions: 48;
  mode: QuizMode;
  questions: MathQuestion[];
}

export interface GenerateMathMockExamOptions {
  examNumber?: number;
  mode?: QuizMode;
  seed?: string | number;
}

// ============================================================
// TYPES
// ============================================================

type RNG = () => number;

type QuestionGenerator = (rng: RNG, index: number) => MathQuestion;

// ============================================================
// SEEDED RANDOM
// ============================================================

function hashString(value: string): number {
  let hash = 2166136261;

  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function createSeededRng(seed: string | number): RNG {
  let state = hashString(String(seed));

  return () => {
    state += 0x6d2b79f5;

    let t = state;

    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randomSeed(): string {
  return `${Date.now()}-${Math.floor(Math.random() * 1_000_000_000)}`;
}

function int(rng: RNG, min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

function pick<T>(rng: RNG, values: T[]): T {
  return values[int(rng, 0, values.length - 1)];
}

function shuffle<T>(rng: RNG, values: T[]): T[] {
  const copy = [...values];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = int(rng, 0, i);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

// ============================================================
// HELPERS
// ============================================================

function uniqueStrings(values: string[]): string[] {
  return [...new Set(values.map(value => value.trim()))];
}

function normalizeQuestion(value: string): string {
  return value
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s]/g, '')
    .trim();
}

function makeQuestion(params: {
  id: string;
  topic: MathTopic;
  question: string;
  correct: string;
  distractors: string[];
  explanationEn: string;
  explanationBn: string;
}): MathQuestion {
  const rawOptions = uniqueStrings([params.correct, ...params.distractors]);

  let options = rawOptions;

  // Safety fallback if a generator accidentally creates duplicates.
  if (options.length < 4) {
    const fallback = ['0', '1', '-1', '2', '-2', '3', '-3', '4'];

    for (const value of fallback) {
      if (!options.includes(value)) {
        options.push(value);
      }

      if (options.length === 4) break;
    }
  }

  options = options.slice(0, 4);

  const correctIndex = options.indexOf(params.correct);

  const optionValues = shuffle(
    createSeededRng(hashString(params.question)),
    options,
  );

  const shuffledCorrectIndex = optionValues.indexOf(params.correct);

  const optionIds: OptionId[] = ['A', 'B', 'C', 'D'];

  const mappedOptions = {
    A: optionValues[0],
    B: optionValues[1],
    C: optionValues[2],
    D: optionValues[3],
  };

  void correctIndex;

  return {
    id: params.id,
    number: 0,
    topic: params.topic,
    question: params.question,
    options: mappedOptions,
    correctOption: optionIds[shuffledCorrectIndex],
    explanation: {
      en: params.explanationEn,
      bn: params.explanationBn,
    },
  };
}

// Better deterministic option shuffle based on the question itself.
function makeQuestionWithRng(
  rng: RNG,
  params: {
    id: string;
    topic: MathTopic;
    question: string;
    correct: string;
    distractors: string[];
    explanationEn: string;
    explanationBn: string;
  },
): MathQuestion {
  let options = uniqueStrings([params.correct, ...params.distractors]);

  if (options.length < 4) {
    const fallback = [
      '0',
      '1',
      '-1',
      '2',
      '-2',
      '3',
      '-3',
      '4',
      '5',
      '6',
      '8',
      '10',
    ];

    for (const value of fallback) {
      if (!options.includes(value)) {
        options.push(value);
      }

      if (options.length === 4) break;
    }
  }

  options = shuffle(rng, options.slice(0, 4));

  const correctOption = (['A', 'B', 'C', 'D'] as OptionId[])[
    options.indexOf(params.correct)
  ];

  return {
    id: params.id,
    number: 0,
    topic: params.topic,
    question: params.question,
    options: {
      A: options[0],
      B: options[1],
      C: options[2],
      D: options[3],
    },
    correctOption,
    explanation: {
      en: params.explanationEn,
      bn: params.explanationBn,
    },
  };
}

// ============================================================
// SETS & INEQUALITIES
// ============================================================

function setsQ1(rng: RNG): MathQuestion {
  const a = int(rng, 4, 10);
  const b = int(rng, 2, a - 1);

  const answer = a - b;

  return makeQuestionWithRng(rng, {
    id: 'sets-q1',
    topic: 'Sets & Inequalities',
    question: `If A has ${a} elements and B has ${b} elements, and B is a subset of A, how many elements are in A \\ B?`,
    correct: String(answer),
    distractors: [
      String(answer + 1),
      String(answer + 2),
      String(Math.max(1, answer - 1)),
    ],
    explanationEn: `Since B is a subset of A, A \\ B contains the elements of A that are not in B. Therefore, ${a} - ${b} = ${answer}.`,
    explanationBn: `B, A-এর একটি subset। তাই A \\ B-তে A-এর যেসব উপাদান B-তে নেই সেগুলো থাকবে। সুতরাং ${a} - ${b} = ${answer}।`,
  });
}

function setsQ2(rng: RNG): MathQuestion {
  const a = int(rng, 3, 8);
  const b = int(rng, 3, 8);

  const answer = a + b;

  return makeQuestionWithRng(rng, {
    id: 'sets-q2',
    topic: 'Sets & Inequalities',
    question: `If sets A and B are disjoint with |A| = ${a} and |B| = ${b}, what is |A ∪ B|?`,
    correct: String(answer),
    distractors: [
      String(answer - 1),
      String(answer + 1),
      String(Math.abs(a - b)),
    ],
    explanationEn: `For disjoint sets, the intersection is empty. Therefore |A ∪ B| = |A| + |B| = ${a} + ${b} = ${answer}.`,
    explanationBn: `Disjoint set-এর ক্ষেত্রে intersection ফাঁকা। তাই |A ∪ B| = |A| + |B| = ${a} + ${b} = ${answer}।`,
  });
}

function setsQ3(rng: RNG): MathQuestion {
  const a = int(rng, 2, 7);
  const b = int(rng, -6, 6);

  const rhs = a * b - b;

  return makeQuestionWithRng(rng, {
    id: 'sets-q3',
    topic: 'Sets & Inequalities',
    question: `Solve the inequality ${a}x - ${b} > ${rhs}.`,
    correct: `x > ${b}`,
    distractors: [`x < ${b}`, `x > ${b + 1}`, `x < ${b - 1}`],
    explanationEn: `Add ${b} to both sides: ${a}x > ${a * b}. Since ${a} is positive, divide by ${a}. Thus x > ${b}.`,
    explanationBn: `উভয় পাশে ${b} যোগ করলে ${a}x > ${a * b} পাওয়া যায়। ${a} ধনাত্মক হওয়ায় ${a} দিয়ে ভাগ করলে x > ${b}।`,
  });
}

function setsQ4(rng: RNG): MathQuestion {
  const lower = int(rng, -5, 2);
  const upper = int(rng, lower + 3, lower + 8);

  return makeQuestionWithRng(rng, {
    id: 'sets-q4',
    topic: 'Sets & Inequalities',
    question: `Which interval represents ${lower} ≤ x < ${upper}?`,
    correct: `[${lower}, ${upper})`,
    distractors: [
      `(${lower}, ${upper})`,
      `[${lower}, ${upper}]`,
      `(${lower}, ${upper}]`,
    ],
    explanationEn: `The symbol ≤ includes the lower endpoint, while < excludes the upper endpoint. Therefore the interval is [${lower}, ${upper}).`,
    explanationBn: `≤ চিহ্ন lower endpoint-কে include করে এবং < upper endpoint-কে exclude করে। তাই interval হলো [${lower}, ${upper})।`,
  });
}

function setsQ5(rng: RNG): MathQuestion {
  const a = int(rng, 2, 8);
  const answer = a * a;

  return makeQuestionWithRng(rng, {
    id: 'sets-q5',
    topic: 'Sets & Inequalities',
    question: `If U = {1, 2, ..., ${answer}} and A is the set of multiples of ${a} in U, how many elements does A contain?`,
    correct: String(a),
    distractors: [
      String(a + 1),
      String(Math.max(1, a - 1)),
      String(answer - a),
    ],
    explanationEn: `The multiples are ${a}, 2${a}, ..., ${a}×${a} = ${answer}. There are ${a} such multiples.`,
    explanationBn: `${a}-এর multiples হলো ${a}, 2${a}, ..., ${a}×${a} = ${answer}। মোট ${a}টি multiple আছে।`,
  });
}

function setsQ6(rng: RNG): MathQuestion {
  const a = int(rng, 2, 6);
  const b = int(rng, 2, 6);

  const answer = a * b;

  return makeQuestionWithRng(rng, {
    id: 'sets-q6',
    topic: 'Sets & Inequalities',
    question: `If |A| = ${a} and |B| = ${b}, how many ordered pairs are in A × B?`,
    correct: String(answer),
    distractors: [String(a + b), String(answer + 1), String(Math.abs(a - b))],
    explanationEn: `The Cartesian product A × B contains |A||B| ordered pairs. Thus ${a} × ${b} = ${answer}.`,
    explanationBn: `Cartesian product A × B-তে |A||B| সংখ্যক ordered pair থাকে। তাই ${a} × ${b} = ${answer}।`,
  });
}

function setsQ7(rng: RNG): MathQuestion {
  const x = int(rng, 2, 7);
  const answer = x + 3;

  return makeQuestionWithRng(rng, {
    id: 'sets-q7',
    topic: 'Sets & Inequalities',
    question: `Solve |x - ${answer}| = ${3}.`,
    correct: `${x} or ${2 * answer - x}`,
    distractors: [
      `${x + 1} or ${2 * answer - x - 1}`,
      `${x - 1} or ${2 * answer - x + 1}`,
      `${answer} only`,
    ],
    explanationEn: `For |x - ${answer}| = 3, x - ${answer} = ±3. Hence x = ${answer - 3} or x = ${answer + 3}.`,
    explanationBn: `|x - ${answer}| = 3 হলে x - ${answer} = ±3। তাই x = ${answer - 3} অথবা x = ${answer + 3}।`,
  });
}

function setsQ8(rng: RNG): MathQuestion {
  const a = int(rng, 2, 6);
  const answer = a * 2;

  return makeQuestionWithRng(rng, {
    id: 'sets-q8',
    topic: 'Sets & Inequalities',
    question: `If a set has ${a} elements, how many subsets does it have?`,
    correct: String(2 ** a),
    distractors: [String(answer), String(2 ** a - 1), String(a ** 2)],
    explanationEn: `A set with n elements has 2^n subsets. Therefore 2^${a} = ${2 ** a}.`,
    explanationBn: `nটি উপাদানবিশিষ্ট set-এর মোট subset সংখ্যা 2^n। তাই 2^${a} = ${2 ** a}।`,
  });
}

function setsQ9(rng: RNG): MathQuestion {
  const a = int(rng, 3, 8);
  const b = int(rng, 2, a);

  const answer = Math.max(1, a - b + 1);

  return makeQuestionWithRng(rng, {
    id: 'sets-q9',
    topic: 'Sets & Inequalities',
    question: `How many integers satisfy ${b} ≤ x ≤ ${a}?`,
    correct: String(answer),
    distractors: [
      String(answer + 1),
      String(Math.max(1, answer - 1)),
      String(a + b),
    ],
    explanationEn: `The integers from ${b} through ${a} inclusive are counted by ${a} - ${b} + 1 = ${answer}.`,
    explanationBn: `${b} থেকে ${a} পর্যন্ত inclusive integer-এর সংখ্যা ${a} - ${b} + 1 = ${answer}।`,
  });
}

function setsQ10(rng: RNG): MathQuestion {
  const a = int(rng, 2, 6);
  const b = int(rng, 2, 6);

  return makeQuestionWithRng(rng, {
    id: 'sets-q10',
    topic: 'Sets & Inequalities',
    question: `If |A| = ${a}, |B| = ${b}, and |A ∩ B| = 1, what is |A ∪ B|?`,
    correct: String(a + b - 1),
    distractors: [String(a + b), String(a * b), String(Math.abs(a - b) + 1)],
    explanationEn: `Use |A ∪ B| = |A| + |B| - |A ∩ B|. Therefore ${a} + ${b} - 1 = ${a + b - 1}.`,
    explanationBn: `সূত্র |A ∪ B| = |A| + |B| - |A ∩ B|। তাই ${a} + ${b} - 1 = ${a + b - 1}।`,
  });
}

function setsQ11(rng: RNG): MathQuestion {
  const a = int(rng, 2, 6);
  const b = int(rng, 2, 6);

  return makeQuestionWithRng(rng, {
    id: 'sets-q11',
    topic: 'Sets & Inequalities',
    question: `Which condition is equivalent to x ≥ ${a}?`,
    correct: `x is at least ${a}`,
    distractors: [
      `x is less than ${a}`,
      `x is greater than ${a} only`,
      `x is at most ${a}`,
    ],
    explanationEn: `The inequality x ≥ ${a} means x is greater than or equal to ${a}, which is commonly stated as "x is at least ${a}".`,
    explanationBn: `x ≥ ${a} অর্থ x-এর মান ${a}-এর সমান বা তার চেয়ে বড়। একে বলা হয় "x is at least ${a}"।`,
  });
}

function setsQ12(rng: RNG): MathQuestion {
  const a = int(rng, 2, 5);
  const answer = 2 ** a;

  return makeQuestionWithRng(rng, {
    id: 'sets-q12',
    topic: 'Sets & Inequalities',
    question: `A set has ${a} elements. How many proper subsets does it have?`,
    correct: String(answer - 1),
    distractors: [String(answer), String(a), String(answer + 1)],
    explanationEn: `There are 2^${a} = ${answer} total subsets. Excluding the set itself leaves ${answer - 1} proper subsets.`,
    explanationBn: `মোট subset হলো 2^${a} = ${answer}টি। Set-টি নিজে বাদ দিলে proper subset থাকে ${answer - 1}টি।`,
  });
}

// ============================================================
// FUNCTIONS & CALCULUS
// ============================================================

function functionsQ1(rng: RNG): MathQuestion {
  const a = int(rng, 2, 7);
  const b = int(rng, -5, 5);
  const x = int(rng, -3, 4);
  const answer = a * x + b;

  return makeQuestionWithRng(rng, {
    id: 'functions-q1',
    topic: 'Functions & Calculus',
    question: `If f(x) = ${a}x ${b >= 0 ? '+' : '-'} ${Math.abs(b)}, what is f(${x})?`,
    correct: String(answer),
    distractors: [String(answer + a), String(answer - a), String(a * x - b)],
    explanationEn: `Substitute x = ${x}: f(${x}) = ${a}(${x}) ${b >= 0 ? '+' : '-'} ${Math.abs(b)} = ${answer}.`,
    explanationBn: `x = ${x} বসালে f(${x}) = ${a}(${x}) ${b >= 0 ? '+' : '-'} ${Math.abs(b)} = ${answer}।`,
  });
}

function functionsQ2(rng: RNG): MathQuestion {
  const a = int(rng, 2, 5);
  const answer = 2 * a;

  return makeQuestionWithRng(rng, {
    id: 'functions-q2',
    topic: 'Functions & Calculus',
    question: `If f(x) = x² + ${a}x, what is f'(x)?`,
    correct: `2x + ${a}`,
    distractors: [`x + ${a}`, `2x² + ${a}`, `x² + ${a}`],
    explanationEn: `Differentiate term by term: d(x²)/dx = 2x and d(${a}x)/dx = ${a}. Hence f'(x) = 2x + ${a}.`,
    explanationBn: `প্রতিটি term আলাদাভাবে differentiate করলে d(x²)/dx = 2x এবং d(${a}x)/dx = ${a}। তাই f'(x) = 2x + ${a}।`,
  });
}

function functionsQ3(rng: RNG): MathQuestion {
  const a = int(rng, 2, 6);
  const x = int(rng, 1, 5);
  const answer = a * x ** 2;

  return makeQuestionWithRng(rng, {
    id: 'functions-q3',
    topic: 'Functions & Calculus',
    question: `If f(x) = ${a}x², what is f'(${x})?`,
    correct: String(2 * a * x),
    distractors: [String(answer), String(a * x), String(2 * a)],
    explanationEn: `f'(x) = ${2 * a}x. At x = ${x}, f'(${x}) = ${2 * a}(${x}) = ${2 * a * x}.`,
    explanationBn: `f'(x) = ${2 * a}x। x = ${x} বসালে f'(${x}) = ${2 * a}(${x}) = ${2 * a * x}।`,
  });
}

function functionsQ4(rng: RNG): MathQuestion {
  const a = int(rng, 2, 7);
  const b = int(rng, 1, 5);

  return makeQuestionWithRng(rng, {
    id: 'functions-q4',
    topic: 'Functions & Calculus',
    question: `What is the derivative of ${a}x + ${b}?`,
    correct: String(a),
    distractors: [String(b), String(a + b), String(a - b)],
    explanationEn: `The derivative of ax is a, while the derivative of a constant is 0. Therefore the derivative is ${a}.`,
    explanationBn: `ax-এর derivative হলো a এবং constant-এর derivative হলো 0। তাই derivative = ${a}।`,
  });
}

function functionsQ5(rng: RNG): MathQuestion {
  const a = int(rng, 2, 5);
  const x = int(rng, 1, 4);
  const answer = a * x;

  return makeQuestionWithRng(rng, {
    id: 'functions-q5',
    topic: 'Functions & Calculus',
    question: `Evaluate ∫ ${a} dx from 0 to ${x}.`,
    correct: String(answer),
    distractors: [String(a + x), String(a * x + 1), String(x ** 2)],
    explanationEn: `The integral of ${a} is ${a}x. Evaluating from 0 to ${x} gives ${a}(${x}) - 0 = ${answer}.`,
    explanationBn: `${a}-এর integral হলো ${a}x। 0 থেকে ${x} পর্যন্ত বসালে ${a}(${x}) - 0 = ${answer}।`,
  });
}

function functionsQ6(rng: RNG): MathQuestion {
  const a = int(rng, 2, 6);
  const b = int(rng, 1, 5);

  return makeQuestionWithRng(rng, {
    id: 'functions-q6',
    topic: 'Functions & Calculus',
    question: `If f(x) = ${a}x - ${b}, what is f⁻¹(x)?`,
    correct: `(x + ${b})/${a}`,
    distractors: [`(x - ${b})/${a}`, `${a}x + ${b}`, `${a}(x + ${b})`],
    explanationEn: `Let y = ${a}x - ${b}. Then y + ${b} = ${a}x, so x = (y + ${b})/${a}. Therefore f⁻¹(x) = (x + ${b})/${a}.`,
    explanationBn: `y = ${a}x - ${b} নিলে y + ${b} = ${a}x। তাই x = (y + ${b})/${a} এবং f⁻¹(x) = (x + ${b})/${a}।`,
  });
}

function functionsQ7(rng: RNG): MathQuestion {
  const a = int(rng, 2, 6);
  const answer = a ** 2;

  return makeQuestionWithRng(rng, {
    id: 'functions-q7',
    topic: 'Functions & Calculus',
    question: `What is the limit of x² as x approaches ${a}?`,
    correct: String(answer),
    distractors: [String(a), String(2 * a), String(a ** 2 + 1)],
    explanationEn: `Since x² is continuous, substitute x = ${a}: ${a}² = ${answer}.`,
    explanationBn: `x² একটি continuous function। তাই সরাসরি x = ${a} বসালে ${a}² = ${answer} পাওয়া যায়।`,
  });
}

function functionsQ8(rng: RNG): MathQuestion {
  const a = int(rng, 2, 5);

  return makeQuestionWithRng(rng, {
    id: 'functions-q8',
    topic: 'Functions & Calculus',
    question: `If f(x) = x^${a}, what is f'(x)?`,
    correct: `${a}x^${a - 1}`,
    distractors: [`x^${a - 1}`, `${a - 1}x^${a}`, `${a}x^${a}`],
    explanationEn: `By the power rule, d(x^n)/dx = nx^(n-1). Therefore f'(x) = ${a}x^${a - 1}.`,
    explanationBn: `Power rule অনুযায়ী d(x^n)/dx = nx^(n-1)। তাই f'(x) = ${a}x^${a - 1}।`,
  });
}

function functionsQ9(rng: RNG): MathQuestion {
  const a = int(rng, 2, 5);
  const b = int(rng, 1, 4);

  return makeQuestionWithRng(rng, {
    id: 'functions-q9',
    topic: 'Functions & Calculus',
    question: `If f(x) = ${a}x² + ${b}, at which x-value does f'(x) = 0?`,
    correct: 'x = 0',
    distractors: [`x = ${a}`, `x = ${b}`, `x = ${a + b}`],
    explanationEn: `f'(x) = ${2 * a}x. Setting it equal to zero gives ${2 * a}x = 0, so x = 0.`,
    explanationBn: `f'(x) = ${2 * a}x। এটিকে 0-এর সমান করলে ${2 * a}x = 0, তাই x = 0।`,
  });
}

function functionsQ10(rng: RNG): MathQuestion {
  const a = int(rng, 2, 6);
  const b = int(rng, 1, 4);

  return makeQuestionWithRng(rng, {
    id: 'functions-q10',
    topic: 'Functions & Calculus',
    question: `If f(x) = ${a}x + ${b} and g(x) = x², what is (g ∘ f)(x)?`,
    correct: `(${a}x + ${b})²`,
    distractors: [`${a}x² + ${b}`, `${a}x + ${b}²`, `x² + ${a}x + ${b}`],
    explanationEn: `Composition means g(f(x)). Since g(x) = x², replace x with f(x): g(f(x)) = (${a}x + ${b})².`,
    explanationBn: `Composition অর্থ g(f(x))। যেহেতু g(x) = x², তাই f(x)-কে x-এর জায়গায় বসালে (${a}x + ${b})² পাওয়া যায়।`,
  });
}

function functionsQ11(rng: RNG): MathQuestion {
  const a = int(rng, 2, 6);
  const b = int(rng, 1, 5);

  return makeQuestionWithRng(rng, {
    id: 'functions-q11',
    topic: 'Functions & Calculus',
    question: `For f(x) = ${a}x + ${b}, what is the slope of the graph?`,
    correct: String(a),
    distractors: [String(b), String(a + b), String(a * b)],
    explanationEn: `A linear function y = mx + c has slope m. Therefore the slope is ${a}.`,
    explanationBn: `Linear function y = mx + c-এর slope হলো m। এখানে m = ${a}, তাই slope = ${a}।`,
  });
}

function functionsQ12(rng: RNG): MathQuestion {
  const a = pick(rng, [1, 3, 5, 7]);

  return makeQuestionWithRng(rng, {
    id: 'functions-q12',
    topic: 'Functions & Calculus',
    question: `Which statement is true for f(x) = x^${a}?`,
    correct: 'f is an odd function',
    distractors: [
      'f is an even function',
      'f is neither even nor odd',
      'f is a constant function',
    ],
    explanationEn: `Because ${a} is odd, f(-x) = (-x)^${a} = -x^${a} = -f(x). Therefore f is odd.`,
    explanationBn: `${a} বিজোড় হওয়ায় f(-x) = (-x)^${a} = -x^${a} = -f(x)। তাই f একটি odd function।`,
  });
}

// ============================================================
// GEOMETRY & ALGEBRA
// ============================================================

function geometryQ1(rng: RNG): MathQuestion {
  const base = int(rng, 4, 12);
  const height = int(rng, 3, 10);

  const area = (base * height) / 2;

  return makeQuestionWithRng(rng, {
    id: 'geometry-q1',
    topic: 'Geometry & Algebra',
    question: `What is the area of a triangle with base ${base} and height ${height}?`,
    correct: String(area),
    distractors: [
      String(base * height),
      String(area + base),
      String(area - height),
    ],
    explanationEn: `Triangle area = 1/2 × base × height = 1/2 × ${base} × ${height} = ${area}.`,
    explanationBn: `Triangle-এর area = 1/2 × base × height = 1/2 × ${base} × ${height} = ${area}।`,
  });
}

function geometryQ2(rng: RNG): MathQuestion {
  const side = int(rng, 3, 10);

  return makeQuestionWithRng(rng, {
    id: 'geometry-q2',
    topic: 'Geometry & Algebra',
    question: `What is the perimeter of a square with side length ${side}?`,
    correct: String(4 * side),
    distractors: [String(side ** 2), String(3 * side), String(2 * side)],
    explanationEn: `A square has four equal sides, so perimeter = 4 × ${side} = ${4 * side}.`,
    explanationBn: `Square-এর চারটি সমান side থাকে। তাই perimeter = 4 × ${side} = ${4 * side}।`,
  });
}

function geometryQ3(rng: RNG): MathQuestion {
  const r = int(rng, 2, 8);
  const area = `π(${r})²`;

  return makeQuestionWithRng(rng, {
    id: 'geometry-q3',
    topic: 'Geometry & Algebra',
    question: `What is the area of a circle with radius ${r}?`,
    correct: area,
    distractors: [`${2}π(${r})`, `π(${r})`, `4π(${r})²`],
    explanationEn: `The area of a circle is πr². With r = ${r}, the area is π(${r})².`,
    explanationBn: `Circle-এর area-এর সূত্র πr²। এখানে r = ${r}, তাই area = π(${r})²।`,
  });
}

function geometryQ4(rng: RNG): MathQuestion {
  const a = int(rng, 3, 9);
  const b = int(rng, 4, 10);

  const c = Math.sqrt(a * a + b * b);

  if (!Number.isInteger(c)) {
    return geometryQ4(rng);
  }

  return makeQuestionWithRng(rng, {
    id: 'geometry-q4',
    topic: 'Geometry & Algebra',
    question: `A right triangle has legs ${a} and ${b}. What is the hypotenuse?`,
    correct: String(c),
    distractors: [String(a + b), String(Math.abs(b - a)), String(c + 1)],
    explanationEn: `By the Pythagorean theorem, c² = ${a}² + ${b}². Thus c = ${c}.`,
    explanationBn: `Pythagorean theorem অনুযায়ী c² = ${a}² + ${b}²। তাই c = ${c}।`,
  });
}

function geometryQ5(rng: RNG): MathQuestion {
  const x = int(rng, 2, 8);
  const answer = x + 5;

  return makeQuestionWithRng(rng, {
    id: 'geometry-q5',
    topic: 'Geometry & Algebra',
    question: `Solve x + 5 = ${answer}.`,
    correct: String(x),
    distractors: [String(x + 1), String(x - 1), String(answer)],
    explanationEn: `Subtract 5 from both sides: x = ${answer} - 5 = ${x}.`,
    explanationBn: `উভয় পাশ থেকে 5 বিয়োগ করলে x = ${answer} - 5 = ${x}।`,
  });
}

function geometryQ6(rng: RNG): MathQuestion {
  const x = int(rng, 2, 7);
  const answer = x ** 2;

  return makeQuestionWithRng(rng, {
    id: 'geometry-q6',
    topic: 'Geometry & Algebra',
    question: `What is the positive solution of x² = ${answer}?`,
    correct: String(x),
    distractors: [String(-x), String(x + 1), String(Math.max(1, x - 1))],
    explanationEn: `x² = ${answer} gives x = ±${x}. The positive solution is ${x}.`,
    explanationBn: `x² = ${answer} থেকে x = ±${x}। Positive solution হলো ${x}।`,
  });
}

function geometryQ7(rng: RNG): MathQuestion {
  const a = int(rng, 2, 6);
  const b = int(rng, 1, 5);

  return makeQuestionWithRng(rng, {
    id: 'geometry-q7',
    topic: 'Geometry & Algebra',
    question: `Factor x² + ${a + b}x + ${a * b}.`,
    correct: `(x + ${a})(x + ${b})`,
    distractors: [
      `(x - ${a})(x - ${b})`,
      `(x + ${a})(x - ${b})`,
      `(x - ${a})(x + ${b})`,
    ],
    explanationEn: `The two numbers ${a} and ${b} have sum ${a + b} and product ${a * b}. Therefore the factorization is (x + ${a})(x + ${b}).`,
    explanationBn: `${a} এবং ${b}-এর যোগফল ${a + b} এবং গুণফল ${a * b}। তাই factorization হলো (x + ${a})(x + ${b})।`,
  });
}

function geometryQ8(rng: RNG): MathQuestion {
  const a = int(rng, 2, 8);
  const b = int(rng, 2, 8);

  return makeQuestionWithRng(rng, {
    id: 'geometry-q8',
    topic: 'Geometry & Algebra',
    question: `What is the distance between (${a}, ${b}) and (${a}, ${-b})?`,
    correct: String(2 * b),
    distractors: [String(a), String(b), String(a + b)],
    explanationEn: `The points have the same x-coordinate, so the distance is the vertical difference: ${b} - (${-b}) = ${2 * b}.`,
    explanationBn: `দুটি point-এর x-coordinate একই। তাই vertical distance = ${b} - (${-b}) = ${2 * b}।`,
  });
}

function geometryQ9(rng: RNG): MathQuestion {
  const angle1 = int(rng, 30, 80);
  const angle2 = int(rng, 30, 80);

  const angle3 = 180 - angle1 - angle2;

  if (angle3 <= 0) {
    return geometryQ9(rng);
  }

  return makeQuestionWithRng(rng, {
    id: 'geometry-q9',
    topic: 'Geometry & Algebra',
    question: `A triangle has angles ${angle1}° and ${angle2}°. What is the third angle?`,
    correct: `${angle3}°`,
    distractors: [
      `${angle3 + 5}°`,
      `${Math.max(1, angle3 - 5)}°`,
      `${180 - angle3}°`,
    ],
    explanationEn: `The angles of a triangle sum to 180°. Therefore the third angle is 180° - ${angle1}° - ${angle2}° = ${angle3}°.`,
    explanationBn: `Triangle-এর তিনটি angle-এর যোগফল 180°। তাই third angle = 180° - ${angle1}° - ${angle2}° = ${angle3}°।`,
  });
}

function geometryQ10(rng: RNG): MathQuestion {
  const a = int(rng, 2, 8);

  return makeQuestionWithRng(rng, {
    id: 'geometry-q10',
    topic: 'Geometry & Algebra',
    question: `What is the slope of the line y = ${a}x + 3?`,
    correct: String(a),
    distractors: ['3', String(a + 3), String(a - 3)],
    explanationEn: `In y = mx + c, m is the slope. Therefore the slope is ${a}.`,
    explanationBn: `y = mx + c-এ m হলো slope। এখানে m = ${a}, তাই slope = ${a}।`,
  });
}

function geometryQ11(rng: RNG): MathQuestion {
  const a = int(rng, 2, 8);
  const b = int(rng, 2, 8);

  return makeQuestionWithRng(rng, {
    id: 'geometry-q11',
    topic: 'Geometry & Algebra',
    question: `What is the midpoint of (${a}, 0) and (0, ${b})?`,
    correct: `(${a / 2}, ${b / 2})`,
    distractors: [
      `(${a}, ${b})`,
      `(${b / 2}, ${a / 2})`,
      `(${a + b}, ${a + b})`,
    ],
    explanationEn: `The midpoint is ((x₁+x₂)/2, (y₁+y₂)/2). Thus the midpoint is (${a / 2}, ${b / 2}).`,
    explanationBn: `Midpoint-এর সূত্র ((x₁+x₂)/2, (y₁+y₂)/2)। তাই midpoint = (${a / 2}, ${b / 2})।`,
  });
}

function geometryQ12(rng: RNG): MathQuestion {
  const a = int(rng, 2, 8);
  const b = int(rng, 2, 8);

  return makeQuestionWithRng(rng, {
    id: 'geometry-q12',
    topic: 'Geometry & Algebra',
    question: `Simplify ${a}x + ${b}x.`,
    correct: `${a + b}x`,
    distractors: [`${a * b}x`, `${a + b}`, `${a - b}x`],
    explanationEn: `These are like terms, so add their coefficients: ${a}x + ${b}x = ${a + b}x.`,
    explanationBn: `এগুলো like terms। তাই coefficient যোগ করলে ${a}x + ${b}x = ${a + b}x।`,
  });
}

// ============================================================
// PROBABILITY & STATISTICS
// ============================================================

function probabilityQ1(rng: RNG): MathQuestion {
  const favorable = int(rng, 1, 5);
  const total = int(rng, favorable + 2, 10);

  return makeQuestionWithRng(rng, {
    id: 'probability-q1',
    topic: 'Probability & Statistics',
    question: `An event has ${favorable} favorable outcomes out of ${total} equally likely outcomes. What is its probability?`,
    correct: `${favorable}/${total}`,
    distractors: [
      `${total}/${favorable}`,
      `${favorable + 1}/${total}`,
      `${favorable}/${total + 1}`,
    ],
    explanationEn: `Probability = favorable outcomes / total outcomes = ${favorable}/${total}.`,
    explanationBn: `Probability = favorable outcomes / total outcomes = ${favorable}/${total}।`,
  });
}

function probabilityQ2(rng: RNG): MathQuestion {
  const favorable = int(rng, 1, 4);
  const total = 8;

  return makeQuestionWithRng(rng, {
    id: 'probability-q2',
    topic: 'Probability & Statistics',
    question: `A fair die is rolled. What is the probability of an event with ${favorable} favorable outcomes?`,
    correct: `${favorable}/6`,
    distractors: [`6/${favorable}`, `${favorable}/8`, `${favorable + 1}/6`],
    explanationEn: `A fair die has 6 equally likely outcomes. Therefore the probability is favorable outcomes divided by 6.`,
    explanationBn: `একটি fair die-তে 6টি equally likely outcome থাকে। তাই probability = favorable outcomes / 6।`,
  });
}

function probabilityQ3(rng: RNG): MathQuestion {
  const n = int(rng, 4, 8);

  return makeQuestionWithRng(rng, {
    id: 'probability-q3',
    topic: 'Probability & Statistics',
    question: `What is the probability of getting an even number when a fair six-sided die is rolled?`,
    correct: '1/2',
    distractors: ['1/3', '2/3', '1/6'],
    explanationEn: `The even outcomes are 2, 4, and 6: 3 favorable outcomes out of 6. Thus 3/6 = 1/2.`,
    explanationBn: `Even outcomes হলো 2, 4, 6 — মোট 3টি। তাই probability = 3/6 = 1/2।`,
  });
}

function probabilityQ4(rng: RNG): MathQuestion {
  const values = [int(rng, 1, 10), int(rng, 1, 10), int(rng, 1, 10)];

  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;

  return makeQuestionWithRng(rng, {
    id: 'probability-q4',
    topic: 'Probability & Statistics',
    question: `What is the mean of ${values.join(', ')}?`,
    correct: String(mean),
    distractors: [
      String(mean + 1),
      String(Math.max(0, mean - 1)),
      String(values[0]),
    ],
    explanationEn: `Mean = sum of values / number of values = (${values.join(' + ')}) / 3 = ${mean}.`,
    explanationBn: `Mean = সব মানের যোগফল / মানের সংখ্যা = (${values.join(' + ')}) / 3 = ${mean}।`,
  });
}

function probabilityQ5(rng: RNG): MathQuestion {
  const values = [
    int(rng, 1, 20),
    int(rng, 1, 20),
    int(rng, 1, 20),
    int(rng, 1, 20),
    int(rng, 1, 20),
  ].sort((a, b) => a - b);

  const median = values[2];

  return makeQuestionWithRng(rng, {
    id: 'probability-q5',
    topic: 'Probability & Statistics',
    question: `What is the median of ${values.join(', ')}?`,
    correct: String(median),
    distractors: [String(values[0]), String(values[1]), String(values[4])],
    explanationEn: `There are five ordered values, so the middle value is the third one. Therefore the median is ${median}.`,
    explanationBn: `পাঁচটি ordered value-এর ক্ষেত্রে মাঝের অর্থাৎ তৃতীয় value-টি median। তাই median = ${median}।`,
  });
}

function probabilityQ6(rng: RNG): MathQuestion {
  const p = int(rng, 1, 5);
  const q = int(rng, p + 1, 9);

  return makeQuestionWithRng(rng, {
    id: 'probability-q6',
    topic: 'Probability & Statistics',
    question: `If P(A) = ${p}/${q}, what is P(not A)?`,
    correct: `${q - p}/${q}`,
    distractors: [`${p}/${q}`, `${q}/${p}`, `${p + 1}/${q}`],
    explanationEn: `For a complementary event, P(not A) = 1 - P(A) = 1 - ${p}/${q} = ${q - p}/${q}.`,
    explanationBn: `Complementary event-এর জন্য P(not A) = 1 - P(A) = 1 - ${p}/${q} = ${q - p}/${q}।`,
  });
}

function probabilityQ7(rng: RNG): MathQuestion {
  const a = int(rng, 2, 5);
  const b = int(rng, 2, 5);

  return makeQuestionWithRng(rng, {
    id: 'probability-q7',
    topic: 'Probability & Statistics',
    question: `If two independent events have probabilities ${a}/10 and ${b}/10, what is the probability that both occur?`,
    correct: `${a * b}/100`,
    distractors: [`${a + b}/10`, `${Math.abs(a - b)}/10`, `${a * b}/10`],
    explanationEn: `For independent events, multiply the probabilities: (${a}/10) × (${b}/10) = ${a * b}/100.`,
    explanationBn: `Independent event-এর ক্ষেত্রে probability গুণ করতে হয়: (${a}/10) × (${b}/10) = ${a * b}/100।`,
  });
}

function probabilityQ8(rng: RNG): MathQuestion {
  const a = int(rng, 1, 3);
  const b = int(rng, 1, 3);

  const pA = a / 10;
  const pB = b / 10;

  return makeQuestionWithRng(rng, {
    id: 'probability-q8',
    topic: 'Probability & Statistics',
    question: `If events A and B are mutually exclusive with P(A) = ${pA} and P(B) = ${pB}, what is P(A ∪ B)?`,
    correct: String(pA + pB),
    distractors: [
      String(pA * pB),
      String(Math.abs(pA - pB)),
      String(Math.min(1, pA + pB + 0.1)),
    ],
    explanationEn: `For mutually exclusive events, P(A ∪ B) = P(A) + P(B) = ${pA} + ${pB} = ${pA + pB}.`,
    explanationBn: `Mutually exclusive event-এর ক্ষেত্রে P(A ∪ B) = P(A) + P(B) = ${pA} + ${pB} = ${pA + pB}।`,
  });
}

function probabilityQ9(rng: RNG): MathQuestion {
  const values = [
    int(rng, 1, 10),
    int(rng, 1, 10),
    int(rng, 1, 10),
    int(rng, 1, 10),
  ];

  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min;

  return makeQuestionWithRng(rng, {
    id: 'probability-q9',
    topic: 'Probability & Statistics',
    question: `What is the range of the data ${values.join(', ')}?`,
    correct: String(range),
    distractors: [String(max), String(min), String(range + 1)],
    explanationEn: `Range = maximum - minimum = ${max} - ${min} = ${range}.`,
    explanationBn: `Range = maximum - minimum = ${max} - ${min} = ${range}।`,
  });
}

function probabilityQ10(rng: RNG): MathQuestion {
  const n = int(rng, 3, 6);

  return makeQuestionWithRng(rng, {
    id: 'probability-q10',
    topic: 'Probability & Statistics',
    question: `How many outcomes are possible when ${n} coins are tossed?`,
    correct: String(2 ** n),
    distractors: [String(2 * n), String(n ** 2), String(2 ** n - 1)],
    explanationEn: `Each coin has 2 outcomes. For ${n} coins, the number of outcomes is 2^${n} = ${2 ** n}.`,
    explanationBn: `প্রতিটি coin-এর 2টি outcome। ${n}টি coin-এর জন্য মোট outcome = 2^${n} = ${2 ** n}।`,
  });
}

function probabilityQ11(rng: RNG): MathQuestion {
  const n = int(rng, 3, 6);

  return makeQuestionWithRng(rng, {
    id: 'probability-q11',
    topic: 'Probability & Statistics',
    question: `What is the probability of getting all heads when ${n} fair coins are tossed?`,
    correct: `1/${2 ** n}`,
    distractors: [`${n}/2`, `1/${n}`, `${2 ** n}/2`],
    explanationEn: `Each coin has probability 1/2 of heads. Therefore P(all heads) = (1/2)^${n} = 1/${2 ** n}.`,
    explanationBn: `প্রতিটি coin-এ head আসার probability 1/2। তাই P(all heads) = (1/2)^${n} = 1/${2 ** n}।`,
  });
}

function probabilityQ12(rng: RNG): MathQuestion {
  const values = [
    int(rng, 1, 10),
    int(rng, 1, 10),
    int(rng, 1, 10),
    int(rng, 1, 10),
  ];

  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;

  return makeQuestionWithRng(rng, {
    id: 'probability-q12',
    topic: 'Probability & Statistics',
    question: `If every value in a data set is increased by 3, how does the mean change?`,
    correct: `It increases by 3`,
    distractors: [
      `It increases by 6`,
      `It does not change`,
      `It decreases by 3`,
    ],
    explanationEn: `Adding the same constant to every data value increases the mean by that constant. Therefore the mean increases by 3.`,
    explanationBn: `প্রতিটি data value-এর সাথে একই constant যোগ করলে mean-ও সেই constant পরিমাণ বাড়ে। তাই mean 3 বাড়বে।`,
  });
}

// ============================================================
// GENERATOR BANK
// ============================================================

const SETS_GENERATORS: QuestionGenerator[] = [
  setsQ1,
  setsQ2,
  setsQ3,
  setsQ4,
  setsQ5,
  setsQ6,
  setsQ7,
  setsQ8,
  setsQ9,
  setsQ10,
  setsQ11,
  setsQ12,
];

const FUNCTIONS_GENERATORS: QuestionGenerator[] = [
  functionsQ1,
  functionsQ2,
  functionsQ3,
  functionsQ4,
  functionsQ5,
  functionsQ6,
  functionsQ7,
  functionsQ8,
  functionsQ9,
  functionsQ10,
  functionsQ11,
  functionsQ12,
];

const GEOMETRY_GENERATORS: QuestionGenerator[] = [
  geometryQ1,
  geometryQ2,
  geometryQ3,
  geometryQ4,
  geometryQ5,
  geometryQ6,
  geometryQ7,
  geometryQ8,
  geometryQ9,
  geometryQ10,
  geometryQ11,
  geometryQ12,
];

const PROBABILITY_GENERATORS: QuestionGenerator[] = [
  probabilityQ1,
  probabilityQ2,
  probabilityQ3,
  probabilityQ4,
  probabilityQ5,
  probabilityQ6,
  probabilityQ7,
  probabilityQ8,
  probabilityQ9,
  probabilityQ10,
  probabilityQ11,
  probabilityQ12,
];

// ============================================================
// CATEGORY GENERATION
// ============================================================

function generateCategory(
  generators: QuestionGenerator[],
  rng: RNG,
  count: number,
): MathQuestion[] {
  const selected = shuffle(rng, generators).slice(0, count);

  return selected.map((generator, index) => generator(rng, index));
}

// ============================================================
// DUPLICATE PROTECTION
// ============================================================

function hasDuplicateQuestions(questions: MathQuestion[]): boolean {
  const seen = new Set<string>();

  for (const question of questions) {
    const key = normalizeQuestion(question.question);

    if (seen.has(key)) {
      return true;
    }

    seen.add(key);
  }

  return false;
}

// ============================================================
// NUMBER QUESTIONS
// ============================================================

function numberQuestions(questions: MathQuestion[]): MathQuestion[] {
  return questions.map((question, index) => ({
    ...question,
    number: index + 1,
  }));
}

// ============================================================
// MAIN GENERATOR
// ============================================================

export function generateMathMockExam(
  options: GenerateMathMockExamOptions = {},
): MathMockExam {
  const mode = options.mode ?? 'single';

  const examNumber =
    options.examNumber ?? Math.floor(Math.random() * 1_000_000_000);

  const seed = options.seed ?? `CSCA-MATH-${examNumber}`;

  let attempt = 0;
  let questions: MathQuestion[] = [];

  while (attempt < 20) {
    const attemptSeed = `${seed}-attempt-${attempt}`;

    const rng = createSeededRng(attemptSeed);

    const setsQuestions = generateCategory(SETS_GENERATORS, rng, 12);

    const functionsQuestions = generateCategory(FUNCTIONS_GENERATORS, rng, 12);

    const geometryQuestions = generateCategory(GEOMETRY_GENERATORS, rng, 12);

    const probabilityQuestions = generateCategory(
      PROBABILITY_GENERATORS,
      rng,
      12,
    );

    questions = shuffle(rng, [
      ...setsQuestions,
      ...functionsQuestions,
      ...geometryQuestions,
      ...probabilityQuestions,
    ]);

    if (!hasDuplicateQuestions(questions)) {
      break;
    }

    attempt++;
  }

  questions = numberQuestions(questions);

  return {
    examId: `CSCA-MATH-${examNumber}-${hashString(String(seed))}`,
    examNumber,
    title: `CSCA Mathematics Mock Test ${examNumber}`,
    subject: 'Mathematics',
    durationMinutes: 50,
    totalQuestions: 48,
    mode,
    questions,
  };
}

// ============================================================
// GENERATE A COMPLETELY NEW EXAM
// ============================================================

export function generateNewMathMockExam(
  mode: QuizMode = 'single',
): MathMockExam {
  const seed = randomSeed();

  return generateMathMockExam({
    mode,
    seed,
    examNumber: Math.floor(Math.random() * 1_000_000_000),
  });
}

// ============================================================
// GENERATE FROM EXAM NUMBER
// ============================================================

export function generateMathMockExamByNumber(
  examNumber: number,
  mode: QuizMode = 'single',
): MathMockExam {
  return generateMathMockExam({
    examNumber,
    mode,
    seed: `CSCA-MATH-${examNumber}`,
  });
}

// ============================================================
// GET EXPLANATION ACCORDING TO NAVBAR LANGUAGE
// ============================================================

export function getMathExplanation(
  question: MathQuestion,
  language: ExplanationLanguage,
): string {
  return question.explanation[language];
}

// ============================================================
// GET ONLY ENGLISH EXPLANATION
// ============================================================

export function getEnglishExplanation(question: MathQuestion): string {
  return question.explanation.en;
}

// ============================================================
// GET ONLY BANGLA EXPLANATION
// ============================================================

export function getBanglaExplanation(question: MathQuestion): string {
  return question.explanation.bn;
}

// ============================================================
// CATEGORY COUNTS
// ============================================================

export function getMathCategoryCounts(
  exam: MathMockExam,
): Record<MathTopic, number> {
  return {
    'Sets & Inequalities': exam.questions.filter(
      q => q.topic === 'Sets & Inequalities',
    ).length,

    'Functions & Calculus': exam.questions.filter(
      q => q.topic === 'Functions & Calculus',
    ).length,

    'Geometry & Algebra': exam.questions.filter(
      q => q.topic === 'Geometry & Algebra',
    ).length,

    'Probability & Statistics': exam.questions.filter(
      q => q.topic === 'Probability & Statistics',
    ).length,
  };
}

// ============================================================
// VALIDATE EXAM
// ============================================================

export function validateMathMockExam(exam: MathMockExam): boolean {
  if (exam.questions.length !== 48) {
    return false;
  }

  if (exam.durationMinutes !== 50) {
    return false;
  }

  const counts = getMathCategoryCounts(exam);

  if (counts['Sets & Inequalities'] !== 12) {
    return false;
  }

  if (counts['Functions & Calculus'] !== 12) {
    return false;
  }

  if (counts['Geometry & Algebra'] !== 12) {
    return false;
  }

  if (counts['Probability & Statistics'] !== 12) {
    return false;
  }

  if (hasDuplicateQuestions(exam.questions)) {
    return false;
  }

  return true;
}
