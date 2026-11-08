// math-test-engine v1.14.0
// Served from https://cdn.jsdelivr.net/gh/andyschwencodes-boop/math-test-engine@v1.14.0/engine.jsx
const { useState, useEffect, useRef, useLayoutEffect, useContext, createContext } = React;

// --- PRINT CSS ---
// Print pages are 8.5in x 10.2in; 0.4in top/bottom @page margins fit exactly one per Letter sheet.
// The id guard keeps the print-window clone (which copies <head>) from getting a second copy.
if (!document.getElementById('mte-print-css')) {
  const printCss = document.createElement('style');
  printCss.id = 'mte-print-css';
  printCss.textContent = `
    @page { size: letter; margin: 0.4in 0; }
    .mte-hide-answer-lines .mte-answer-line { border-bottom-color: transparent !important; }
    /* A teacher's part spacing (params.part_gap) overrides the template's gap between rows of parts. */
    [data-mte-pgap] .grid:has(> .group\\/part) { row-gap: var(--mte-part-gap) !important; }
    /* The print copy is laid out off screen (not display:none) so its pages can measure and fit themselves. */
    @media screen { .mte-print-root { position: absolute; left: -100000px; top: 0; width: 8.5in; height: 0; overflow: hidden; visibility: hidden; pointer-events: none; } }
    /* Page views (window.MathTestEngine.view): the printed layout, shown as sheets. */
    .mte-pages { padding: 24px 16px 48px; }
    .mte-pages .mte-sheets { display: flex; flex-direction: column; align-items: center; gap: 24px; }
    .mte-tiles .mte-sheets { flex-direction: row; flex-wrap: wrap; justify-content: center; align-items: flex-start; gap: 28px; }
    .mte-pages .mte-sheet { margin: 0 !important; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,.18), 0 10px 28px rgba(0,0,0,.10); }
    .mte-tiles .mte-sheet { cursor: zoom-in; }
    .mte-tiles .mte-sheet:hover { outline: 6px solid #93c5fd; }
    @media print {
      .print-page-break { break-after: page; page-break-after: always; }
      .print-avoid-break { break-inside: avoid; page-break-inside: avoid; }
    }`;
  document.head.appendChild(printCss);
}

// --- ICONS ---
const Printer = ({className}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>;
const CheckCircle = ({className}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const ChevronDown = ({className}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>;
const GraduationCap = ({className}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>;
const FileText = ({className}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>;
const KeyIcon = ({className}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4"/><path d="m21 2-9.6 9.6"/><circle cx="7.5" cy="15.5" r="5.5"/></svg>;
const Edit3 = ({className}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>;
const XIcon = ({className}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;
const SettingsIcon = ({className}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;
const ListIcon = ({className}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>;
const Instagram = ({className}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>;
const Youtube = ({className}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>;
const RotateCcw = ({className}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>;
const MoveIcon = ({className}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="5 9 2 12 5 15"></polyline><polyline points="9 5 12 2 15 5"></polyline><polyline points="19 9 22 12 19 15"></polyline><polyline points="9 19 12 22 15 19"></polyline><line x1="2" y1="12" x2="22" y2="12"></line><line x1="12" y1="2" x2="12" y2="22"></line></svg>;
const Rotate3DIcon = ({className}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.59-10.06l5.25 2.49"/></svg>;
const ScaleIcon = ({className}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="21 15 21 21 15 21"></polyline><line x1="21" y1="21" x2="15" y2="15"></line><polyline points="3 9 3 3 9 3"></polyline><line x1="3" y1="3" x2="9" y2="9"></line></svg>;
const Eye = ({className}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>;
const EyeOff = ({className}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>;
const TrashIcon = ({className}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>;

// --- MATH HELPERS & UTILITIES ---
window.round2 = (n) => Math.round(n * 100) / 100;
window.rInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
window.rIntNonZero = (min, max) => {
  let val = 0; while (val === 0) { val = Math.floor(Math.random() * (max - min + 1)) + min; }
  return val;
};
window.rIntExclude = (min, max, excludeArray = []) => {
  let val; do { val = Math.floor(Math.random() * (max - min + 1)) + min; } while (excludeArray.includes(val));
  return val;
};
window.formatPolynomial = (terms) => {
  let result = terms.map((t, index) => {
    if (t.coef === 0) return "";
    let termStr = "";
    if (t.coef < 0) termStr += (index === 0 ? "-" : " - ");
    else if (t.coef > 0 && index > 0) termStr += " + ";
    const absCoef = Math.abs(t.coef);
    if (absCoef !== 1 || t.var === "") termStr += absCoef;
    termStr += t.var;
    return termStr;
  }).filter(t => t !== "").join("");
  return result === "" ? "0" : result;
};
window.pth = (...pts) => `M ${pts[0]} ` + pts.slice(1).map(p => `L ${p}`).join(' ') + ' Z';
window.gcd = (a, b) => b === 0 ? Math.abs(a) : window.gcd(b, a % b);
window.simplifyFraction = (n, d) => {
  if (d === 0) return { n, d: 0 };
  if (n === 0) return { n: 0, d: 1 };
  let divisor = window.gcd(n, d);
  let num = n / divisor; let den = d / divisor;
  if (den < 0) { num *= -1; den *= -1; }
  return { n: num, d: den };
};
window.formatFractionTex = (n, d) => {
  const { n: num, d: den } = window.simplifyFraction(n, d);
  if (den === 0) return "\\text{undefined}";
  if (den === 1) return `${num}`;
  if (num < 0) return `-\\frac{${Math.abs(num)}}{${den}}`;
  return `\\frac{${num}}{${den}}`;
};
window.formatTermTex = (n, d, variable = "") => {
  const { n: num, d: den } = window.simplifyFraction(n, d);
  if (den === 0) return "\\text{undefined}";
  if (num === 0) return "0";
  let fractionStr = "";
  if (den === 1) {
    if (num === 1 && variable) fractionStr = "";
    else if (num === -1 && variable) fractionStr = "-";
    else fractionStr = `${num}`;
  } else {
    if (num < 0) fractionStr = `-\\frac{${Math.abs(num)}}{${den}}`;
    else fractionStr = `\\frac{${num}}{${den}}`;
  }
  return `${fractionStr}${variable}`;
};
window.formatExpAns = (coef, xExp, yExp) => {
  let num = coef === 1 && (xExp > 0 || yExp > 0) ? "" : coef;
  if (coef === -1 && (xExp > 0 || yExp > 0)) num = "-";
  let den = "";
  if (xExp > 0) num += `x^{${xExp}}`;
  if (xExp < 0) den += `x^{${Math.abs(xExp)}}`;
  if (yExp > 0) num += `y^{${yExp}}`;
  if (yExp < 0) den += `y^{${Math.abs(yExp)}}`;
  if (num === "") num = "1";
  if (num === "-") num = "-1";
  if (den === "") return num;
  return `\\frac{${num}}{${den}}`;
};
window.p3d = (x, y, z, s=1, ox=120, oy=140, rotYaw=0, rotPitch=0, cx=0, cy=0, cz=0) => {
  const dx = x - cx; const dy = y - cy; const dz = z - cz;
  const rZ = (Math.PI / 4) + rotYaw; const rX = 0.615 + rotPitch; 
  const x1 = dx * Math.cos(rZ) - dy * Math.sin(rZ);
  const y1 = dx * Math.sin(rZ) + dy * Math.cos(rZ);
  const px = ox + x1 * s;
  const py = oy + (y1 * Math.sin(rX) - dz * Math.cos(rX)) * s;
  return `${px},${py}`;
};
window.drawGrid = (size, step, scale, center) => {
  let lines = [];
  const steps = Math.floor(size / 2 / step);
  for(let i = -steps; i <= steps; i++) {
    const pos = i * step * scale;
    lines.push(<line key={`v${i}`} x1={center + pos} y1={0} x2={center + pos} y2={size} stroke="#e2e8f0" strokeWidth="1"/>);
    lines.push(<line key={`h${i}`} x1={0} y1={center + pos} x2={size} y2={center + pos} stroke="#e2e8f0" strokeWidth="1"/>);
  }
  return lines;
};
window.drawAxes = (size, center) => (
  <g stroke="#64748b" strokeWidth="2">
    <line x1={center} y1={0} x2={center} y2={size} />
    <line x1={0} y1={center} x2={size} y2={center} />
    <polygon points={`${center},0 ${center-4},8 ${center+4},8`} fill="#64748b" stroke="none" />
    <polygon points={`${size},${center} ${size-8},${center-4} ${size-8},${center+4}`} fill="#64748b" stroke="none" />
    <polygon points={`${center},${size} ${center-4},${size-8} ${center+4},${size-8}`} fill="#64748b" stroke="none" />
    <polygon points={`0,${center} 8,${center-4} 8,${center+4}`} fill="#64748b" stroke="none" />
  </g>
);
window.E = (field, val) => `\\htmlId{edit_${field}}{\\htmlClass{editable-math}{${val === '' ? '\\phantom{0}' : val}}}`;

// --- GLOBAL COMPONENTS ---
// Student answer line. Print Settings > "Show answer lines" hides every line but keeps its space.
// Pass `label` (editable text, needs `field`) or children (e.g. text + MathText) before the line.
window.AnswerLine = ({ s, u, field, label = '', children }) => (
  <div className="flex flex-wrap items-end gap-x-2 mt-4">
    {children !== undefined ? children : (field ? <window.TemplateText s={s} u={u} field={field} defaultText={label} /> : null)}
    <div className="mte-answer-line flex-1 min-w-[45%] border-b border-slate-400 h-6"></div>
  </div>
);

// --- MULTI-PART QUESTIONS ---
// Parts have stable ids ('a', 'b', ...). Hidden ids live in the item's `hidden_parts`, and partList
// returns the visible parts re-lettered in order, so q, answer, work, and grading all agree.
window.partList = (s, ids) => {
  const hidden = (s && s.hidden_parts) || [];
  const visible = ids.filter((id) => !hidden.includes(id));
  return (visible.length ? visible : ids).map((id, i) => ({ id, letter: String.fromCharCode(97 + i) }));
};
// One part of a question: prints its letter, and on screen offers "Hide part" while more than one is visible.
// The button sits inside the part's box so moving onto it keeps the part hovered.
window.Part = ({ s, u, part, parts, label = true, className = '', children }) => (
  // -ml-6/pl-6 widen the hover area to the left (no visual shift) so the hide icon there stays clickable.
  <div className={`relative group/part flex items-baseline -ml-6 pl-6 ${className}`}>
    {(u && parts && parts.length > 1) && (
      <button onClick={() => u('hidden_parts', [...((s && s.hidden_parts) || []), part.id])} className="absolute left-0 top-0.5 z-30 invisible group-hover/part:visible w-5 h-5 inline-flex items-center justify-center rounded border border-gray-200 bg-white text-gray-500 hover:text-red-600 hover:bg-red-50 hover:border-red-200 shadow-sm print:hidden" title={`Hide part ${part.letter} on every form. The remaining parts are re-lettered and the answer key updates.`} aria-label={`Hide part ${part.letter}`}><EyeOff className="w-3 h-3" /></button>
    )}
    {label && <span className="mr-1 shrink-0">{part.letter}.</span>}
    <div className="flex-1 min-w-0">{children}</div>
  </div>
);

window.TemplateText = ({ s, u, field, defaultText }) => {
  const val = s[field] !== undefined ? s[field] : defaultText;
  const [tempVal, setTempVal] = useState(val);
  useEffect(() => { setTempVal(val); }, [val]);
  return <span contentEditable suppressContentEditableWarning onBlur={(e) => u(field, e.target.innerHTML)} className="outline-none hover:bg-blue-50 focus:bg-blue-50 focus:border-b-2 focus:border-blue-500 hover:border-b hover:border-gray-400 hover:border-dashed cursor-text transition-colors print:border-none print:bg-transparent" dangerouslySetInnerHTML={{ __html: tempVal }} />;
};
window.GlobalEditableText = ({ val, onChange, className="" }) => {
  const [tempVal, setTempVal] = useState(val);
  useEffect(() => { setTempVal(val); }, [val]);
  return <span contentEditable suppressContentEditableWarning onBlur={(e) => onChange(e.target.innerHTML)} className={`outline-none hover:bg-blue-50 focus:bg-blue-50 focus:border-b-2 focus:border-blue-500 hover:border-b hover:border-gray-400 hover:border-dashed cursor-text transition-colors print:border-none print:bg-transparent ${className}`} dangerouslySetInnerHTML={{ __html: tempVal }} />;
};
window.LocalEditableText = ({ defaultText, className="" }) => {
  const [val, setVal] = useState(defaultText);
  return <span contentEditable suppressContentEditableWarning onBlur={(e) => setVal(e.target.innerHTML)} className={`outline-none hover:bg-blue-50 focus:bg-blue-50 focus:border-b-2 focus:border-blue-500 hover:border-b hover:border-gray-400 hover:border-dashed cursor-text transition-colors print:border-none print:bg-transparent ${className}`} dangerouslySetInnerHTML={{ __html: val }} />;
};
window.SettingsEditableText = ({ field, settings, setSettings }) => {
  const val = settings?.rubricData?.[field] || "";
  const [tempVal, setTempVal] = useState(val);
  useEffect(() => { setTempVal(val); }, [val]);
  return <span contentEditable suppressContentEditableWarning onBlur={(e) => { if(setSettings) setSettings({...settings, rubricData: {...settings.rubricData, [field]: e.target.innerHTML}}); }} className="outline-none hover:bg-blue-50 focus:bg-blue-50 focus:border-b-2 focus:border-blue-500 hover:border-b hover:border-gray-400 hover:border-dashed cursor-text transition-colors print:border-none print:bg-transparent" dangerouslySetInnerHTML={{ __html: tempVal }} />;
};

// Splits TeX into pieces a line may wrap between, so long answers never run off the page: at top-level
// \quad / \qquad (how parts are joined) and between the words of a top-level \text{...} (sentences). Braces,
// environments, and \left...\right are never split. Returns [[tex, gap], ...]; gap is the space after a piece:
// 1 or 2 (\quad, \qquad, in em of KaTeX's font) or 's' (a word space).
const splitForWrap = (tex) => {
  const out = []; let depth = 0, env = 0, cur = '';
  const brk = (gap) => {
    if (cur.trim()) out.push([cur, gap]);
    else if (out.length && gap !== 's') out[out.length - 1][1] = gap; // keep the wider gap
    cur = '';
  };
  for (let i = 0; i < tex.length; i++) {
    const c = tex[i];
    if (c === '\\') {
      const m = /^\\(begin|end|left|right|qquad|quad|text)(?![a-zA-Z])/.exec(tex.slice(i));
      if (!m) { cur += tex.slice(i, i + 2); i++; continue; } // other commands and escaped characters (\{, \\, ...)
      const atTop = !depth && !env;
      if (m[1] === 'begin' || m[1] === 'left') env++; else if (m[1] === 'end' || m[1] === 'right') env--;
      else if ((m[1] === 'quad' || m[1] === 'qquad') && atTop) { brk(m[1] === 'qquad' ? 2 : 1); i += m[0].length - 1; continue; }
      else if (m[1] === 'text' && atTop && tex[i + 5] === '{') {
        let j = i + 6, d = 1; for (; j < tex.length && d; j++) { if (tex[j] === '\\') j++; else if (tex[j] === '{') d++; else if (tex[j] === '}') d--; }
        const inner = tex.slice(i + 6, j - 1);
        if (d === 0 && !/[\\{}]/.test(inner)) {
          // A sentence may wrap between two of its words, but never at the edge of the text (so "4 ft" and
          // "is (2, 7)" stay together) or right after a part label like "a." or "(b)".
          const words = inner.split(' '); let chunk = words[0];
          words.slice(1).forEach((w, k) => {
            const prev = words[k];
            if (prev && w && !/^\(?[a-zA-Z0-9]\.?\)?[.:]?$/.test(prev)) { cur += `\\text{${chunk}}`; brk('s'); chunk = w; }
            else chunk += ' ' + w;
          });
          cur += `\\text{${chunk}}`;
          i = j - 1; continue;
        }
      }
      cur += m[0]; i += m[0].length - 1; continue;
    }
    if (c === '{') depth++; else if (c === '}') depth--;
    cur += c;
  }
  brk(0);
  return out;
};

window.MathText = ({ tex, state, update }) => {
  const containerRef = useRef(null);
  const [editState, setEditState] = useState(null);
  const handleClick = (e) => {
    if (!update || e.target.tagName === 'INPUT') return;
    const classNode = e.target.closest('.editable-math');
    if (!classNode) return;
    const idNode = classNode.closest('[id^="edit_"]') || classNode.querySelector('[id^="edit_"]');
    if (!idNode) return;
    const field = idNode.id.replace('edit_', '');
    let top = 0; let left = 0; let el = classNode;
    while (el && el !== containerRef.current) { top += el.offsetTop || 0; left += el.offsetLeft || 0; el = el.offsetParent; }
    if (top === 0 && left === 0 && classNode.offsetTop !== 0) {
      const rect = classNode.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      top = rect.top - containerRect.top; left = rect.left - containerRect.left;
    }
    setEditState({ field, top, left, width: Math.max(classNode.offsetWidth, 20), height: classNode.offsetHeight, val: state[field] });
  };
  const handleBlur = (val) => {
    if (editState && update) { const isNum = !isNaN(val) && val !== ''; update(editState.field, isNum ? Number(val) : val); }
    setEditState(null);
  };
  const safeTex = tex !== undefined && tex !== null ? String(tex) : '';
  const render = (t) => window.katex.renderToString(t, { throwOnError: false, strict: false, trust: true, displayMode: false });
  // Each piece stays whole; the line may wrap between pieces. A \quad is 1em of KaTeX's font (1.21em of the
  // surrounding text); a word space is a real space, so the browser can break there.
  const pieces = splitForWrap(safeTex);
  const html = pieces.length < 2 ? render(safeTex)
    : pieces.map(([t, gap], i) => {
        const last = i === pieces.length - 1;
        const margin = typeof gap === 'number' && gap && !last ? `;margin-right:${(1.21 * gap).toFixed(2)}em` : '';
        return `<span style="display:inline-block;white-space:nowrap${margin}">${render(t)}</span>${last ? '' : gap === 's' ? ' ' : '<wbr>'}`;
      }).join('');
  return (
    <span className={`relative inline-block ${pieces.length < 2 ? 'whitespace-nowrap' : 'max-w-full'} align-middle group`} ref={containerRef}>
      <span onClick={handleClick} dangerouslySetInnerHTML={{ __html: html }} className={update ? "cursor-text" : ""} />
      {editState && <input autoFocus type="text" defaultValue={editState.val} onBlur={(e) => handleBlur(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && e.target.blur()} className="absolute z-10 text-center border-b-2 border-blue-600 bg-blue-50 text-blue-800 font-bold focus:outline-none shadow-sm katex-edit-input" style={{ top: editState.top - 2, left: editState.left - 2, width: editState.width + 4, height: editState.height + 4, fontSize: 'inherit', fontFamily: 'inherit' }} />}
    </span>
  );
};

window.ResizableEquation = ({ state, update, prefix="eq", children }) => {
  const scale = state?.[`${prefix}_scale`] || 1;
  return (
    <div className="relative inline-block group/eq" style={{ transform: `scale(${scale})`, transformOrigin: 'left center' }}>
      {children}
      {update && (
        <div className="absolute -right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover/eq:opacity-100 print:hidden cursor-nwse-resize text-gray-400 hover:text-blue-600 transition-opacity z-30 bg-white border border-gray-200 shadow-sm rounded-full p-1"
             style={{ transform: `scale(${1/scale})` }}
             onMouseDown={(e) => {
               e.preventDefault(); e.stopPropagation();
               const startX = e.clientX; const startScale = scale;
               const onMove = (m) => { update(`${prefix}_scale`, Math.max(0.5, Math.min(3.0, startScale + ((m.clientX - startX) / 150)))); };
               const onEnd = () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onEnd); };
               document.addEventListener('mousemove', onMove); document.addEventListener('mouseup', onEnd);
             }}>
          <ScaleIcon className="w-4 h-4" />
        </div>
      )}
    </div>
  )
};

window.Lbl = ({ snapPoints, dockId, x, y, width=80, height=30, state, update, id, children }) => {
  const currentDockId = state?.[`${id}_dock`] || dockId;
  let currentPoint = (snapPoints && snapPoints.length > 0) ? (snapPoints.find(p => p.id === currentDockId) || snapPoints[0]) : { x: x || 0, y: y || 0 };
  const dx = state?.[`${id}_dx`] || 0; const dy = state?.[`${id}_dy`] || 0;
  const [isDragging, setIsDragging] = useState(false);
  const [localPos, setLocalPos] = useState({ x: dx, y: dy });
  const dragRef = useRef(false); const posRef = useRef({ x: dx, y: dy });
  
  useEffect(() => { setLocalPos({ x: dx, y: dy }); posRef.current = { x: dx, y: dy }; }, [dx, dy, currentPoint.x, currentPoint.y]);
  
  const startDrag = (clientX, clientY) => {
    setIsDragging(true); dragRef.current = false;
    const startX = clientX - posRef.current.x; const startY = clientY - posRef.current.y;
    const onMove = (mX, mY) => { dragRef.current = true; setLocalPos({ x: mX - startX, y: mY - startY }); posRef.current = { x: mX - startX, y: mY - startY }; };
    const onEnd = () => {
      setIsDragging(false); cleanup();
      if (dragRef.current && update && id) {
        if (snapPoints && snapPoints.length > 0) {
          const dropX = currentPoint.x + posRef.current.x; const dropY = currentPoint.y + posRef.current.y;
          let closestPoint = currentPoint; let minDist = Math.hypot(currentPoint.x - dropX, currentPoint.y - dropY);
          snapPoints.forEach(p => { const dist = Math.hypot(p.x - dropX, p.y - dropY); if (dist < minDist - 5) { minDist = dist; closestPoint = p; } });
          if (closestPoint.id !== currentDockId) { update(`${id}_dock`, closestPoint.id); update(`${id}_dx`, 0); update(`${id}_dy`, 0); } 
          else { update(`${id}_dx`, posRef.current.x); update(`${id}_dy`, posRef.current.y); }
        } else { update(`${id}_dx`, posRef.current.x); update(`${id}_dy`, posRef.current.y); }
        setTimeout(() => { dragRef.current = false; }, 50);
      }
    };
    const handleMouseMove = (e) => onMove(e.clientX, e.clientY); const handleMouseUp = () => onEnd(); const handleTouchMove = (e) => onMove(e.touches[0].clientX, e.touches[0].clientY); const handleTouchEnd = () => onEnd();
    const cleanup = () => { document.removeEventListener('mousemove', handleMouseMove); document.removeEventListener('mouseup', handleMouseUp); document.removeEventListener('touchmove', handleTouchMove); document.removeEventListener('touchend', handleTouchEnd); };
    document.addEventListener('mousemove', handleMouseMove); document.addEventListener('mouseup', handleMouseUp); document.addEventListener('touchmove', handleTouchMove, { passive: false }); document.addEventListener('touchend', handleTouchEnd);
  };
  return (
    <foreignObject x={currentPoint.x - width/2 + localPos.x} y={currentPoint.y - height/2 + localPos.y} width={width} height={height} className="overflow-visible touch-none" onMouseDown={(e) => { if (!e.target.closest('.editable-math')) startDrag(e.clientX, e.clientY); }} onTouchStart={(e) => { if (!e.target.closest('.editable-math')) startDrag(e.touches[0].clientX, e.touches[0].clientY); }} onClickCapture={(e) => { if (dragRef.current) { e.stopPropagation(); e.preventDefault(); } }} style={{ cursor: isDragging ? 'grabbing' : 'grab' }}>
      <div className="flex justify-center items-center w-full h-full text-center font-serif text-[14px] leading-none select-none" style={{ textShadow: '-1.5px -1.5px 0 #fff, 1.5px -1.5px 0 #fff, -1.5px 1.5px 0 #fff, 1.5px 1.5px 0 #fff, -2px 0 0 #fff, 2px 0 0 #fff, 0 -2px 0 #fff, 0 2px 0 #fff' }}>{children}</div>
    </foreignObject>
  );
};

window.DraggableSVG = ({ state, update, disableMove, prefix="svg", disableRotate=false, width=240, height=240, forceScale, forceReset, children }) => {
  const isLocked = disableMove || !update;
  const dx = forceReset ? 0 : (state?.[`${prefix}_dx`] || 0); const dy = forceReset ? 0 : (state?.[`${prefix}_dy`] || 0);
  const scale = forceScale !== undefined ? forceScale : (state?.[`${prefix}_scale`] || 1);
  const rotYaw = forceReset ? 0 : (state?.[`${prefix}_rotYaw`] || 0); const rotPitch = forceReset ? 0 : (state?.[`${prefix}_rotPitch`] || 0);
  const hasVisualChanges = Object.keys(state || {}).some(k => k.startsWith(`${prefix}_`) && (k.endsWith('_dx') || k.endsWith('_dy') || k.endsWith('_scale') || k.endsWith('_rotYaw') || k.endsWith('_rotPitch') || k.endsWith('_dock')));
  
  const [activeMode, setActiveMode] = useState('idle'); const [isSelected, setIsSelected] = useState(false);
  const [localPos, setLocalPos] = useState({ x: dx, y: dy }); const posRef = useRef({ x: dx, y: dy }); const containerRef = useRef(null);
  
  useEffect(() => { setLocalPos({ x: dx, y: dy }); posRef.current = { x: dx, y: dy }; }, [dx, dy]);
  useEffect(() => {
    const handleClickOutside = (e) => { if (containerRef.current && !containerRef.current.contains(e.target)) { setIsSelected(false); if (activeMode !== 'idle') setActiveMode('idle'); } };
    document.addEventListener('mousedown', handleClickOutside); document.addEventListener('touchstart', handleClickOutside);
    return () => { document.removeEventListener('mousedown', handleClickOutside); document.removeEventListener('touchstart', handleClickOutside); };
  }, [activeMode]);
  
  const startInteraction = (e) => {
    if (isLocked || activeMode === 'idle') return;
    e.stopPropagation(); e.preventDefault();
    const startX = e.clientX || e.touches?.[0].clientX; const startY = e.clientY || e.touches?.[0].clientY;
    const initialX = localPos.x; const initialY = localPos.y; const initialYaw = rotYaw; const initialPitch = rotPitch; const initialScale = scale;
    
    const onMove = (moveEvent) => { 
      const deltaX = (moveEvent.clientX || moveEvent.touches?.[0].clientX) - startX; const deltaY = (moveEvent.clientY || moveEvent.touches?.[0].clientY) - startY; 
      if (activeMode === 'move') { setLocalPos({ x: initialX + deltaX, y: initialY + deltaY }); posRef.current = { x: initialX + deltaX, y: initialY + deltaY }; } 
      else if (activeMode === 'rotate' && update && !disableRotate) { update(`${prefix}_rotYaw`, Math.max(-0.6, Math.min(0.6, initialYaw + deltaX / 200))); update(`${prefix}_rotPitch`, Math.max(-0.5, Math.min(0.5, initialPitch + deltaY / 200))); } 
      else if (activeMode === 'scale' && update) { update(`${prefix}_scale`, Math.max(0.4, Math.min(3.5, initialScale + deltaX / 320))); }
    };
    const onEnd = () => { cleanup(); if (activeMode === 'move' && update) { update(`${prefix}_dx`, posRef.current.x); update(`${prefix}_dy`, posRef.current.y); } };
    const cleanup = () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onEnd); document.removeEventListener('touchmove', onMove); document.removeEventListener('touchend', onEnd); };
    document.addEventListener('mousemove', onMove); document.addEventListener('mouseup', onEnd); document.addEventListener('touchmove', onMove, { passive: false }); document.addEventListener('touchend', onEnd);
  };
  return (
    <div ref={containerRef} tabIndex={-1} onMouseDown={() => { if (!isLocked) setIsSelected(true); }} onTouchStart={() => { if (!isLocked) setIsSelected(true); }} className={`inline-block transition-none touch-none group/svg relative rounded-xl outline-none ${isLocked ? '' : (isSelected ? 'bg-indigo-50/40 ring-2 ring-indigo-300' : 'hover:bg-slate-50 ring-1 ring-transparent hover:ring-gray-200 cursor-pointer')}`} style={{ transform: `translate(${localPos.x}px, ${localPos.y}px)`, zIndex: isSelected ? 50 : 10, width: `${width * scale}px`, height: `${height * scale}px` }}>
      <div className="relative flex justify-center items-center" style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width, height }}>
        {children}
        {isSelected && activeMode !== 'idle' && !isLocked && <div className={`absolute inset-0 z-40 ${activeMode === 'move' ? 'cursor-move' : activeMode === 'rotate' ? 'cursor-crosshair' : 'cursor-nwse-resize'}`} onMouseDown={startInteraction} onTouchStart={startInteraction} style={{ background: 'transparent', touchAction: 'none' }} />}
      </div>
      {update && !isLocked && isSelected && (
         <div className={`absolute -bottom-12 left-1/2 -translate-x-1/2 bg-white rounded-full shadow-2xl border px-3 py-2 flex items-center gap-2 print:hidden z-50 opacity-100 border-indigo-400 ring-4 ring-indigo-50 transition-all duration-200`}>
            {activeMode === 'idle' ? (
               <>
                 <button onMouseDown={(e) => e.stopPropagation()} onClick={() => setActiveMode('move')} className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors" title="Move Block"><MoveIcon className="w-4 h-4"/></button>
                 {!disableRotate && <button onMouseDown={(e) => e.stopPropagation()} onClick={() => setActiveMode('rotate')} className="p-1.5 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-colors" title="Rotate 3D"><Rotate3DIcon className="w-4 h-4"/></button>}
                 <button onMouseDown={(e) => e.stopPropagation()} onClick={() => setActiveMode('scale')} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors" title="Resize"><ScaleIcon className="w-4 h-4"/></button>
                 <div className="w-px h-5 bg-gray-300 mx-1"></div>
                 <button onMouseDown={(e) => e.stopPropagation()} onClick={() => { update('hide_svg', true); setIsSelected(false); }} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors" title="Remove Graphic"><TrashIcon className="w-4 h-4"/></button>
                 {hasVisualChanges && ( <><div className="w-px h-5 bg-gray-300 mx-1"></div><button onMouseDown={(e) => e.stopPropagation()} onClick={() => update('RESET_VISUALS', null)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors" title="Reset Layout"><RotateCcw className="w-4 h-4"/></button></> )}
               </>
            ) : (
               <>
                 <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1.5 pl-2 pr-1">
                   {activeMode === 'move' && <MoveIcon className="w-4 h-4 text-indigo-500"/>}
                   {activeMode === 'rotate' && <Rotate3DIcon className="w-4 h-4 text-purple-500"/>}
                   {activeMode === 'scale' && <ScaleIcon className="w-4 h-4 text-blue-500"/>}
                   <span className="hidden sm:inline text-indigo-900">{activeMode}</span>
                 </span>
                 <div className="w-px h-5 bg-gray-300 mx-1"></div>
                 <button onMouseDown={(e) => e.stopPropagation()} onClick={() => setActiveMode('idle')} className="text-green-500 hover:text-green-600 hover:bg-green-50 rounded-full p-1 transition-colors" title="Done"><CheckCircle className="w-6 h-6"/></button>
               </>
            )}
         </div>
      )}
    </div>
  );
};

const RubricRenderer = ({ mode, isFirstSection, customHTML, settings, setSettings }) => {
  if (mode === 'hidden') return null;
  if (mode === 'custom' && isFirstSection) return <div className="mb-4 w-full" dangerouslySetInnerHTML={{ __html: customHTML }} />;
  const renderHeaders = (cols) => (
    <thead className="bg-gray-200">
      <tr>
        <th className={`border border-black px-1 py-0.5 w-1/${cols} leading-tight text-[8pt]`}><span className="font-bold text-[8.5pt] mr-1"><window.SettingsEditableText field="hN" settings={settings} setSettings={setSettings}/></span><window.SettingsEditableText field="hNDesc" settings={settings} setSettings={setSettings}/></th>
        <th className={`border border-black px-1 py-0.5 w-1/${cols} leading-tight text-[8pt]`}><span className="font-bold text-[8.5pt] mr-1"><window.SettingsEditableText field="hC" settings={settings} setSettings={setSettings}/></span><window.SettingsEditableText field="hCDesc" settings={settings} setSettings={setSettings}/></th>
        {cols === 5 && <th className="border border-black px-1 py-0.5 w-1/5 leading-tight text-[8pt]"><span className="font-bold text-[8.5pt] mr-1"><window.SettingsEditableText field="hB" settings={settings} setSettings={setSettings}/></span><window.SettingsEditableText field="hBDesc" settings={settings} setSettings={setSettings}/></th>}
        <th className={`border border-black px-1 py-0.5 w-1/${cols} leading-tight text-[8pt]`}><span className="font-bold text-[8.5pt] mr-1"><window.SettingsEditableText field="hAm" settings={settings} setSettings={setSettings}/></span><window.SettingsEditableText field="hAmDesc" settings={settings} setSettings={setSettings}/></th>
        <th className={`border border-black px-1 py-0.5 w-1/${cols} leading-tight text-[8pt]`}><span className="font-bold text-[8.5pt] mr-1"><window.SettingsEditableText field="hA" settings={settings} setSettings={setSettings}/></span><window.SettingsEditableText field="hADesc" settings={settings} setSettings={setSettings}/></th>
      </tr>
    </thead>
  );
  if (mode === '5-point' && isFirstSection) return ( <table className="w-full text-[8pt] leading-snug text-left border-collapse border border-black mb-3 bg-white table"> {renderHeaders(5)} <tbody> <tr className="align-top"> <td className="border border-black px-1 py-0.5"><window.SettingsEditableText field="c51" settings={settings} setSettings={setSettings}/></td> <td className="border border-black px-1 py-0.5"><window.SettingsEditableText field="c52" settings={settings} setSettings={setSettings}/></td> <td className="border border-black px-1 py-0.5"><window.SettingsEditableText field="c53" settings={settings} setSettings={setSettings}/></td> <td className="border border-black px-1 py-0.5"><window.SettingsEditableText field="c54" settings={settings} setSettings={setSettings}/></td> <td className="border border-black px-1 py-0.5"><window.SettingsEditableText field="c55" settings={settings} setSettings={setSettings}/></td> </tr> </tbody> </table> );
  if (mode === '4-point' && isFirstSection) return ( <table className="w-full text-[8pt] leading-snug text-left border-collapse border border-black mb-3 bg-white table"> {renderHeaders(4)} <tbody> <tr className="align-top"> <td className="border border-black px-1 py-0.5"><window.SettingsEditableText field="c41" settings={settings} setSettings={setSettings}/></td> <td className="border border-black px-1 py-0.5"><window.SettingsEditableText field="c42" settings={settings} setSettings={setSettings}/></td> <td className="border border-black px-1 py-0.5"><window.SettingsEditableText field="c43" settings={settings} setSettings={setSettings}/></td> <td className="border border-black px-1 py-0.5"><window.SettingsEditableText field="c44" settings={settings} setSettings={setSettings}/></td> </tr> </tbody> </table> );
  if (!isFirstSection && (mode === '5-point' || mode === '4-point')) { const cols = mode === '5-point' ? 5 : 4; return ( <table className="w-full text-[9pt] text-center border-collapse border border-black mb-4 bg-white table"> <thead className="bg-gray-200"> <tr> <th className={`border border-black p-1 w-1/${cols} font-bold`}><window.SettingsEditableText field="sN" settings={settings} setSettings={setSettings}/></th> <th className={`border border-black p-1 w-1/${cols} font-bold`}><window.SettingsEditableText field="sC" settings={settings} setSettings={setSettings}/></th> {cols === 5 && <th className="border border-black p-1 w-1/5 font-bold"><window.SettingsEditableText field="sB" settings={settings} setSettings={setSettings}/></th>} <th className={`border border-black p-1 w-1/${cols} font-bold`}><window.SettingsEditableText field="sAm" settings={settings} setSettings={setSettings}/></th> <th className={`border border-black p-1 w-1/${cols} font-bold`}><window.SettingsEditableText field="sA" settings={settings} setSettings={setSettings}/></th> </tr> </thead> </table> ); }
  return null;
};

// Content area is 9.6in tall both on screen (11in sheet, 0.7in top/bottom padding) and in print
// (10.2in page inside 0.4in @page margins, 0.3in top/bottom padding), so what fits in the preview fits on paper.
const PAGE_DPI = 96;
// How much of each automatic workspace's minimum a page can afford (1 = all of it, 0 = none).
const PageSqueeze = createContext(1);

// Document type and view, for components inside templates. notes: a resource packet (config.kind === 'notes');
// key: rendering the answer key.
const DocContext = createContext({ notes: false, key: false });
// Fill-in blank for guided notes: a line on the student copy, the answer (red, on the line) on the answer key.
// ans: plain text, or tex: math. w: minimum width in inches (the line also grows to fit the answer, so the
// student copy and the key take the same room).
window.Blank = ({ ans = '', tex, w = 1.1 }) => {
  const { key } = useContext(DocContext);
  return (
    <span className="mte-blank relative inline-block align-baseline border-b border-slate-700 px-1 text-center" style={{ minWidth: `${w}in` }}>
      <span className={key ? 'text-red-700 font-semibold' : 'invisible'}>{tex ? <window.MathText tex={tex} /> : ans}</span>
    </span>
  );
};
// Shows children only on the answer key (e.g. a filled-in table cell or a step of a worked example).
window.KeyOnly = ({ children }) => (useContext(DocContext).key ? <span className="text-red-700">{children}</span> : null);
// Display label per visible item: a number ("3."), or the template's label ("Example 2", "Key Idea").
// label: 'Example' numbers each label on its own (Example 1, Example 2, ...); numbered: false shows the label
// alone, or nothing. Items with neither keep the usual question numbers.
const itemLabels = (formObj, hiddenQuestions, templates) => {
  const map = {}; const per = {}; let n = 0;
  formObj.sections.forEach((sec) => sec.items.forEach((item) => {
    const id = `${item.id}-${item.t}`; if (hiddenQuestions.includes(id)) return;
    const r = templates[item.t] || {};
    if (r.label) { per[r.label] = (per[r.label] || 0) + 1; map[id] = { label: r.numbered === false ? r.label : `${r.label} ${per[r.label]}` }; }
    else map[id] = r.numbered === false ? { label: '' } : { num: ++n };
  }));
  return map;
};
const LabelTag = ({ text, keyView }) => (text
  ? <span className={`inline-block text-[10pt] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-sm ${keyView ? 'bg-red-100 text-red-800' : 'bg-slate-800 text-white'}`}>{text}</span>
  : null);
const PageFrame = ({ isPrint, children, onOverflow, autoNote }) => {
  const bodyRef = useRef(null);
  const [overflowIn, setOverflowIn] = useState(0);
  const [squeeze, setSqueeze] = useState(1);
  const [, remeasure] = useState(0);
  const regrows = useRef(0); // safety stop: a page gives room back at most a few times
  // Fit the page before it paints: if content is too tall (fonts, browser, or OS differences), shrink this
  // page's automatic workspaces just enough; give the room back when it frees up. Pinned workspaces never change.
  useLayoutEffect(() => {
    const el = bodyRef.current; if (!el) return;
    const ws = [...el.querySelectorAll('[data-mte-ws="auto"]')];
    const baseMin = ws.reduce((sum, w) => sum + parseFloat(w.dataset.min || '0'), 0);
    const over = el.scrollHeight - el.clientHeight;
    // Shrink to leave 6px spare; only give room back when more than 12px is free, so it can't flip-flop.
    let next = squeeze;
    if (baseMin > 0 && over > 0.5) next = Math.max(0, squeeze - (over + 6) / baseMin);
    else if (baseMin > 0 && squeeze < 1 && regrows.current < 4) {
      const used = Math.max(0, ...[...el.children].map((c) => c.offsetTop + c.offsetHeight + (parseFloat(getComputedStyle(c).marginBottom) || 0))) - el.offsetTop;
      const grown = ws.reduce((sum, w) => sum + w.clientHeight, 0) - baseMin * squeeze; // clientHeight: no border
      const room = Math.max(0, el.clientHeight - used) + Math.max(0, grown);
      if (room > 12) { next = Math.min(1, squeeze + (room - 6) / baseMin); regrows.current += 1; }
    }
    next = Math.round(next * 1000) / 1000;
    if (Math.abs(next - squeeze) > 0.002) { setSqueeze(next); return; }
    // Still too tall with no automatic workspace left: move the first question that runs past the bottom
    // (and everything after it) to a new page. The first question on a page can't move, so that case warns.
    if (over > 0.5 && onOverflow) {
      const items = [...el.querySelectorAll('[data-mte-item]')];
      const spill = items.find((it, i) => i > 0 && it.offsetTop - el.offsetTop + it.offsetHeight > el.clientHeight + 0.5);
      if (spill) { onOverflow(spill.dataset.mteItem); return; }
    }
    if (!isPrint) { // screen only: warn when the page still can't fit (pinned space, or too much content)
      const overIn = Math.round((over / PAGE_DPI) * 100) / 100;
      const flag = overIn > 0.02 ? overIn : 0;
      if (flag !== overflowIn) setOverflowIn(flag);
    }
  });
  useEffect(() => { // re-fit after web fonts load and whenever the page's content changes size
    const el = bodyRef.current; if (!el) return;
    let cancelled = false; const bump = () => { if (!cancelled) remeasure((n) => n + 1); };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(bump);
    if (typeof ResizeObserver === 'undefined') return () => { cancelled = true; };
    const ro = new ResizeObserver(bump);
    [...el.children].forEach((c) => ro.observe(c));
    return () => { cancelled = true; ro.disconnect(); };
  }, []);
  return (
    <div style={{ width: '8.5in', height: isPrint ? '10.2in' : '11in', padding: isPrint ? '0.3in 0.4in' : '0.7in 0.4in' }} className={`mte-sheet bg-white mx-auto box-border flex flex-col relative ${isPrint ? 'print-page-break overflow-hidden' : `shadow-2xl border mb-12 overflow-visible ${overflowIn ? 'border-red-500 ring-4 ring-red-200' : 'border-gray-300'}`}`}>
      {(!isPrint && autoNote) && <div className="absolute top-2 right-4 text-[10px] text-gray-400 italic print:hidden" title="The previous page was too full, so these questions moved here. Changes to the test recalculate this.">Page added automatically so everything fits</div>}
      {(!isPrint && overflowIn > 0) && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[70] bg-red-600 text-white text-xs font-bold px-3 py-1 rounded shadow whitespace-nowrap print:hidden">
          Page is {overflowIn.toFixed(2)}in too tall and will be cut off when printed. Shrink a workspace or start a new page.
        </div>
      )}
      <PageSqueeze.Provider value={squeeze}>
        <div ref={bodyRef} className="flex flex-col flex-1 min-h-0">{children}</div>
      </PageSqueeze.Provider>
    </div>
  );
};

// Workspace below a question. Auto: at least the template's `space` (scaled down by the page's squeeze if the
// page would otherwise overflow), plus an equal share of the page's leftover height (when Auto-spread is on).
// Dragging pins an exact height (customSpace, may be 0); double-clicking the handle returns to auto.
const Workspace = ({ itemState, renderer, update, isPrint, autoFill }) => {
  const ref = useRef(null);
  const squeeze = useContext(PageSqueeze);
  const minIn = (renderer.space || 0) * 0.5;
  const pinned = itemState?.customSpace !== undefined && itemState?.customSpace !== null;
  const style = pinned ? { height: `${itemState.customSpace}in`, flex: '0 0 auto' }
    : { minHeight: `${minIn * squeeze}in`, flex: autoFill ? '1 0 auto' : '0 0 auto' };
  return (
    <div ref={ref} data-mte-ws={pinned ? 'pinned' : 'auto'} data-min={minIn * PAGE_DPI} className="relative w-full border-b border-transparent hover:border-blue-200 transition-colors" style={style}>
      {!isPrint && (
        <div className="absolute bottom-0 left-0 w-full h-4 translate-y-1/2 cursor-ns-resize flex justify-center items-center opacity-0 group-hover/q:opacity-100 z-20 print:hidden"
          title="Drag to set this question's workspace. Double-click to return to auto spacing."
          onDoubleClick={() => update('customSpace', null)}
          onMouseDown={(e) => {
            e.preventDefault(); const startY = e.clientY;
            const startSpace = ref.current ? ref.current.getBoundingClientRect().height / PAGE_DPI : minIn;
            const onMove = (mEvent) => { update('customSpace', Math.max(0, Math.round((startSpace + (mEvent.clientY - startY) / PAGE_DPI) * 20) / 20)); };
            const onEnd = () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onEnd); };
            document.addEventListener('mousemove', onMove); document.addEventListener('mouseup', onEnd); }}>
          <div className={`w-1/2 max-w-[200px] h-1.5 rounded-full shadow-sm transition-colors ${pinned ? 'bg-amber-400 hover:bg-amber-500' : 'bg-blue-300 hover:bg-blue-500'}`}></div>
          {pinned && <span className="absolute right-0 -top-4 text-[10px] font-bold text-amber-700 bg-white px-1 rounded">{itemState.customSpace.toFixed(2)}in · double-click for auto</span>}
        </div>
      )}
    </div>
  );
};

// Editor tools for one question, stacked under its number so they never cover question text.
// Hover-only tools appear while the question is hovered; tools showing a non-default state stay visible.
const ToolBtn = ({ onClick, title, tone = 'plain', always = false, children }) => {
  const tones = { plain: 'bg-white text-gray-500 border-gray-200 hover:text-blue-700 hover:bg-blue-50 hover:border-blue-200', danger: 'bg-white text-gray-500 border-gray-200 hover:text-red-600 hover:bg-red-50 hover:border-red-200', on: 'bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200', warn: 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100' };
  return <button type="button" onClick={onClick} title={title} aria-label={title} className={`${always ? 'visible' : ''} w-6 h-6 inline-flex items-center justify-center rounded border shadow-sm text-[11px] font-bold leading-none ${tones[tone]}`}>{children}</button>;
};
const GapIcon = ({ out }) => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    {out ? <><path d="M12 3v6M9 6l3-3 3 3"/><path d="M12 21v-6M9 18l3 3 3-3"/></> : <><path d="M12 3v6M9 6l3 3 3-3"/><path d="M12 21v-6M9 18l3-3 3 3"/></>}
    <line x1="4" y1="12" x2="20" y2="12" />
  </svg>
);
const QuestionTools = ({ isFirst, itemDef, itemState, update, uniqueId, setHiddenQuestions, toggleItemPageBreak, pos = 'left-0 top-full mt-1' }) => {
  const ref = useRef(null);
  const [hasParts, setHasParts] = useState(false);
  const partGrid = () => { const q = ref.current && ref.current.closest('.group\\/q'); return q && q.querySelector('.grid:has(> .group\\/part)'); };
  useEffect(() => { setHasParts(!!partGrid()); });
  const custom = typeof itemState?.part_gap === 'number';
  const stepGap = (delta) => {
    const g = partGrid(); const now = custom ? itemState.part_gap : (g ? parseFloat(getComputedStyle(g).rowGap) || 0 : 0) / 96;
    update('part_gap', Math.max(0, Math.min(2, Math.round((now + delta) * 20) / 20)));
  };
  return (
    <div ref={ref} className={`absolute ${pos} z-30 flex flex-col gap-1 invisible group-hover/q:visible print:hidden`}>
      {setHiddenQuestions && <ToolBtn tone="danger" title="Hide this question from the test" onClick={() => setHiddenQuestions(prev => [...prev, uniqueId])}><EyeOff className="w-3.5 h-3.5" /></ToolBtn>}
      {(!isFirst && toggleItemPageBreak) && <ToolBtn tone={itemDef.pageBreak ? 'on' : 'plain'} always={itemDef.pageBreak} title={itemDef.pageBreak ? 'New page before this question: ON (all forms). Click to turn off.' : 'Start a new page before this question (all forms)'} onClick={() => toggleItemPageBreak(itemDef.id)}><FileText className="w-3.5 h-3.5" /></ToolBtn>}
      {itemState?.hidden_parts?.length > 0 && <ToolBtn tone="warn" always title={`Restore ${itemState.hidden_parts.length} hidden part${itemState.hidden_parts.length > 1 ? 's' : ''} (all forms)`} onClick={() => update('hidden_parts', [])}><Eye className="w-3.5 h-3.5" /></ToolBtn>}
      {itemState?.hide_svg && <ToolBtn title="Restore the diagram" onClick={() => update('hide_svg', false)}><Eye className="w-3.5 h-3.5" /></ToolBtn>}
      {hasParts && <ToolBtn title="Less space between parts (all forms)" onClick={() => stepGap(-0.1)}><GapIcon out={false} /></ToolBtn>}
      {hasParts && <ToolBtn title="More space between parts (all forms)" onClick={() => stepGap(0.1)}><GapIcon out /></ToolBtn>}
      {(hasParts && custom) && <ToolBtn tone="warn" always title={`Part spacing set to ${itemState.part_gap.toFixed(2)}in. Click to go back to the default.`} onClick={() => update('part_gap', null)}><RotateCcw className="w-3 h-3" /></ToolBtn>}
    </div>
  );
};

const StudentTestView = ({ formObj, params, updateParam, hideStandards, updateFormTitle, updateCourseTitle, updateSectionTitle, toggleSectionPageBreak, toggleItemPageBreak, rubricMode, customRubricHTML, isPrint=false, questionFontSize="text-[12pt]", hiddenQuestions=[], setHiddenQuestions, showFormLabels=true, settings, setSettings, templates }) => {
  const autoFill = settings?.autoFillSpace !== false;
  const isHiddenItem = (item) => hiddenQuestions.includes(`${item.id}-${item.t}`);
  const qNumMap = itemLabels(formObj, hiddenQuestions, templates); let globalFirstVisibleId = null;
  formObj.sections.forEach(sec => { sec.items.forEach(item => { const uniqueId = `${item.id}-${item.t}`; if (!hiddenQuestions.includes(uniqueId) && !globalFirstVisibleId) globalFirstVisibleId = uniqueId; }); });

  // Automatic page breaks (ids of questions that start a page because the page before couldn't fit them).
  // A layout change (questions, page breaks, fonts, rubric, settings) starts over. Edits to a question's values
  // or spacing keep them, so the pages don't rebuild (and the view doesn't jump) on every click; a question
  // moves back once the page before clearly has room for it (see the rejoin check below).
  const layoutSig = JSON.stringify([
    formObj.sections.map((sec) => [sec.id, sec.pageBreak, sec.items.map((i) => [i.id, i.t, !!i.pageBreak])]),
    hiddenQuestions, questionFontSize, rubricMode, customRubricHTML, showFormLabels, hideStandards, settings && settings.autoFillSpace, settings && settings.nameEveryPage
  ]);
  const [auto, setAuto] = useState({ sig: '', ids: [] });
  const autoIds = auto.sig === layoutSig ? auto.ids : [];
  const addAutoBreak = (id) => setAuto((a) => { const ids = a.sig === layoutSig ? a.ids : []; return ids.includes(id) ? a : { sig: layoutSig, ids: [...ids, id] }; });
  const removeAutoBreak = (id) => setAuto((a) => (a.sig === layoutSig && a.ids.includes(id) ? { sig: layoutSig, ids: a.ids.filter((x) => x !== id) } : a));
  const sheetsRef = useRef(null);
  const nameEveryPage = !settings || settings.nameEveryPage !== false;
  const { homework } = useContext(DocContext);

  // Pages are lists of chunks { section, sIndex, items }. A page starts before a section with pageBreak,
  // or before any later question in a section whose item has pageBreak.
  const pages = []; let page = [];
  formObj.sections.forEach((section, sIndex) => {
    const visible = section.items.filter(item => !isHiddenItem(item));
    if (!visible.length) return;
    let chunk = null;
    visible.forEach((item, vIndex) => {
      const autoBreak = autoIds.includes(item.id);
      const breakHere = (vIndex === 0 ? section.pageBreak : item.pageBreak) || autoBreak;
      if (breakHere && (page.length > 0 || chunk)) { if (chunk) page.push(chunk); pages.push(page); page = []; chunk = null; if (autoBreak) page.auto = true; }
      if (!chunk) chunk = { section, sIndex, items: [] };
      chunk.items.push(item);
    });
    page.push(chunk);
  });
  if (page.length > 0) pages.push(page);
  const isPinned = (item) => params[item.id]?.customSpace !== undefined && params[item.id]?.customSpace !== null;

  // Rejoin: when the page before an automatic page now has room for its first question (with full minimum
  // workspace plus a margin), drop that break. It only fires when the question clearly fits, so it can't flip-flop.
  useLayoutEffect(() => {
    const root = sheetsRef.current; if (!root || !autoIds.length) return;
    const sheets = [...root.children].filter((c) => c.classList.contains('mte-sheet'));
    const growth = (scope) => [...scope.querySelectorAll('[data-mte-ws="auto"]')].reduce((sum, w) => sum + Math.max(0, w.clientHeight - parseFloat(w.dataset.min || '0')), 0);
    pages.forEach((pg, j) => {
      if (!pg.auto || j === 0 || !sheets[j] || !sheets[j - 1]) return;
      const body = sheets[j - 1].lastElementChild, first = sheets[j].querySelector('[data-mte-item]');
      if (!body || !first || !autoIds.includes(first.dataset.mteItem)) return;
      const used = Math.max(0, ...[...body.children].map((c) => c.offsetTop + c.offsetHeight + (parseFloat(getComputedStyle(c).marginBottom) || 0))) - body.offsetTop;
      const free = body.clientHeight - (used - growth(body));
      const need = first.offsetHeight - growth(first) + 16 + 16; // the question, its bottom margin, and a safety margin
      if (free > need) removeAutoBreak(first.dataset.mteItem);
    });
  });

  return (
    <div ref={sheetsRef} className="mte-sheets flex flex-col gap-8 print:gap-0 print:block items-center w-full">
      {pages.map((pageChunks, pIndex) => (
         <PageFrame key={pageChunks.map((c) => c.items.map((i) => i.id).join(',')).join('|')} isPrint={isPrint} onOverflow={addAutoBreak} autoNote={!!pageChunks.auto}>
                {(pIndex > 0 && nameEveryPage) && (
                  <div className="mte-name-line flex justify-end items-end gap-6 w-full mb-3 shrink-0 text-sm">
                    <div className="flex items-end w-60"><span className="font-bold text-gray-800 mr-2">Name:</span><div className="flex-1 border-b border-gray-800"></div></div>
                    <div className="flex items-end w-32"><span className="font-bold text-gray-800 mr-2">Period:</span><div className="flex-1 border-b border-gray-800"></div></div>
                  </div>
                )}
                {pageChunks.map(({section, sIndex, items}) => {
                    let sectionStandard = null;
                    const allStandards = section.items.map(item => templates[item.t].standard);
                    if (allStandards.length > 0 && allStandards.every(v => v === allStandards[0])) sectionStandard = allStandards[0];
                    const firstVisibleIndex = section.items.findIndex(item => !isHiddenItem(item));
                    const shares = autoFill ? items.filter(item => !isPinned(item) && templates[item.t].fill !== false).length : 0;
                    return (
                      // Homework: the day's title runs sideways down a left column instead of a heading row (saves height).
                      <div key={`${section.id}-${items[0].id}`} className={`w-full flex ${homework ? 'flex-row gap-2' : 'flex-col'} mb-2`} style={{ flex: `${shares} 0 auto` }}>
                        {homework && (
                          <div className="relative shrink-0 w-[0.42in] border-r-2 border-gray-800">
                            {!isPrint && sIndex > 0 && toggleSectionPageBreak && (
                              <button onClick={() => toggleSectionPageBreak(section.id)} className={`absolute right-full top-0 mr-1 text-[10px] px-1 rounded border print:hidden ${section.pageBreak ? 'bg-blue-50 text-blue-700 border-blue-300' : 'bg-gray-50 text-gray-400 border-gray-200'}`} title={section.pageBreak ? 'This day starts a new page. Click to keep it on the previous page.' : 'Click to start this day on a new page.'}>📄</button>
                            )}
                            <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                              <div className="max-h-full text-[9pt] leading-tight font-bold uppercase tracking-wide text-gray-800 text-center" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                                <window.GlobalEditableText val={section.title} onChange={(val) => !isPrint && updateSectionTitle(section.id, val)} />
                              </div>
                            </div>
                          </div>
                        )}
                        <div className={homework ? 'flex-1 min-w-0 flex flex-col' : 'contents'}>
                          {items.map((itemDef, cIndex) => {
                            const iIndex = section.items.indexOf(itemDef);
                            const uniqueId = `${itemDef.id}-${itemDef.t}`;
                            const qNum = qNumMap[uniqueId]; const isFirst = (iIndex === firstVisibleIndex); const isLast = (cIndex === items.length - 1);
                            const renderer = templates[itemDef.t]; const itemState = params[itemDef.id];
                            const update = isPrint ? null : (field, val) => updateParam(itemDef.id, field, val);
                            const itemStd = renderer.standard; const isAbsoluteFirst = (uniqueId === globalFirstVisibleId);
                            const grows = autoFill && !isPinned(itemDef) && renderer.fill !== false;
                            return (
                              <div key={uniqueId} data-mte-item={itemDef.id} className={`group/q relative flex flex-col focus-within:z-50 hover:z-[60] print-avoid-break ${isLast ? 'mb-0' : 'mb-4'}`} style={{ flex: `${grows ? 1 : 0} 0 auto` }}>
                                {isAbsoluteFirst && (
                                  <div className="border-b-2 border-gray-800 pb-2 mb-3 shrink-0 w-full">
                                    <div className="flex items-baseline gap-3 w-full">
                                      {showFormLabels && <span className="shrink-0 bg-gray-200 text-gray-700 font-bold px-2.5 py-0.5 rounded-sm text-xs tracking-widest uppercase">{formObj.id}</span>}
                                      <h1 className="flex-1 min-w-0 text-xl font-extrabold text-gray-900 uppercase tracking-wide leading-tight"><window.GlobalEditableText val={formObj.title} onChange={(val) => !isPrint && updateFormTitle(val)} /></h1>
                                    </div>
                                    <div className="flex items-end gap-6 w-full mt-2">
                                      <p className="flex-1 min-w-0 text-gray-600 font-medium text-sm"><window.GlobalEditableText val={formObj.course} onChange={(val) => !isPrint && updateCourseTitle(val)} /></p>
                                      <div className="flex items-end w-60 shrink-0"><span className="font-bold text-gray-800 mr-2 text-sm"><window.LocalEditableText defaultText="Name:"/></span><div className="flex-1 border-b border-gray-800"></div></div>
                                      <div className="flex items-end w-32 shrink-0"><span className="font-bold text-gray-800 mr-2 text-sm"><window.LocalEditableText defaultText="Period:"/></span><div className="flex-1 border-b border-gray-800"></div></div>
                                    </div>
                                  </div>
                                )}
                                {(isFirst && !homework) && (
                                  // (Homework shows the day in its left column instead.)
                                  <div className={`${homework ? 'mb-1' : 'mb-3'} shrink-0 w-full`}>
                                    <div className={`${homework ? 'mb-1' : 'mb-2'} pb-1 border-b-2 border-gray-800 flex justify-between items-end ${isAbsoluteFirst ? 'mt-1' : homework ? 'mt-2' : 'mt-4'}`}>
                                       <div className="flex items-center gap-3">
                                         <h2 className={`${homework ? 'text-[11pt]' : 'text-xl'} font-bold uppercase tracking-wide text-gray-800`}><window.GlobalEditableText val={section.title} onChange={(val) => !isPrint && updateSectionTitle(section.id, val)} /></h2>
                                         {!isPrint && sIndex > 0 && toggleSectionPageBreak && (
                                           <button onClick={() => toggleSectionPageBreak(section.id)} className={`text-xs font-bold px-2 py-0.5 rounded border transition-colors ${section.pageBreak ? 'bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200' : 'bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100 hover:text-gray-600'}`} title="Toggle Page Break before this section">
                                              {section.pageBreak ? '📄 Page Break ON' : '📄 Page Break OFF'}
                                           </button>
                                         )}
                                       </div>
                                       {(!hideStandards && sectionStandard) && <span className="text-sm font-bold text-gray-500 font-mono tracking-wide">{sectionStandard}</span>}
                                    </div>
                                    <RubricRenderer mode={rubricMode} isFirstSection={sIndex === 0} customHTML={customRubricHTML} settings={settings} setSettings={setSettings} />
                                  </div>
                                )}
                                <div className="flex flex-row w-full gap-4 items-stretch" style={{ flex: '1 0 auto' }}>
                                  <div className="flex-1 w-full flex flex-col relative" {...(typeof itemState?.part_gap === 'number' ? { 'data-mte-pgap': '', style: { '--mte-part-gap': `${itemState.part_gap}in` } } : {})}>
                                    {(!hideStandards && !sectionStandard) && (
                                      <div className="flex justify-end w-full mb-1">
                                        <span className="text-xs font-bold text-gray-400 font-mono">[{itemStd}]</span>
                                      </div>
                                    )}
                                    <div className={`text-gray-900 leading-[1.5] shrink-0 ${questionFontSize}`}>
                                      {qNum && qNum.num === undefined ? (
                                        // Labeled item ("Example 2", "Key Idea"): label on its own line, full-width content,
                                        // tools in the page margin to the left.
                                        <div className="relative w-full">
                                          {!isPrint && <QuestionTools isFirst={isFirst} itemDef={itemDef} itemState={itemState} update={update} uniqueId={uniqueId} setHiddenQuestions={setHiddenQuestions} toggleItemPageBreak={toggleItemPageBreak} pos="right-full top-0 mr-2" />}
                                          {qNum.label && <div className="mb-1"><LabelTag text={qNum.label} /></div>}
                                          <div className="w-full">{renderer.q(itemState, update)}</div>
                                        </div>
                                      ) : (
                                      <div className="flex flex-wrap items-baseline gap-x-2 w-full">
                                         <div className="relative self-start mt-1 mr-1 shrink-0 min-w-[1.6rem]">
                                           <span className="font-bold text-gray-900">{qNum && qNum.num}.</span>
                                           {!isPrint && <QuestionTools isFirst={isFirst} itemDef={itemDef} itemState={itemState} update={update} uniqueId={uniqueId} setHiddenQuestions={setHiddenQuestions} toggleItemPageBreak={toggleItemPageBreak} />}
                                         </div>
                                         <div className="inline flex-1 min-w-[200px]">
                                           {renderer.q(itemState, update)}
                                         </div>
                                      </div>
                                      )}
                                    </div>
                                    <Workspace itemState={itemState} renderer={renderer} update={update} isPrint={isPrint} autoFill={autoFill && renderer.fill !== false} />
                                  </div>
                                  {(renderer.svg && !itemState?.hide_svg) && (
                                    <div className="shrink-0 w-[240px] h-0 relative z-10 print:w-[200px]">
                                      <div className="absolute top-0 right-0">
                                        <window.DraggableSVG state={itemState} update={update} disableRotate={renderer.is2D}>{renderer.svg(itemState, update, false)}</window.DraggableSVG>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                })}
         </PageFrame>
      ))}
    </div>
  );
};

// splitSections (page views only): one sheet per section, with the full key header on the first sheet.
// Answer-key lines never scroll or get cut off in print: parts wrap (see MathText), and anything still too wide
// (one long expression) shrinks its text until it fits, down to 60%. It resets when the question's numbers change.
const FitWidth = ({ className, dep, children }) => {
  const ref = useRef(null);
  const [scale, setScale] = useState(1);
  const depKey = JSON.stringify(dep || null);
  useEffect(() => { setScale(1); }, [depKey]);
  useLayoutEffect(() => {
    const el = ref.current; if (!el) return;
    if (el.scrollWidth > el.clientWidth + 1 && scale > 0.6) setScale(Math.max(0.6, Math.floor((scale * el.clientWidth / el.scrollWidth) * 100) / 100));
  });
  return <div ref={ref} className={`${className} overflow-hidden`} data-mte-fit={scale < 1 ? scale : undefined}><div style={scale < 1 ? { fontSize: `${scale * 100}%` } : undefined}>{children}</div></div>;
};

const AnswerKeyView = (props) => {
  // Everything inside renders as the key: window.Blank shows its answer, window.KeyOnly its children.
  const doc = useContext(DocContext);
  return <DocContext.Provider value={{ ...doc, key: true }}><AnswerKeyPages {...props} notes={doc.notes} /></DocContext.Provider>;
};
const AnswerKeyPages = ({ formObj, params, updateParam, settings, toggleSectionPageBreak, isPrint=false, hiddenQuestions=[], setHiddenQuestions, templates, splitSections=false, notes=false }) => {
  const qNumMap = itemLabels(formObj, hiddenQuestions, templates);
  const numText = (id) => { const m = qNumMap[id]; return !m ? '-' : m.num !== undefined ? `${m.num}.` : m.label; };
  const pages = [[]];
  formObj.sections.forEach((section, sIndex) => {
    const hasVisibleItems = section.items.some(item => !hiddenQuestions.includes(`${item.id}-${item.t}`));
    if (!hasVisibleItems && isPrint) return;
    if (splitSections && pages[pages.length - 1].length) pages.push([]);
    pages[pages.length - 1].push({ section, sIndex });
  });

  return (
    <div className={`mte-sheets flex flex-col gap-8 print:gap-0 print:block items-center w-full ${isPrint ? 'print-page-break' : ''}`}>
      {pages.map((pageSections, pIndex) => (
         <div key={pIndex} style={{ width: '8.5in', padding: '0.4in' }} className={`mte-sheet bg-red-50/20 mx-auto box-border flex flex-col relative ${isPrint ? 'print:min-h-0' : 'shadow-2xl border border-red-200 mb-8 min-h-[11in]'} overflow-hidden`}>
            {(splitSections && pIndex > 0) && <div className="text-xs font-bold text-red-700 uppercase tracking-widest mb-4">Answer key{notes ? '' : ` · ${formObj.id}`}</div>}
            {(!splitSections || pIndex === 0) && (
            <div className="border-b-4 border-red-800 pb-4 mb-8 shrink-0 print-avoid-break">
              <div className="flex justify-center items-center gap-3">
                 <h1 className="text-3xl font-extrabold text-red-800 uppercase tracking-wide text-center">{notes ? 'Answer Key' : 'Teacher Answer Key'}</h1>
                 {settings.showFormLabels && <span className="bg-red-100 text-red-800 font-bold px-3 py-1 rounded-full text-lg tracking-widest">{formObj.id}</span>}
              </div>
              <p className="text-center font-bold text-red-700 mt-2 text-xl"><span dangerouslySetInnerHTML={{ __html: formObj.title }} /></p>
            </div>
            )}
            <div className="space-y-0 flex flex-col">
              {pageSections.map(({section, sIndex}) => {
                 const firstVisibleIndex = section.items.findIndex(item => !hiddenQuestions.includes(`${item.id}-${item.t}`));
                 return (
                    // print:block: Chrome won't split a flex column between pages at a question, so a section that
                    // starts below the key's title would jump whole to the next page and leave the title alone.
                    <div key={section.id} className="w-full mt-4 flex flex-col print:block">
                        {section.items.map((itemDef, iIndex) => {
                          const uniqueId = `${itemDef.id}-${itemDef.t}`; const isHidden = hiddenQuestions.includes(uniqueId);
                          if (isPrint && isHidden) return null;
                          const qNum = isHidden ? '-' : numText(uniqueId); const labeled = !isHidden && qNumMap[uniqueId] && qNumMap[uniqueId].num === undefined; const isFirst = (iIndex === firstVisibleIndex); const isLast = (iIndex === section.items.length - 1);
                          const renderer = templates[itemDef.t]; const itemState = params[itemDef.id];
                          const update = isPrint ? null : (field, val) => updateParam(itemDef.id, field, val);
                          return (
                            <div key={uniqueId} className={`relative group/q flex flex-col print-avoid-break ${isLast ? 'mb-0' : 'mb-6 border-b border-red-100 pb-6'} ${isHidden ? 'bg-gray-50 rounded-xl p-6 ring-1 ring-inset ring-gray-200' : ''}`}>
                              {isFirst && (
                                <div className="flex items-center gap-3 mb-6 pb-2 border-b border-red-300 shrink-0">
                                  <h2 className="text-xl font-bold text-red-800 uppercase tracking-wide mb-0 pb-0 border-0"><span dangerouslySetInnerHTML={{ __html: section.title }} /></h2>
                                  {!isPrint && sIndex > 0 && toggleSectionPageBreak && (
                                     <button onClick={() => toggleSectionPageBreak(section.id)} className={`text-xs font-bold px-2 py-0.5 rounded border transition-colors ${section.pageBreak ? 'bg-red-100 text-red-700 border-red-300 hover:bg-red-200' : 'bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100 hover:text-gray-600'}`} title="Toggle Page Break before this section">
                                        {section.pageBreak ? '📄 Page Break ON' : '📄 Page Break OFF'}
                                     </button>
                                  )}
                                </div>
                              )}
                              {!isPrint && setHiddenQuestions && (
                                <div className="absolute top-0 right-0 m-2 z-10 flex items-center gap-2">
                                  {(!isHidden && itemState?.hide_svg) && <button onClick={() => update('hide_svg', false)} className="opacity-0 group-hover/q:opacity-100 flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 rounded shadow-sm text-sm font-bold transition-all duration-200"><Eye className="w-4 h-4" /> Restore Image</button>}
                                  {isHidden ? <button onClick={() => setHiddenQuestions(prev => prev.filter(id => id !== uniqueId))} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 hover:text-indigo-800 rounded shadow-sm text-sm font-bold transition-colors"><Eye className="w-4 h-4" /> Restore Question</button>
                                  : <button onClick={() => setHiddenQuestions(prev => [...prev, uniqueId])} className="opacity-0 group-hover/q:opacity-100 flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 rounded shadow-sm text-sm font-bold transition-all duration-200"><EyeOff className="w-4 h-4" /> Hide</button>}
                                </div>
                              )}
                              {isHidden && !isPrint && <div className="text-center font-bold text-gray-500 mb-6 uppercase tracking-widest text-xs shrink-0">This question is currently hidden from the student test</div>}
                              <div className={`flex flex-col w-full gap-4 flex-1 min-h-0 ${isHidden && !isPrint ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
                                {settings.keyShowQuestion && (
                                  <div className="flex flex-row w-full gap-4 items-start shrink-0">
                                    <div className="flex-1 min-w-0 w-full">
                                      {labeled ? (
                                        <div className={`leading-[1.5] ${notes ? 'text-gray-800' : 'text-gray-500'} ${settings.questionFontSize}`}>
                                          {qNum && <div className="mb-1"><LabelTag text={qNum} keyView /></div>}
                                          <div className="w-full">{renderer.q(itemState, update)}</div>
                                        </div>
                                      ) : (
                                      <div className={`leading-[1.5] ${notes ? 'text-gray-800' : 'text-gray-500'} flex flex-wrap items-baseline gap-x-2 ${settings.questionFontSize}`}>
                                        <span className="font-bold shrink-0">{qNum}</span>
                                        <div className="inline flex-1 min-w-[200px]">{renderer.q(itemState, update)}</div>
                                      </div>
                                      )}
                                    </div>
                                    {(renderer.svg && !itemState?.hide_svg) && (
                                      <div className="shrink-0 flex justify-center items-start pt-2 w-[204px] opacity-80">
                                        <window.DraggableSVG state={itemState} update={update} disableRotate={renderer.is2D} forceReset={true} forceScale={0.85}>{renderer.svg(itemState, update, true)}</window.DraggableSVG>
                                      </div>
                                    )}
                                  </div>
                                )}
                                {((settings.keyShowWork && renderer.work) || (settings.keyShowAnswer && renderer.answer) || (settings.keyShowGrading && renderer.grading) || !settings.keyShowQuestion) && (
                                  <div className={`${settings.keyShowQuestion ? 'ml-6 mt-2' : ''} p-4 bg-red-50 border border-red-200 rounded-md relative shrink-0`}>
                                     {!settings.keyShowQuestion && <span className="font-bold text-red-800 absolute -ml-6">{qNum}</span>}
                                     {settings.keyShowWork && renderer.work && <FitWidth dep={itemState} className="text-red-800 leading-[1.6] text-[11pt] mb-3">{renderer.work(itemState)}</FitWidth>}
                                     {settings.keyShowAnswer && renderer.answer && <FitWidth dep={itemState} className="font-bold text-red-700 leading-[1.6] text-[14pt] mb-2">{renderer.answer(itemState)}</FitWidth>}
                                     {settings.keyShowGrading && renderer.grading && <div className="mt-4 pt-3 border-t border-red-200 text-[10pt] text-red-600 font-sans italic flex items-start gap-2"><CheckCircle className="w-4 h-4 shrink-0 mt-0.5" /><span><strong>Grading Note:</strong> {typeof renderer.grading === 'function' ? renderer.grading(itemState) : renderer.grading}</span></div>}
                                  </div>
                                )}
                                <div className="w-full flex-1"></div>
                              </div>
                            </div>
                          )
                        })}
                    </div>
                 )
              })}
            </div>
         </div>
      ))}
    </div>
  );
};

// --- MAIN APP CONTROLLER ---
function App({ config }) {
  const { standards, paramsGenerator, templates, forms: defaultForms, topicId } = config;
  // Resource packets (guided notes, examples, practice) and weekly homework: one version, no rubric, no
  // standards summary page.
  const isNotes = config.kind === 'notes' || config.kind === 'homework';
  const firstParams = () => (isNotes ? paramsGenerator('A') : { ...paramsGenerator('A'), ...paramsGenerator('B') });
  const localStoragePrefix = `mtg_${topicId}`;
  // A snapshot baked into the page (the test viewer's "Copy HTML") carries the numbers and edits the
  // teacher saw: { id, topicId, store: { params: '<json>', ... } }. A snapshot this browser hasn't seen
  // replaces its saved state once; where storage is blocked (e.g. a sandboxed LMS embed) it's read directly.
  const snapshot = (window.MTE_SNAPSHOT && window.MTE_SNAPSHOT.topicId === topicId) ? window.MTE_SNAPSHOT : null;
  const snapshotStore = (snapshot && snapshot.store) || {};
  const writeSaved = (key, value) => { try { localStorage.setItem(`${localStoragePrefix}_${key}`, value); } catch (e) {} };
  const readSaved = (key) => {
    try { const v = localStorage.getItem(`${localStoragePrefix}_${key}`); if (v !== null) return v; } catch (e) {}
    return snapshotStore[key] !== undefined ? snapshotStore[key] : null;
  };
  if (snapshot && snapshot.id) {
    try {
      if (readSaved('snapshotId') !== snapshot.id) {
        Object.entries(snapshotStore).forEach(([key, value]) => { if (/^[A-Za-z]+$/.test(key) && typeof value === 'string') writeSaved(key, value); });
        writeSaved('snapshotId', snapshot.id);
      }
    } catch (e) {}
  }

  const [activeTab, setActiveTab] = useState('student');
  // Page views for embedders such as the test viewer: mode 'edit' (normal editor), 'tiles' (all pages as
  // thumbnails), or 'scroll' (pages one under another, fit to width). Both page modes show the printed layout.
  const [view, setView] = useState({ mode: 'edit', form: null, key: false, zoom: 0.3 });
  const [fitZoom, setFitZoom] = useState(1);
  const [jumpTo, setJumpTo] = useState(null);
  const pagesRef = useRef(null);
  const [activeFormId, setActiveFormId] = useState(() => readSaved('activeFormId') || 'Form A');
  
  // Bulletproof Local Storage Initializers
  const [forms, setForms] = useState(() => { 
      try { const saved = readSaved('forms'); return saved ? JSON.parse(saved) : defaultForms; } 
      catch(e) { return defaultForms; } 
  });
  const [params, setParams] = useState(() => { 
      try { const saved = readSaved('params'); return saved ? JSON.parse(saved) : firstParams(); } 
      catch(e) { return firstParams(); } 
  });
  const [hiddenQuestions, setHiddenQuestions] = useState(() => { 
      try { const saved = readSaved('hiddenQuestions'); return saved ? JSON.parse(saved) : []; } 
      catch(e) { return []; } 
  });
  const [disabledStandards, setDisabledStandards] = useState(() => { 
      try { const saved = readSaved('disabledStandards'); return saved ? JSON.parse(saved) : []; } 
      catch(e) { return []; } 
  });
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [selectedFormsToPrint, setSelectedFormsToPrint] = useState(() => (defaultForms || []).map((f) => f.id));

  const defaultSettings = {
    printSpecs: true, printForms: true, printKeys: true, hideStandardsOnStudent: config.kind === 'homework' /* homework pages skip the codes by default */, showFormLabels: true, keyShowAnswer: true, keyShowWork: true, keyShowQuestion: true, keyShowGrading: true, rubricMode: '5-point', autoFillSpace: true, showAnswerLines: true, nameEveryPage: config.kind !== 'homework' /* homework prints back to back */,
    customRubricHTML: '<div style="padding: 10px; border: 2px dashed #ccc; text-align: center;">\n  <em>[Insert Custom Rubric HTML Here]</em>\n</div>', questionFontSize: 'text-[11pt]',
    rubricData: {
      hN: "N:", hNDesc: "Not demonstrated", hC: "C:", hCDesc: "Developing", hB: "B:", hBDesc: "Approaching", hAm: "A−:", hAmDesc: "Proficient", hA: "A:", hADesc: "Mastery",
      c51: "Answer is not correct. Work is absent or shows no concepts learned.", c52: "Answer is correct. Work is absent, uses guess & check. OR major math errors.", c53: "Answer is correct & shows partial ideas. OR Answer is incorrect due to minor error in work.", c54: "Answer is correct. Work shows ideas learned. May contain minor errors but shows strong understanding.", c55: "Answer is correct. Work shows ideas learned. May contain a minor error but shows strong understanding.",
      c41: "No evidence of understanding.", c42: "Partial understanding with significant errors.", c43: "Solid understanding with minor errors.", c44: "Complete understanding and flawless execution.",
      sN: "N", sC: "C", sB: "B", sAm: "A−", sA: "A"
    }
  };
  const [rawSettings, setSettings] = useState(() => { 
      try { const saved = readSaved('settings'); return saved ? { ...defaultSettings, ...JSON.parse(saved), showFormLabels: JSON.parse(saved).showFormLabels !== undefined ? JSON.parse(saved).showFormLabels : true } : defaultSettings; } 
      catch(e) { return defaultSettings; } 
  });
  // Notes never show a rubric, form labels, or the standards summary, and the key always shows the notes.
  const settings = isNotes ? { ...rawSettings, rubricMode: 'hidden', printSpecs: false, showFormLabels: false, keyShowQuestion: true } : rawSettings;

  useEffect(() => { writeSaved('forms', JSON.stringify(forms)); }, [forms]);
  useEffect(() => { writeSaved('params', JSON.stringify(params)); }, [params]);
  useEffect(() => { writeSaved('hiddenQuestions', JSON.stringify(hiddenQuestions)); }, [hiddenQuestions]);
  useEffect(() => { writeSaved('disabledStandards', JSON.stringify(disabledStandards)); }, [disabledStandards]);
  useEffect(() => { writeSaved('settings', JSON.stringify(rawSettings)); }, [rawSettings]);
  useEffect(() => { writeSaved('activeFormId', activeFormId); }, [activeFormId]);

  // Bulletproof mapping function to prevent 'undefined' crashes
  const getFilteredForms = (formsToFilter) => {
    if (!Array.isArray(formsToFilter)) return [];
    return formsToFilter.map(form => ({
      ...form,
      sections: Array.isArray(form.sections) ? form.sections.map(sec => ({
        ...sec,
        items: Array.isArray(sec.items) ? sec.items.filter(item => templates[item.t] && !disabledStandards.includes(templates[item.t].standard)) : []
      })).filter(sec => sec.items.length > 0) : []
    }));
  };

  const filteredForms = getFilteredForms(forms); 
  const activeFilteredForm = filteredForms.find(f => f.id === activeFormId) || filteredForms[0]; 
  const filteredFormsToPrint = filteredForms.filter(f => selectedFormsToPrint.includes(f.id));

  // Question page breaks match by question number (A_q5, B_q5, ...) so all forms stay parallel.
  const toggleItemPageBreak = (itemId) => { const num = itemId.split('_')[1]; setForms((forms || []).map(f => ({ ...f, sections: (f.sections || []).map(sec => ({ ...sec, items: (sec.items || []).map(item => item.id.split('_')[1] === num ? { ...item, pageBreak: !item.pageBreak } : item) })) }))); };
  const toggleSectionPageBreak = (sectionId) => setForms((forms || []).map(f => ({ ...f, sections: (f.sections || []).map(sec => sec.id === sectionId ? { ...sec, pageBreak: !sec.pageBreak } : sec) })));
  const updateFormTitle = (newTitle) => setForms((forms || []).map(f => ({ ...f, title: newTitle })));
  const updateCourseTitle = (newCourse) => setForms((forms || []).map(f => ({ ...f, course: newCourse })));
  const updateSectionTitle = (sectionId, newTitle) => setForms((forms || []).map(f => ({ ...f, sections: (f.sections || []).map(sec => sec.id === sectionId ? { ...sec, title: newTitle } : sec) })));

  const updateParam = (id, field, value) => {
    setParams(prev => {
      const next = { ...prev };
      if (field === 'RESET_VISUALS') {
        const match = id.match(/([a-zA-Z]+)(\d+)/) || id.match(/([a-zA-Z]+)([A-Z][a-z]+)/); const numPart = match ? match[2] : null;
        Object.keys(next).forEach(key => { if (key === id || (numPart && key.includes(numPart))) { const cleanState = {}; Object.keys(next[key]).forEach(k => { if (!k.endsWith('_dx') && !k.endsWith('_dy') && !k.endsWith('_scale') && !k.endsWith('_rotYaw') && !k.endsWith('_rotPitch') && !k.endsWith('_dock') && k !== 'customSpace') { cleanState[k] = next[key][k]; } }); next[key] = cleanState; } });
        return next;
      }
      next[id] = { ...next[id], [field]: value };
      // Hidden parts and diagram visuals apply to the same question on every form (A_q5, B_q5, ...).
      // Compare the whole question number so q1 doesn't also match q10-q19.
      if (field === 'hidden_parts' || field === 'part_gap' || field.endsWith('_dx') || field.endsWith('_dy') || field.endsWith('_scale') || field.endsWith('_rotYaw') || field.endsWith('_rotPitch') || field.endsWith('_dock')) {
        const num = id.split('_')[1];
        const match = id.match(/([a-zA-Z]+)(\d+)/) || id.match(/([a-zA-Z]+)([A-Z][a-z]+)/);
        Object.keys(next).forEach(key => { if (key !== id && (num !== undefined ? key.split('_')[1] === num : match && key.includes(match[2]))) next[key] = { ...next[key], [field]: value }; });
      }
      return next;
    });
  };

  const generateNewForm = () => {
    const nextCharCode = 65 + (forms || []).length; const letter = String.fromCharCode(nextCharCode);
    setParams(prev => ({ ...prev, ...paramsGenerator(letter) }));
    const baseForm = (forms && forms[0]) ? forms[0] : defaultForms[0];
    const newForm = { id: `Form ${letter}`, title: baseForm.title, course: baseForm.course, sections: (baseForm.sections || []).map(sec => ({ id: sec.id, title: sec.title, pageBreak: sec.pageBreak, items: (sec.items || []).map(item => ({ id: `${letter}_${item.id.split('_')[1]}`, t: item.t, pageBreak: item.pageBreak })) })) };
    setForms([...(forms || []), newForm]); setSelectedFormsToPrint(prev => [...prev, newForm.id]); setActiveFormId(newForm.id);
  };

  const handlePrintClick = () => {
    try {
      document.querySelectorAll('input[type="text"], input[type="number"], input[type="date"], textarea').forEach(el => el.setAttribute('value', el.value));
      document.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach(el => { if (el.checked) el.setAttribute('checked', 'checked'); else el.removeAttribute('checked'); });
      const scriptToInject = `window.INITIAL_PARAMS = ${JSON.stringify(params)}; window.BASE_FORMS = ${JSON.stringify(filteredForms)}; window.HIDDEN_QUESTIONS = ${JSON.stringify(hiddenQuestions)}; window.INITIAL_SETTINGS = ${JSON.stringify(settings)};`;
      const clonedDoc = document.documentElement.cloneNode(true); const scriptTag = document.createElement('script'); scriptTag.textContent = scriptToInject; clonedDoc.querySelector('head').appendChild(scriptTag);
      clonedDoc.querySelectorAll('script').forEach(script => { if (script.src && script.src.includes('engine.jsx')) script.remove(); }); 
      const printWin = window.open('', '_blank');
      if (printWin) { printWin.document.write('<!DOCTYPE html>\n' + clonedDoc.outerHTML); printWin.document.close(); setTimeout(() => { printWin.focus(); printWin.print(); }, 1200); } 
      else setShowPrintModal(true);
    } catch (error) { setShowPrintModal(true); }
  };

  const getStandardsSummary = () => {
    const summary = {};
    filteredFormsToPrint.forEach(form => {
      let globalQNum = 1;
      (form.sections || []).forEach(sec => {
        (sec.items || []).forEach(item => {
          if (hiddenQuestions.includes(`${item.id}-${item.t}`)) return;
          const std = templates[item.t]?.standard;
          if (!std) return;
          if (!summary[std]) summary[std] = [];
          summary[std].push(`${form.id.split(' ')[1] || ''}${globalQNum}`);
          globalQNum++;
        });
      });
    });
    return summary;
  };

  // Embedders (the test library sets window.MTE_EMBEDDED) drive tabs, the previewed version, and printing
  // from their own toolbar, so the engine's header is left out. Standalone files keep it.
  const embedded = !!window.MTE_EMBEDDED;
  useEffect(() => {
    const prev = window.MathTestEngine.view || {};
    window.MathTestEngine.view = {
      // next: { mode, form, key, zoom } for page views; tab ('student' | 'key' | 'standards' | 'settings') and
      // active (the version shown in edit mode) for the editor.
      set: (next) => {
        const { tab, active, ...rest } = next;
        if (tab) setActiveTab(tab);
        if (active && (forms || []).some((f) => f.id === active)) setActiveFormId(active);
        setView((v) => ({ ...v, ...rest }));
      },
      get: () => ({ ...view, tab: activeTab, active: activeFormId }),
      forms: () => filteredForms.map((f) => f.id),
      allForms: () => (forms || []).map((f) => f.id),
      kind: isNotes ? config.kind : 'test',
      newForm: () => { if (!isNotes) generateNewForm(); },
      print: () => (embedded ? window.print() : handlePrintClick()),
      embedded,
      onChange: prev.onChange || null, // set by the embedder; called when the engine changes the view itself
      onState: prev.onState || null // set by the embedder; called when the tab, version, or list of versions changes
    };
  });
  const formIds = (forms || []).map((f) => f.id).join('|');
  useEffect(() => {
    const v = window.MathTestEngine.view;
    if (v && v.onState) v.onState({ tab: activeTab, active: activeFormId, forms: formIds.split('|') });
  }, [activeTab, activeFormId, formIds]);
  useEffect(() => {
    const fit = () => setFitZoom(Math.min(1.25, Math.max(0.3, (window.innerWidth - 48) / (8.5 * 96))));
    fit(); window.addEventListener('resize', fit); return () => window.removeEventListener('resize', fit);
  }, []);
  useEffect(() => { // after a tile click switches to scroll, bring that page into view
    if (jumpTo === null || view.mode !== 'scroll' || !pagesRef.current) return;
    const sheet = pagesRef.current.querySelectorAll('.mte-sheet')[jumpTo];
    if (sheet) sheet.scrollIntoView({ block: 'start' });
    setJumpTo(null);
  }, [jumpTo, view.mode]);
  const viewForm = filteredForms.find((f) => f.id === view.form) || activeFilteredForm;
  const pickTile = (e) => {
    if (view.mode !== 'tiles') return;
    const sheet = e.target.closest('.mte-sheet'); if (!sheet) return;
    const i = [...pagesRef.current.querySelectorAll('.mte-sheet')].indexOf(sheet);
    const next = { ...view, mode: 'scroll' };
    setView(next); setJumpTo(i);
    if (window.MathTestEngine.view && window.MathTestEngine.view.onChange) window.MathTestEngine.view.onChange(next);
  };

  return (
    <div className={`min-h-screen bg-gray-100 text-gray-900 font-sans print:bg-white relative print:min-h-0 print:h-auto ${settings.showAnswerLines === false ? 'mte-hide-answer-lines' : ''}`}>
      {showPrintModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 print:hidden">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-lg w-full text-center relative animate-in fade-in zoom-in duration-200">
            <button onClick={() => setShowPrintModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><XIcon className="w-6 h-6" /></button>
            <div className="mx-auto bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6"><Printer className="w-8 h-8 text-blue-600" /></div>
            <h2 className="text-2xl font-bold mb-3 text-gray-900">Popup Blocked or Printing Restricted</h2>
            <p className="text-gray-600 mb-6 text-lg">We tried to open a printable version of your tests, but your browser blocked the pop-up window.</p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8">
              <p className="font-semibold text-gray-800 mb-2">Please use your keyboard to open the print dialog:</p>
              <div className="flex justify-center items-center gap-4 text-sm font-bold text-gray-600">
                <span className="bg-white px-3 py-1.5 border border-gray-300 rounded shadow-sm">Ctrl + P <span className="font-normal text-xs ml-1">(Windows)</span></span><span>or</span>
                <span className="bg-white px-3 py-1.5 border border-gray-300 rounded shadow-sm">Cmd + P <span className="font-normal text-xs ml-1">(Mac)</span></span>
              </div>
            </div>
            <button onClick={() => setShowPrintModal(false)} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold w-full shadow-md">Got it, close this message</button>
          </div>
        </div>
      )}
      {view.mode !== 'edit' ? (
        <div ref={pagesRef} className={`print:hidden mte-pages mte-${view.mode}`} onClick={pickTile} style={{ zoom: view.mode === 'tiles' ? view.zoom : fitZoom }}>
          {viewForm && (view.key
            ? <AnswerKeyView formObj={viewForm} params={params} updateParam={updateParam} settings={settings} toggleSectionPageBreak={toggleSectionPageBreak} isPrint={true} hiddenQuestions={hiddenQuestions} templates={templates} splitSections={true} />
            : <StudentTestView formObj={viewForm} params={params} updateParam={updateParam} hideStandards={settings.hideStandardsOnStudent} updateFormTitle={updateFormTitle} updateCourseTitle={updateCourseTitle} updateSectionTitle={updateSectionTitle} toggleSectionPageBreak={toggleSectionPageBreak} rubricMode={settings.rubricMode} customRubricHTML={settings.customRubricHTML} isPrint={true} questionFontSize={settings.questionFontSize} hiddenQuestions={hiddenQuestions} showFormLabels={settings.showFormLabels} settings={settings} setSettings={setSettings} templates={templates} />)}
        </div>
      ) : (
      <div className="print:hidden">
        {embedded ? <div className="h-6" /> : <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50 mb-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-center py-4 gap-4">
              <div className="flex items-center gap-3">
                <div className="text-blue-600"><GraduationCap className="w-8 h-8" /></div>
                <div className="flex flex-col">
                  <h1 className="text-xl font-bold tracking-tight text-blue-600 leading-tight">Math Test Generator</h1>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-0.5">
                    <span className="font-semibold">@andyschwencodes</span>
                    <a href="https://instagram.com/andyschwencodes" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-pink-600 transition-colors"><Instagram className="w-4 h-4" /></a>
                    <a href="https://youtube.com/@andyschwencodes" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-red-600 transition-colors"><Youtube className="w-4 h-4" /></a>
                  </div>
                </div>
              </div>
              <div className={`flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-md border border-gray-200 ${isNotes ? 'hidden' : ''}`}>
                <Edit3 className="w-4 h-4 text-gray-500" /><span className="text-sm font-bold text-gray-700">Preview Version:</span>
                <div className="relative">
                  <select value={activeFormId} onChange={(e) => { if (e.target.value === 'NEW') generateNewForm(); else setActiveFormId(e.target.value); }} className="appearance-none bg-white border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block p-1.5 pr-8 font-semibold cursor-pointer">
                    {(forms || []).map(f => <option key={f.id} value={f.id}>{f.id}</option>)}
                    <option value="NEW" className="text-blue-600 font-bold">+ Generate New Form</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
              </div>
              <button onClick={handlePrintClick} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-md shadow-sm transition-colors font-semibold"><Printer className="w-5 h-5" /> Print Selected Batch</button>
            </div>
            <div className="flex space-x-8 mt-2 overflow-x-auto">
              <button onClick={() => setActiveTab('student')} className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'student' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}><FileText className="w-4 h-4 shrink-0" /> Student Test</button>
              <button onClick={() => setActiveTab('key')} className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'key' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}><KeyIcon className="w-4 h-4 shrink-0" /> Answer Key</button>
              <button onClick={() => setActiveTab('standards')} className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'standards' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}><ListIcon className="w-4 h-4 shrink-0" /> Standards</button>
              <button onClick={() => setActiveTab('settings')} className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'settings' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}><SettingsIcon className="w-4 h-4 shrink-0" /> Print Settings</button>
            </div>
          </div>
        </header>}

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          {activeTab === 'standards' && (
            <div className="bg-white p-8 shadow-lg border border-gray-200 rounded-lg animate-in fade-in duration-200">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Filter Standards</h2>
              <p className="text-gray-600 mb-6">Deselect a standard below to immediately remove all its associated questions from the generated tests and answer keys.</p>
              <div className="space-y-3">
                {Object.entries(standards).map(([std, desc]) => {
                   const isActive = !disabledStandards.includes(std);
                   return (
                     <label key={std} className={`flex items-start space-x-4 p-4 border rounded-lg cursor-pointer transition-colors ${isActive ? 'bg-blue-50 border-blue-200 hover:bg-blue-100' : 'bg-gray-50 border-gray-200 opacity-70 hover:opacity-100'}`}>
                       <input type="checkbox" className="mt-1 w-5 h-5 accent-blue-600 cursor-pointer" checked={isActive} onChange={(e) => { if (e.target.checked) setDisabledStandards(prev => prev.filter(s => s !== std)); else setDisabledStandards(prev => [...prev, std]); }} />
                       <div><div className={`font-bold ${isActive ? 'text-blue-800' : 'text-gray-600'}`}>{std}</div><div className="text-sm text-gray-600">{desc}</div></div>
                     </label>
                   );
                })}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white p-8 shadow-lg border border-gray-200 rounded-lg animate-in fade-in duration-200">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Global Print & Display Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-blue-800 bg-blue-50 px-3 py-1 rounded">1. Select Documents to Print</h3>
                  <div className={`p-3 border border-gray-200 rounded-md bg-gray-50 ${isNotes ? 'hidden' : ''}`}>
                    <div className="font-bold text-gray-800 mb-2 border-b border-gray-200 pb-1">Select Forms to Include:</div>
                    <div className="grid grid-cols-2 gap-2">
                      {(forms || []).map(f => (
                        <label key={f.id} className="flex items-center space-x-3 cursor-pointer p-1.5 hover:bg-gray-100 rounded">
                          <input type="checkbox" checked={selectedFormsToPrint.includes(f.id)} onChange={(e) => { if (e.target.checked) setSelectedFormsToPrint([...selectedFormsToPrint, f.id]); else setSelectedFormsToPrint(selectedFormsToPrint.filter(id => id !== f.id)); }} className="w-4 h-4 accent-blue-600 cursor-pointer" />
                          <span className="text-gray-700 font-medium text-sm">{f.id}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <label className={`flex items-center space-x-3 cursor-pointer p-2 hover:bg-gray-50 rounded ${isNotes ? 'hidden' : ''}`}><input type="checkbox" checked={settings.printSpecs} onChange={e => setSettings({...settings, printSpecs: e.target.checked})} className="w-5 h-5 accent-blue-600 cursor-pointer" /><span className="font-semibold text-gray-700">Standards Summary Page</span></label>
                  <label className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-gray-50 rounded"><input type="checkbox" checked={settings.printForms} onChange={e => setSettings({...settings, printForms: e.target.checked})} className="w-5 h-5 accent-blue-600 cursor-pointer" /><span className="font-semibold text-gray-700">{isNotes ? 'Print Student Pages' : 'Print Student Test Copies'}</span></label>
                  <label className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-gray-50 rounded"><input type="checkbox" checked={settings.printKeys} onChange={e => setSettings({...settings, printKeys: e.target.checked})} className="w-5 h-5 accent-blue-600 cursor-pointer" /><span className="font-semibold text-gray-700">{isNotes ? 'Print Answer Key' : 'Print Teacher Answer Keys'}</span></label>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-blue-800 bg-blue-50 px-3 py-1 rounded">2. Customize Content</h3>
                  <div className={`p-3 border border-gray-200 rounded-md bg-gray-50 space-y-3 ${isNotes ? 'hidden' : ''}`}>
                     <div className="font-bold text-gray-800 border-b border-gray-200 pb-1">Rubric Settings:</div>
                     <select value={settings.rubricMode} onChange={(e) => setSettings({...settings, rubricMode: e.target.value})} className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-blue-500 focus:border-blue-500">
                        <option value="5-point">Standard 5-Point Scale</option><option value="4-point">Standard 4-Point Scale</option><option value="custom">Import Custom (Text/HTML)</option><option value="hidden">Hide Rubric Entirely</option>
                     </select>
                     {settings.rubricMode === 'custom' && <textarea value={settings.customRubricHTML} onChange={(e) => setSettings({...settings, customRubricHTML: e.target.value})} className="w-full p-2 border border-gray-300 rounded text-sm font-mono mt-2" rows="4" placeholder="<div>Your HTML here</div>" />}
                  </div>
                  <div className="p-3 border border-gray-200 rounded-md bg-gray-50 space-y-3">
                     <div className="font-bold text-gray-800 border-b border-gray-200 pb-1">Question Font Size:</div>
                     <select value={settings.questionFontSize} onChange={(e) => setSettings({...settings, questionFontSize: e.target.value})} className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-blue-500 focus:border-blue-500">
                        <option value="text-[11pt]">Small (11pt)</option><option value="text-[12pt]">Standard (12pt)</option><option value="text-[14pt]">Large (14pt)</option><option value="text-[16pt]">Extra Large (16pt)</option>
                     </select>
                  </div>
                  <label className="flex items-start space-x-3 cursor-pointer p-2 hover:bg-gray-50 rounded"><input type="checkbox" checked={settings.showAnswerLines !== false} onChange={e => setSettings({...settings, showAnswerLines: e.target.checked})} className="w-5 h-5 mt-0.5 accent-blue-600 cursor-pointer" /><span><span className="font-semibold text-gray-700 block">Show answer lines</span><span className="text-xs text-gray-500">Turn off for open work space: the lines disappear but their room stays, so pages don't shift.</span></span></label>
                  <label className="flex items-start space-x-3 cursor-pointer p-2 hover:bg-gray-50 rounded"><input type="checkbox" checked={settings.autoFillSpace !== false} onChange={e => setSettings({...settings, autoFillSpace: e.target.checked})} className="w-5 h-5 mt-0.5 accent-blue-600 cursor-pointer" /><span><span className="font-semibold text-gray-700 block">Auto-spread workspace to fill each page</span><span className="text-xs text-gray-500">Leftover space on a page is shared evenly by its questions. Drag a question's handle to set its space yourself; double-click the handle to undo.</span></span></label>
                  <label className="flex items-start space-x-3 cursor-pointer p-2 hover:bg-gray-50 rounded"><input type="checkbox" checked={settings.nameEveryPage !== false} onChange={e => setSettings({...settings, nameEveryPage: e.target.checked})} className="w-5 h-5 mt-0.5 accent-blue-600 cursor-pointer" /><span><span className="font-semibold text-gray-700 block">Name and period on every page</span><span className="text-xs text-gray-500">Adds a Name / Period line to the top of pages 2 and on, so loose pages can be matched to a student.</span></span></label>
                  <label className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-gray-50 rounded"><input type="checkbox" checked={settings.hideStandardsOnStudent} onChange={e => setSettings({...settings, hideStandardsOnStudent: e.target.checked})} className="w-5 h-5 accent-blue-600 cursor-pointer" /><span className="font-semibold text-gray-700">Hide Standard Codes on Student Tests</span></label>
                  <label className={`flex items-center space-x-3 cursor-pointer p-2 hover:bg-gray-50 rounded ${isNotes ? 'hidden' : ''}`}><input type="checkbox" checked={settings.showFormLabels} onChange={e => setSettings({...settings, showFormLabels: e.target.checked})} className="w-5 h-5 accent-blue-600 cursor-pointer" /><span className="font-semibold text-gray-700">Show Form Labels (A, B, etc.) on Tests & Keys</span></label>
                  <h4 className="font-bold text-sm text-gray-500 uppercase tracking-wider mt-4">Answer Key Visibility</h4>
                  <label className={`flex items-center space-x-3 cursor-pointer p-1.5 hover:bg-gray-50 rounded ${isNotes ? 'hidden' : ''}`}><input type="checkbox" checked={settings.keyShowQuestion} onChange={e => setSettings({...settings, keyShowQuestion: e.target.checked})} className="w-4 h-4 accent-blue-600 cursor-pointer" /><span className="text-gray-700 text-sm">Show Original Questions & Diagrams</span></label>
                  <label className="flex items-center space-x-3 cursor-pointer p-1.5 hover:bg-gray-50 rounded"><input type="checkbox" checked={settings.keyShowWork} onChange={e => setSettings({...settings, keyShowWork: e.target.checked})} className="w-4 h-4 accent-blue-600 cursor-pointer" /><span className="text-gray-700 text-sm">Show Worked Out Solutions</span></label>
                  <label className="flex items-center space-x-3 cursor-pointer p-1.5 hover:bg-gray-50 rounded"><input type="checkbox" checked={settings.keyShowAnswer} onChange={e => setSettings({...settings, keyShowAnswer: e.target.checked})} className="w-4 h-4 accent-blue-600 cursor-pointer" /><span className="text-gray-700 text-sm">Show Final Answers</span></label>
                  <label className="flex items-center space-x-3 cursor-pointer p-1.5 hover:bg-gray-50 rounded"><input type="checkbox" checked={settings.keyShowGrading} onChange={e => setSettings({...settings, keyShowGrading: e.target.checked})} className="w-4 h-4 accent-blue-600 cursor-pointer" /><span className="text-gray-700 text-sm">Show Grading Considerations / Rubric Tips</span></label>
                </div>
              </div>
              <div className="space-y-4 mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-bold text-red-800 bg-red-50 px-3 py-1 rounded">Danger Zone</h3>
                <button onClick={() => { if(window.confirm('Are you sure you want to reset all application data?')){ try { Object.keys(localStorage).filter(k => k.startsWith(`${localStoragePrefix}_`)).forEach(k => localStorage.removeItem(k)); } catch (e) {} window.location.reload(); } }} className="bg-red-100 text-red-700 hover:bg-red-200 font-bold py-2 px-4 rounded transition-colors">Reset Application Data</button>
              </div>
            </div>
          )}

          {activeTab === 'student' && activeFilteredForm && (
            <div className="flex flex-col gap-8 w-full items-center">
{!embedded && <div className="bg-blue-50 text-blue-800 px-4 py-3 rounded-md border border-blue-200 shadow-sm text-sm flex items-center gap-2 w-[8.5in] max-w-[8.5in]"><Edit3 className="w-4 h-4 shrink-0" /><span><strong>Interactive Mode:</strong> Click dashed text to edit values. <strong>Click a diagram</strong> to open its toolbar. <strong>Drag the blue bar</strong> below questions to adjust spacing.</span></div>}
              <StudentTestView formObj={activeFilteredForm} params={params} updateParam={updateParam} hideStandards={settings.hideStandardsOnStudent} updateFormTitle={updateFormTitle} updateCourseTitle={updateCourseTitle} updateSectionTitle={updateSectionTitle} toggleSectionPageBreak={toggleSectionPageBreak} toggleItemPageBreak={toggleItemPageBreak} rubricMode={settings.rubricMode} customRubricHTML={settings.customRubricHTML} questionFontSize={settings.questionFontSize} hiddenQuestions={hiddenQuestions} setHiddenQuestions={setHiddenQuestions} showFormLabels={settings.showFormLabels} settings={settings} setSettings={setSettings} templates={templates} />
            </div>
          )}
          {activeTab === 'student' && !activeFilteredForm && <div className="p-8 text-center text-gray-500 italic bg-white rounded shadow w-[8.5in] mx-auto">No active questions. Check Standards filter.</div>}
          {activeTab === 'key' && activeFilteredForm && <AnswerKeyView formObj={activeFilteredForm} params={params} updateParam={updateParam} settings={settings} toggleSectionPageBreak={toggleSectionPageBreak} hiddenQuestions={hiddenQuestions} setHiddenQuestions={setHiddenQuestions} templates={templates} />}
        </main>
      </div>
      )}

      <div className="mte-print-root text-black">
        {settings.printSpecs && (
          <div className="p-10 w-[8.5in] h-[10.2in] mx-auto print-page-break box-border">
            <div className="border-b-4 border-gray-800 pb-4 mb-8">
              <h1 className="text-4xl font-extrabold uppercase">Assessment Specs</h1>
              <p className="text-2xl mt-2 font-bold">{forms && forms[0] ? forms[0].title : 'Assessment'}</p>
              <p className="text-lg text-gray-600">{forms && forms[0] ? forms[0].course : 'Course'}</p>
            </div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4">Assessed Benchmarks & Coverage</h2>
              <div className="border-2 border-gray-800 rounded-md overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-gray-100 border-b-2 border-gray-800">
                    <tr><th className="p-3 font-bold w-1/4">Standard</th><th className="p-3 font-bold">Topic Description</th><th className="p-3 font-bold text-center">Questions</th></tr>
                  </thead>
                  <tbody className="divide-y divide-gray-300">
                    {Object.entries(getStandardsSummary()).map(([std, qArray]) => (
                      <tr key={std}><td className="p-4 font-bold">{std}</td><td className="p-4 text-sm">{standards[std] || ""}</td><td className="p-4 text-xs font-mono text-center font-bold text-blue-800">{qArray.join(', ')}</td></tr>
                    ))}
                    {Object.keys(getStandardsSummary()).length === 0 && <tr><td colSpan="3" className="p-4 text-center italic text-gray-500">No forms selected or standards filtered out.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        {settings.printForms && filteredFormsToPrint.map((form) => <StudentTestView key={`print-test-${form.id}`} formObj={form} params={params} updateParam={updateParam} hideStandards={settings.hideStandardsOnStudent} updateFormTitle={updateFormTitle} updateCourseTitle={updateCourseTitle} updateSectionTitle={updateSectionTitle} toggleSectionPageBreak={toggleSectionPageBreak} rubricMode={settings.rubricMode} customRubricHTML={settings.customRubricHTML} isPrint={true} questionFontSize={settings.questionFontSize} hiddenQuestions={hiddenQuestions} showFormLabels={settings.showFormLabels} settings={settings} setSettings={setSettings} templates={templates} />)}
        {settings.printKeys && filteredFormsToPrint.map((form) => <AnswerKeyView key={`print-key-${form.id}`} formObj={form} params={params} updateParam={updateParam} settings={settings} toggleSectionPageBreak={toggleSectionPageBreak} isPrint={true} hiddenQuestions={hiddenQuestions} templates={templates} />)}
      </div>
    </div>
  );
}

window.MathTestEngine = {
  init: function(targetId, config) {
    const root = ReactDOM.createRoot(document.getElementById(targetId));
    root.render(<DocContext.Provider value={{ notes: config.kind === 'notes' || config.kind === 'homework', homework: config.kind === 'homework', key: false }}><App config={config} /></DocContext.Provider>);
  }
};