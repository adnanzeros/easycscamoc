// mathQuestionGenerator.ts
// CSCA Mathematics unlimited-style mock generator
// Questions + options are English.
// Explanations are available in English and Bangla.
// Generates 48 questions per exam: 12 per module.
// No external API is required.

export type OptionId = 'A' | 'B' | 'C' | 'D';
export type QuizMode = 'single' | 'all';
export type ExplanationLanguage = 'en' | 'bn';

export type MathQuestion = {
  id: string;
  number: number;
  topic: string;
  question: string;
  options: { id: OptionId; text: string }[];
  correctOption: OptionId;
  explanation: { en: string; bn: string };
};

export type MathMockExam = {
  examId: string;
  examNumber: number;
  title: string;
  subject: 'Mathematics';
  durationMinutes: 50;
  totalQuestions: 48;
  mode: QuizMode;
  questions: MathQuestion[];
};

const IDS: OptionId[] = ['A', 'B', 'C', 'D'];

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s ^ (s >>> 16), 0x45d9f3b) + 0x12345) >>> 0;
    s = (Math.imul(s ^ (s >>> 13), 0x45d9f3b) + 0x67890) >>> 0;
    return ((s ^ (s >>> 16)) >>> 0) / 4294967296;
  };
}

function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function int(r: () => number, min: number, max: number) {
  return Math.floor(r() * (max - min + 1)) + min;
}

function pick<T>(r: () => number, a: T[]): T {
  return a[int(r, 0, a.length - 1)];
}

function shuffle<T>(r: () => number, arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = int(r, 0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function uniqueStrings(
  values: string[],
  answer: string,
  r: () => number,
): string[] {
  const out = [answer];
  for (const v of values) {
    if (!out.includes(v)) out.push(v);
    if (out.length === 4) break;
  }
  while (out.length < 4) {
    const candidate = String(int(r, -20, 50));
    if (!out.includes(candidate)) out.push(candidate);
  }
  return out;
}

function makeQ(
  id: string,
  topic: string,
  question: string,
  answer: string,
  distractors: string[],
  en: string,
  bn: string,
  r: () => number,
): Omit<MathQuestion, 'id' | 'number'> {
  const texts = uniqueStrings(distractors, answer, r);
  const shuffled = shuffle(r, texts);
  const correctIndex = shuffled.indexOf(answer);

  return {
    topic,
    question,
    options: shuffled.map((text, i) => ({ id: IDS[i], text })),
    correctOption: IDS[correctIndex],
    explanation: { en, bn },
  };
}

function q1(r: () => number) {
  const a = int(r, 2, 9);
  const b = int(r, 2, 9);
  const c = a + b;
  return makeQ(
    'sets-intersection',
    'Sets & Inequalities',
    `If A = {${a},${b},${c}} and B = {${b},${c},${c + 1}}, what is A ∩ B?`,
    `{${b},${c}}`,
    [`{${a},${b}}`, `{${a},${b},${c}}`, `{${c + 1}}`],
    `The common elements of A and B are ${b} and ${c}, so A ∩ B = {${b},${c}}.`,
    `A ও B-এর common element হলো ${b} এবং ${c}। তাই A ∩ B = {${b},${c}}।`,
    r,
  );
}

function q2(r: () => number) {
  const a = int(r, 1, 8);
  const b = int(r, 1, 8);
  const universe = [a, b, a + 1, b + 2].filter(
    (x, i, arr) => arr.indexOf(x) === i,
  );
  const A = [a, b];
  const comp = universe.filter(x => !A.includes(x));
  return makeQ(
    'sets-complement',
    'Sets & Inequalities',
    `If U = {${universe.join(',')}} and A = {${A.join(',')}}, find A′.`,
    `{${comp.join(',')}}`,
    [`{${A.join(',')}}`, `{${universe.join(',')}}`, '∅'],
    `A′ contains the elements of U that are not in A. Therefore A′ = {${comp.join(',')}}.`,
    `A′-তে U-এর যেসব উপাদান A-তে নেই সেগুলো থাকে। তাই A′ = {${comp.join(',')}}।`,
    r,
  );
}

function q3(r: () => number) {
  const a = int(r, 2, 9);
  const b = int(r, 1, 8);
  const rhs = a * b + b;
  const answer = `x > ${b}`;
  return makeQ(
    'linear-inequality',
    'Sets & Inequalities',
    `Solve ${a}x − ${b} > ${rhs}.`,
    answer,
    [`x < ${b}`, `x ≥ ${b}`, `x > ${a + b}`, `x < ${a}`],
    `Add ${b} to both sides: ${a}x > ${a * b}. Dividing by the positive number ${a} gives x > ${b}.`,
    `উভয় পাশে ${b} যোগ করলে ${a}x > ${a * b}। ধনাত্মক ${a} দিয়ে ভাগ করলে x > ${b}।`,
    r,
  );
}

function q4(r: () => number) {
  const h = int(r, -5, 5);
  const d = int(r, 2, 7);
  return makeQ(
    'absolute-value',
    'Sets & Inequalities',
    `Solve |x − ${h}| < ${d}.`,
    `${h - d} < x < ${h + d}`,
    [
      `x < ${h + d}`,
      `x > ${h - d}`,
      `${h} < x < ${h + d}`,
      `${-h - d} < x < ${h + d}`,
    ],
    `Rewrite as −${d} < x − ${h} < ${d}. Adding ${h} gives ${h - d} < x < ${h + d}.`,
    `−${d} < x − ${h} < ${d} লিখে ${h} যোগ করলে ${h - d} < x < ${h + d}।`,
    r,
  );
}

function q5(r: () => number) {
  const p = int(r, 1, 8);
  const q = int(r, p + 1, p + 8);
  const answer = `${p} < x < ${q}`;
  return makeQ(
    'quadratic-inequality',
    'Sets & Inequalities',
    `Solve (x − ${p})(x − ${q}) < 0.`,
    answer,
    [
      `x < ${p} or x > ${q}`,
      `x ≤ ${p} or x ≥ ${q}`,
      `${p} ≤ x ≤ ${q}`,
      `x > ${q}`,
    ],
    `A product of two linear factors is negative between its distinct roots. Therefore ${p} < x < ${q}.`,
    `দুইটি distinct root-এর মাঝখানে product negative হয়। তাই ${p} < x < ${q}।`,
    r,
  );
}

function q6(r: () => number) {
  const a = int(r, 1, 5);
  const b = int(r, 2, 6);
  return makeQ(
    'cartesian-product',
    'Sets & Inequalities',
    `If A = {${a},${a + 1}} and B = {${b},${b + 1}}, how many elements are in A × B?`,
    '4',
    ['2', '3', '6'],
    `A has 2 elements and B has 2 elements. Therefore |A × B| = 2 × 2 = 4.`,
    `A-তে ২টি এবং B-তে ২টি উপাদান আছে। তাই |A × B| = ২ × ২ = ৪।`,
    r,
  );
}

function q7(r: () => number) {
  const n = int(r, 2, 5);
  const answer = String(2 ** n);
  return makeQ(
    'power-set',
    'Sets & Inequalities',
    `If a set has ${n} elements, how many elements does its power set have?`,
    answer,
    [String(n), String(n * 2), String(n * n)],
    `A set with n elements has 2ⁿ subsets. Here 2^${n} = ${answer}.`,
    `nটি উপাদানের set-এর power set-এ 2ⁿটি subset থাকে। এখানে 2^${n} = ${answer}।`,
    r,
  );
}

function q8(r: () => number) {
  const a = int(r, 2, 7);
  const answer = `x ≤ ${a} or x ≥ ${a + 2}`;
  return makeQ(
    'absolute-greater',
    'Sets & Inequalities',
    `Solve |x − ${a + 1}| ≥ 1.`,
    answer,
    [`${a} < x < ${a + 2}`, `x ≥ ${a + 1}`, `x ≤ ${a + 1}`],
    `|x − ${a + 1}| ≥ 1 means x − ${a + 1} ≥ 1 or x − ${a + 1} ≤ −1. Thus x ≥ ${a + 2} or x ≤ ${a}.`,
    `|x − ${a + 1}| ≥ 1 হলে x ≥ ${a + 2} অথবা x ≤ ${a}।`,
    r,
  );
}

function q9(r: () => number) {
  const a = int(r, 1, 8);
  const answer = `[${a}, ∞)`;
  return makeQ(
    'interval',
    'Sets & Inequalities',
    `Which interval represents x ≥ ${a}?`,
    answer,
    [`(${a}, ∞)`, `(−∞, ${a}]`, `(−∞, ${a})`],
    `The square bracket includes ${a}, so the interval is [${a}, ∞).`,
    `Square bracket ${a}-কে অন্তর্ভুক্ত করে, তাই interval হলো [${a}, ∞)।`,
    r,
  );
}

function q10(r: () => number) {
  const a = int(r, 2, 8);
  const b = a + int(r, 2, 6);
  const answer = `x < ${a} or x > ${b}`;
  return makeQ(
    'rational-inequality',
    'Sets & Inequalities',
    `Solve (x − ${b})/(x − ${a}) > 0.`,
    answer,
    [`${a} < x < ${b}`, `x ≤ ${a}`, `x ≥ ${b}`, `x < ${a} or x ≤ ${b}`],
    `The critical points are ${a} and ${b}. The numerator and denominator have the same sign outside the two critical points, so the quotient is positive for x < ${a} or x > ${b}.`,
    `Critical point হলো ${a} ও ${b}। দুই critical point-এর বাইরে numerator ও denominator-এর sign একই, তাই x < ${a} অথবা x > ${b}।`,
    r,
  );
}

function q11(r: () => number) {
  const a = int(r, 2, 8);
  const b = int(r, 2, 8);
  const c = a * b;
  return makeQ(
    'quadratic-roots',
    'Sets & Inequalities',
    `For x² − ${a + b}x + ${c} = 0, what are the roots?`,
    `${a} and ${b}`,
    [`${a + 1} and ${b + 1}`, `${-a} and ${-b}`, `${a} and ${-b}`],
    `The equation factors as (x − ${a})(x − ${b}) = 0, so the roots are ${a} and ${b}.`,
    `সমীকরণটি (x − ${a})(x − ${b}) = 0 আকারে factor হয়। তাই root হলো ${a} ও ${b}।`,
    r,
  );
}

function q12(r: () => number) {
  const a = int(r, 2, 9);
  const b = int(r, 1, 8);
  const answer = `[${a}, ${a + b}]`;
  return makeQ(
    'interval-notation',
    'Sets & Inequalities',
    `Which interval includes x = ${a} and x = ${a + b}, with both endpoints included?`,
    answer,
    [`(${a}, ${a + b})`, `[${a}, ${a + b})`, `(${a}, ${a + b}]`],
    `Included endpoints are written with square brackets, so the interval is [${a}, ${a + b}].`,
    `Endpoint দুটোই included, তাই square bracket ব্যবহার করে [${a}, ${a + b}]।`,
    r,
  );
}

// Functions & Calculus
function q13(r: () => number) {
  const a = int(r, 2, 9);
  return makeQ(
    'sqrt-domain',
    'Functions & Calculus',
    `What is the domain of f(x) = √(x − ${a})?`,
    `[${a}, ∞)`,
    [`(${a}, ∞)`, `(−∞, ${a}]`, 'All real numbers'],
    `The expression inside a square root must be non-negative: x − ${a} ≥ 0. Hence x ≥ ${a}.`,
    `Square root-এর ভিতরের অংশ non-negative হতে হবে: x − ${a} ≥ 0। তাই x ≥ ${a}।`,
    r,
  );
}

function q14(r: () => number) {
  const a = int(r, 2, 7);
  return makeQ(
    'odd-function',
    'Functions & Calculus',
    `Which function is odd?`,
    `f(x) = x^${a} + x`,
    [`f(x) = x² + ${a}`, `f(x) = cos x`, `f(x) = e^x`],
    `Both x^${a} (with odd exponent) and x are odd, so their sum is odd.`,
    `x^${a} এবং x উভয়ই odd term, তাই তাদের যোগফলও odd function।`,
    r,
  );
}

function q15(r: () => number) {
  const a = int(r, 1, 9);
  const d = int(r, 1, 6);
  const n = int(r, 5, 12);
  const s = (n / 2) * (2 * a + (n - 1) * d);
  return makeQ(
    'arithmetic-sum',
    'Functions & Calculus',
    `Find the sum of the first ${n} terms of an arithmetic sequence where a₁ = ${a} and d = ${d}.`,
    String(s),
    [String(s + d), String(s - a), String(a + n * d)],
    `Use Sₙ = n/2[2a₁ + (n−1)d]. Substitution gives Sₙ = ${s}.`,
    `Sₙ = n/2[2a₁ + (n−1)d] সূত্র ব্যবহার করলে Sₙ = ${s}।`,
    r,
  );
}

function q16(r: () => number) {
  const p = int(r, 2, 6);
  const q = int(r, 1, 8);
  return makeQ(
    'derivative-polynomial',
    'Functions & Calculus',
    `Find the derivative of f(x) = x^${p} − ${q}x + 1.`,
    `${p}x^${p - 1} − ${q}`,
    [`${p}x^${p} − ${q}`, `x^${p - 1} − ${q}`, `${p}x^${p - 1} + ${q}`],
    `By the power rule, d(x^${p})/dx = ${p}x^${p - 1} and d(−${q}x)/dx = −${q}.`,
    `Power rule অনুযায়ী d(x^${p})/dx = ${p}x^${p - 1} এবং d(−${q}x)/dx = −${q}।`,
    r,
  );
}

function q17(r: () => number) {
  const base = pick(r, [2, 3, 5]);
  const exp = int(r, 2, 5);
  const value = base ** exp;
  return makeQ(
    'logarithm',
    'Functions & Calculus',
    `Evaluate log_${base}(${value}).`,
    String(exp),
    [String(exp + 1), String(exp - 1), String(base)],
    `Because ${base}^${exp} = ${value}, log_${base}(${value}) = ${exp}.`,
    `কারণ ${base}^${exp} = ${value}, তাই log_${base}(${value}) = ${exp}।`,
    r,
  );
}

function q18(r: () => number) {
  return makeQ(
    'trig-range',
    'Functions & Calculus',
    `What is the range of f(x) = ${pick(r, ['sin(x)', 'cos(x)', '−sin(x)'])}?`,
    '[−1, 1]',
    ['(−1, 1)', '[0, 1]', '(−∞, ∞)'],
    `Sine and cosine values always lie between −1 and 1, inclusive.`,
    `Sine ও cosine-এর মান সবসময় −1 থেকে 1-এর মধ্যে থাকে, endpoint-সহ।`,
    r,
  );
}

function q19(r: () => number) {
  const a = int(r, 2, 6);
  return makeQ(
    'geometric-ratio',
    'Functions & Calculus',
    `Find the common ratio of ${a}, ${a * 3}, ${a * 9}, ${a * 27}, ...`,
    '3',
    ['2', '4', String(a)],
    `Each term is obtained by multiplying the previous term by 3, so the common ratio is 3.`,
    `প্রতিটি term আগের term-কে ৩ দিয়ে গুণ করে পাওয়া যায়, তাই common ratio 3।`,
    r,
  );
}

function q20(r: () => number) {
  const a = int(r, 1, 6);
  const ratio = pick(r, [2, 3]);
  const n = int(r, 4, 7);
  const answer = a * ratio ** (n - 1);
  return makeQ(
    'geometric-term',
    'Functions & Calculus',
    `Find a_${n} for a₁ = ${a} and common ratio r = ${ratio}.`,
    String(answer),
    [
      String(a * ratio ** n),
      String(answer / ratio),
      String(a + ratio * (n - 1)),
    ],
    `Use aₙ = a₁r^(n−1). Thus a_${n} = ${a}×${ratio}^${n - 1} = ${answer}.`,
    `aₙ = a₁r^(n−1) সূত্রে a_${n} = ${a}×${ratio}^${n - 1} = ${answer}।`,
    r,
  );
}

function q21(r: () => number) {
  const k = int(r, 1, 5);
  return makeQ(
    'even-function',
    'Functions & Calculus',
    `A function satisfying f(x) = f(−x) is called:`,
    'Even',
    ['Odd', 'Periodic', 'Monotonic'],
    `The equality f(x) = f(−x) is the defining property of an even function.`,
    `f(x) = f(−x) হলো even function-এর সংজ্ঞাগত বৈশিষ্ট্য।`,
    r,
  );
}

function q22(r: () => number) {
  const a = int(r, 1, 7);
  return makeQ(
    'ln-domain',
    'Functions & Calculus',
    `What is the domain of f(x) = ln(x − ${a})?`,
    `(${a}, ∞)`,
    [`[${a}, ∞)`, `(−∞, ${a})`, 'All real numbers'],
    `The logarithm argument must be positive: x − ${a} > 0, so x > ${a}.`,
    `Logarithm-এর ভিতরের অংশ positive হতে হবে: x − ${a} > 0, তাই x > ${a}।`,
    r,
  );
}

function q23(r: () => number) {
  const a = int(r, 1, 5);
  return makeQ(
    'exp-derivative',
    'Functions & Calculus',
    `If f(x) = e^(${a}x), what is f′(0)?`,
    String(a),
    ['1', '0', String(a + 1)],
    `f′(x) = ${a}e^(${a}x), so f′(0) = ${a}e^0 = ${a}.`,
    `f′(x) = ${a}e^(${a}x), তাই f′(0) = ${a}e^0 = ${a}।`,
    r,
  );
}

function q24(r: () => number) {
  const a = int(r, 1, 8);
  return makeQ(
    'cos-derivative',
    'Functions & Calculus',
    `What is the derivative of cos(${a}x)?`,
    `−${a}sin(${a}x)`,
    [`${a}sin(${a}x)`, `−sin(${a}x)`, `cos(${a}x)`],
    `By the chain rule, d/dx[cos(${a}x)] = −sin(${a}x)×${a} = −${a}sin(${a}x).`,
    `Chain rule অনুযায়ী derivative = −sin(${a}x)×${a} = −${a}sin(${a}x)।`,
    r,
  );
}

// Geometry & Algebra
function q25(r: () => number) {
  const h = int(r, -5, 5);
  const k = int(r, -5, 5);
  const radius = int(r, 2, 9);
  return makeQ(
    'circle',
    'Geometry & Algebra',
    `Find the center and radius of (x − ${h})² + (y − ${k})² = ${radius ** 2}.`,
    `(${h}, ${k}), ${radius}`,
    [
      `(${h}, ${k}), ${radius ** 2}`,
      `(${-h}, ${-k}), ${radius}`,
      `(${-h}, ${k}), ${radius}`,
    ],
    `Compare with (x−h)²+(y−k)²=r². Therefore the center is (${h}, ${k}) and the radius is ${radius}.`,
    `(x−h)²+(y−k)²=r²-এর সাথে তুলনা করলে center (${h}, ${k}) এবং radius ${radius}।`,
    r,
  );
}

function q26(r: () => number) {
  const ax = int(r, 1, 6),
    ay = int(r, 1, 6);
  const bx = int(r, -5, 5),
    by = int(r, -5, 5);
  const ans = ax * bx + ay * by;
  return makeQ(
    'dot-product',
    'Geometry & Algebra',
    `Find the dot product of a = (${ax},${ay}) and b = (${bx},${by}).`,
    String(ans),
    [String(ans + ax), String(ans - ay), String(ax * bx - ay * by)],
    `a·b = ${ax}(${bx}) + ${ay}(${by}) = ${ans}.`,
    `a·b = ${ax}(${bx}) + ${ay}(${by}) = ${ans}।`,
    r,
  );
}

function q27(r: () => number) {
  const n = int(r, 1, 30);
  const rem = n % 4;
  const answer = ['1', 'i', '−1', '−i'][rem];
  return makeQ(
    'complex-power',
    'Geometry & Algebra',
    `What is i^${n}?`,
    answer,
    ['1', 'i', '−1', '−i'].filter(x => x !== answer).slice(0, 3),
    `Powers of i repeat every 4: i, −1, −i, 1. Since ${n} mod 4 = ${rem}, the value is ${answer}.`,
    `i-এর power প্রতি ৪ ঘর পরপর repeat করে। ${n} mod 4 = ${rem}, তাই মান ${answer}।`,
    r,
  );
}

function q28(r: () => number) {
  const a = int(r, 1, 8);
  const b = int(r, 1, 8);
  return makeQ(
    'line-slope',
    'Geometry & Algebra',
    `Find the slope of ${a}x − ${b}y + 6 = 0.`,
    `${a}/${b}`,
    [`−${a}/${b}`, `${b}/${a}`, `${a + b}`],
    `Rearrange to y = (${a}/${b})x + 6/${b}. Therefore the slope is ${a}/${b}.`,
    `y = (${a}/${b})x + 6/${b} আকারে লিখলে slope = ${a}/${b}।`,
    r,
  );
}

function q29(r: () => number) {
  return makeQ(
    'hyperbola-eccentricity',
    'Geometry & Algebra',
    'What is the eccentricity of a rectangular hyperbola?',
    '√2',
    ['1', '0', '1/2'],
    `The eccentricity of a rectangular hyperbola is √2.`,
    `Rectangular hyperbola-এর eccentricity হলো √2।`,
    r,
  );
}

function q30(r: () => number) {
  const x1 = int(r, -6, 6),
    y1 = int(r, -6, 6);
  const x2 = x1 + int(r, 2, 8),
    y2 = y1 + int(r, 2, 8);
  const mx = (x1 + x2) / 2,
    my = (y1 + y2) / 2;
  const ans = `(${mx}, ${my})`;
  return makeQ(
    'midpoint',
    'Geometry & Algebra',
    `Find the midpoint of (${x1},${y1}) and (${x2},${y2}).`,
    ans,
    [`(${x1 + x2}, ${y1 + y2})`, `(${mx + 1}, ${my})`, `(${mx}, ${my + 1})`],
    `Midpoint = ((x₁+x₂)/2, (y₁+y₂)/2) = ${ans}.`,
    `Midpoint = ((x₁+x₂)/2, (y₁+y₂)/2) = ${ans}।`,
    r,
  );
}

function q31(r: () => number) {
  const a = int(r, 1, 9),
    b = int(r, 1, 9);
  return makeQ(
    'conjugate',
    'Geometry & Algebra',
    `What is the complex conjugate of ${a} + ${b}i?`,
    `${a} − ${b}i`,
    [`−${a} + ${b}i`, `−${a} − ${b}i`, `${b} + ${a}i`],
    `The conjugate changes the sign of the imaginary part, giving ${a} − ${b}i.`,
    `Conjugate নিলে imaginary part-এর sign পরিবর্তন হয়, তাই ${a} − ${b}i।`,
    r,
  );
}

function q32(r: () => number) {
  const m = int(r, -6, 6);
  return makeQ(
    'line-through-origin',
    'Geometry & Algebra',
    `Find the equation of a line through the origin with slope ${m}.`,
    `y = ${m}x`,
    [`y = x + ${m}`, `y = ${m}`, `x = ${m}y`],
    `A line through the origin has y = mx. With m = ${m}, the equation is y = ${m}x.`,
    `Origin দিয়ে যাওয়া line-এর equation y = mx। m = ${m}, তাই y = ${m}x।`,
    r,
  );
}

function q33(r: () => number) {
  const a = int(r, 2, 12),
    b = int(r, 2, 12);
  const mag = Math.sqrt(a * a + b * b);
  const ans = Number.isInteger(mag) ? String(mag) : `√${a * a + b * b}`;
  return makeQ(
    'vector-magnitude',
    'Geometry & Algebra',
    `Find the magnitude of vector (${a}, ${b}).`,
    ans,
    [String(a + b), String(Math.abs(a - b)), String(a * b)],
    `Magnitude = √(${a}² + ${b}²) = ${ans}.`,
    `Magnitude = √(${a}² + ${b}²) = ${ans}।`,
    r,
  );
}

function q34(r: () => number) {
  const m = int(r, -8, 8);
  return makeQ(
    'parallel-lines',
    'Geometry & Algebra',
    `Two distinct non-vertical lines are parallel when their slopes satisfy:`,
    'm₁ = m₂',
    ['m₁m₂ = −1', 'm₁ + m₂ = 0', 'm₁ = −m₂'],
    `Parallel non-vertical lines have equal slopes.`,
    `Parallel non-vertical line-এর slope সমান হয়।`,
    r,
  );
}

function q35(r: () => number) {
  const radius = int(r, 2, 12);
  return makeQ(
    'circle-area',
    'Geometry & Algebra',
    `What is the area of a circle with radius ${radius}?`,
    `${radius ** 2}π`,
    [`${2 * radius}π`, `${radius}π`, `${radius ** 2 + radius}π`],
    `Area = πr² = π(${radius})² = ${radius ** 2}π.`,
    `Area = πr² = π(${radius})² = ${radius ** 2}π।`,
    r,
  );
}

function q36(r: () => number) {
  const a = int(r, 1, 12),
    b = int(r, 1, 12);
  const sq = a * a + b * b;
  const ans = Number.isInteger(Math.sqrt(sq))
    ? String(Math.sqrt(sq))
    : `√${sq}`;
  return makeQ(
    'complex-modulus',
    'Geometry & Algebra',
    `What is the modulus of ${a} + ${b}i?`,
    ans,
    [String(a + b), String(Math.abs(a - b)), String(a * b)],
    `|a+bi| = √(a²+b²) = √(${sq}) = ${ans}.`,
    `|a+bi| = √(a²+b²) = √(${sq}) = ${ans}।`,
    r,
  );
}

// Probability & Statistics
function q37(r: () => number) {
  const favorable = int(r, 1, 3);
  const answer = `${favorable}/6`;
  return makeQ(
    'die-probability',
    'Probability & Statistics',
    `A fair die is rolled. If exactly ${favorable} outcomes are favorable, what is the probability of the event?`,
    answer,
    [`${favorable + 1}/6`, `1/${favorable}`, `${6 - favorable}/6`],
    `There are 6 equally likely outcomes. Probability = favorable outcomes / total outcomes = ${favorable}/6.`,
    `মোট ৬টি সমান সম্ভাব্য outcome। Probability = favorable/total = ${favorable}/6।`,
    r,
  );
}

function q38(r: () => number) {
  const n = 5;
  const start = int(r, 1, 15);
  const step = int(r, 1, 8);
  const vals = Array.from({ length: n }, (_, i) => start + i * step);
  const mean = vals.reduce((s, x) => s + x, 0) / n;
  return makeQ(
    'mean',
    'Probability & Statistics',
    `Find the mean of {${vals.join(', ')}}.`,
    String(mean),
    [String(mean + step), String(mean - 1), String(vals[0])],
    `Add the five values and divide by 5. The mean is ${mean}.`,
    `পাঁচটি মান যোগ করে ৫ দিয়ে ভাগ করলে mean = ${mean}।`,
    r,
  );
}

function q39(r: () => number) {
  const band = pick(r, [1, 2, 3]);
  const percentage = band === 1 ? '68%' : band === 2 ? '95%' : '99.7%';
  return makeQ(
    'normal-rule',
    'Probability & Statistics',
    `Approximately what percentage of a normal distribution lies within ${band} standard deviation${band > 1 ? 's' : ''} of the mean?`,
    percentage,
    band === 1
      ? ['95%', '50%', '99.7%']
      : band === 2
        ? ['68%', '50%', '99.7%']
        : ['68%', '95%', '50%'],
    `The empirical rule gives approximately 68%, 95%, and 99.7% within 1, 2, and 3 standard deviations respectively.`,
    `Empirical rule অনুযায়ী ±1, ±2, ±3 standard deviation-এর মধ্যে যথাক্রমে প্রায় 68%, 95%, 99.7% data থাকে।`,
    r,
  );
}

function q40(r: () => number) {
  const sd = int(r, 2, 12);
  const variance = sd * sd;
  return makeQ(
    'standard-deviation',
    'Probability & Statistics',
    `If the variance is ${variance}, what is the standard deviation?`,
    String(sd),
    [String(variance), String(sd + 2), String(sd * 2)],
    `Standard deviation is the square root of variance: √${variance} = ${sd}.`,
    `Standard deviation = √variance = √${variance} = ${sd}।`,
    r,
  );
}

function q41(r: () => number) {
  return makeQ(
    'impossible-event',
    'Probability & Statistics',
    'What is the probability of an impossible event?',
    '0',
    ['1', '1/2', '−1'],
    `An impossible event cannot occur, so its probability is 0.`,
    `Impossible event ঘটতে পারে না, তাই এর probability 0।`,
    r,
  );
}

function q42(r: () => number) {
  const n = int(r, 5, 7);
  const start = int(r, 1, 8);
  const step = int(r, 1, 6);
  const vals = Array.from({ length: n }, (_, i) => start + i * step);
  const median = vals[Math.floor(n / 2)];
  return makeQ(
    'median',
    'Probability & Statistics',
    `Find the median of {${vals.join(', ')}}.`,
    String(median),
    [String(median + step), String(median - step), String(vals[0])],
    `The values are already ordered. The middle value is ${median}, so the median is ${median}.`,
    `মানগুলো already ordered। মাঝের মান ${median}, তাই median = ${median}।`,
    r,
  );
}

function q43(r: () => number) {
  return makeQ(
    'normal-symmetry',
    'Probability & Statistics',
    'For a perfectly symmetric normal distribution, Mean = Median = Mode?',
    'True',
    ['False', 'Only when mean = 0', 'Only when SD = 1'],
    `A normal distribution is symmetric, so its mean, median, and mode coincide.`,
    `Normal distribution symmetric হওয়ায় mean, median ও mode একই হয়।`,
    r,
  );
}

function q44(r: () => number) {
  const pA = int(r, 1, 4) / 10;
  const pB = int(r, 1, 4) / 10;
  const sum = (pA + pB).toFixed(1);
  return makeQ(
    'mutually-exclusive',
    'Probability & Statistics',
    `If P(A) = ${pA} and P(B) = ${pB} for mutually exclusive events, find P(A or B).`,
    sum,
    [pA.toFixed(1), pB.toFixed(1), (pA * pB).toFixed(2)],
    `For mutually exclusive events, P(A∪B)=P(A)+P(B)=${pA}+${pB}=${sum}.`,
    `Mutually exclusive event-এর জন্য P(A∪B)=P(A)+P(B)=${pA}+${pB}=${sum}।`,
    r,
  );
}

function q45(r: () => number) {
  return makeQ(
    'pdf-total-area',
    'Probability & Statistics',
    'What is the total area under a complete probability density curve?',
    '1',
    ['0', '0.5', '100'],
    `The total area represents total probability, which must equal 1.`,
    `সম্পূর্ণ probability density curve-এর মোট area মোট probability নির্দেশ করে, তাই 1।`,
    r,
  );
}

function q46(r: () => number) {
  const min = int(r, 1, 8);
  const max = min + int(r, 3, 12);
  const mid = min + int(r, 1, max - min - 1);
  const vals = [min, mid, max, min + 1, max - 1];
  const answer = String(max - min);
  return makeQ(
    'range',
    'Probability & Statistics',
    `Find the range of {${vals.join(', ')}}.`,
    answer,
    [String(max), String(min), String(max - min + 1)],
    `Range = maximum − minimum = ${max} − ${min} = ${answer}.`,
    `Range = maximum − minimum = ${max} − ${min} = ${answer}।`,
    r,
  );
}

function q47(r: () => number) {
  const tosses = pick(r, [2, 3, 4]);
  const answer = `1/${2 ** tosses}`;
  return makeQ(
    'coin-probability',
    'Probability & Statistics',
    `A fair coin is tossed ${tosses} times. What is the probability of getting heads every time?`,
    answer,
    [`1/${tosses}`, `1/${2 ** (tosses - 1)}`, `${tosses}/2`],
    `Each head has probability 1/2. For ${tosses} independent heads, P=(1/2)^${tosses}=${answer}.`,
    `প্রতিটি head-এর probability 1/2। ${tosses}টি পরপর head-এর জন্য P=(1/2)^${tosses}=${answer}।`,
    r,
  );
}

function q48(r: () => number) {
  const mode = int(r, 2, 9);
  const values = [mode - 2, mode - 1, mode, mode, mode, mode + 1, mode + 2];
  return makeQ(
    'mode',
    'Probability & Statistics',
    `What is the mode of {${values.join(', ')}}?`,
    String(mode),
    [String(mode - 1), String(mode + 1), String(mode + 2)],
    `The mode is the value that occurs most frequently. ${mode} occurs three times.`,
    `Mode হলো যে মানটি সবচেয়ে বেশি বার আসে। এখানে ${mode} তিনবার এসেছে।`,
    r,
  );
}

const PLAN = [
  q1,
  q2,
  q3,
  q4,
  q5,
  q6,
  q7,
  q8,
  q9,
  q10,
  q11,
  q12,
  q13,
  q14,
  q15,
  q16,
  q17,
  q18,
  q19,
  q20,
  q21,
  q22,
  q23,
  q24,
  q25,
  q26,
  q27,
  q28,
  q29,
  q30,
  q31,
  q32,
  q33,
  q34,
  q35,
  q36,
  q37,
  q38,
  q39,
  q40,
  q41,
  q42,
  q43,
  q44,
  q45,
  q46,
  q47,
  q48,
];

export function generateMathMockExam(options?: {
  examNumber?: number;
  mode?: QuizMode;
  seed?: string | number;
}): MathMockExam {
  const examNumber = options?.examNumber ?? 1;
  const mode = options?.mode ?? 'single';
  const seedText = String(options?.seed ?? `CSCA-MATH-${examNumber}`);
  const masterSeed = hash(seedText);

  const questions = PLAN.map((generator, index) => {
    const r = rng((masterSeed + Math.imul(index + 1, 2654435761)) >>> 0);
    const q = generator(r);

    return {
      ...q,
      id: `math-${examNumber}-${index + 1}`,
      number: index + 1,
    };
  });

  return {
    examId: `CSCA-MATH-${examNumber}-${masterSeed.toString(16)}`,
    examNumber,
    title: `CSCA Mathematics Mock Exam ${examNumber}`,
    subject: 'Mathematics',
    durationMinutes: 50,
    totalQuestions: 48,
    mode,
    questions,
  };
}

// Example:
// const exam1 = generateMathMockExam({ examNumber: 1 });
// const exam2 = generateMathMockExam({ examNumber: 2 });
// const exam1000 = generateMathMockExam({ examNumber: 1000, mode: "all" });
//
// The same examNumber + seed always reproduces the same exam.
// A new examNumber or seed produces a new deterministic variation.
