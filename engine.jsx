// math-test-engine v1.2.0
// Served from https://cdn.jsdelivr.net/gh/andyschwencodes-boop/math-test-engine@v1.2.0/engine.jsx
const { useState, useEffect, useRef } = React;

// --- PRINT CSS ---
// Print pages are 8.5in x 10.2in; 0.4in top/bottom @page margins fit exactly one per Letter sheet.
// The id guard keeps the print-window clone (which copies <head>) from getting a second copy.
if (!document.getElementById('mte-print-css')) {
  const printCss = document.createElement('style');
  printCss.id = 'mte-print-css';
  printCss.textContent = `
    @page { size: letter; margin: 0.4in 0; }
    .mte-hide-answer-lines .mte-answer-line { border-bottom-color: transparent !important; }
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
window.Part = ({ s, u, part, parts, label = true, className = '', children }) => (
  <div className={`relative group/part flex items-baseline ${className}`}>
    {(u && parts && parts.length > 1) && (
      <button onClick={() => u('hidden_parts', [...((s && s.hidden_parts) || []), part.id])} className="absolute -top-5 right-0 z-30 opacity-0 pointer-events-none group-hover/part:opacity-100 group-hover/part:pointer-events-auto transition-opacity px-1.5 py-0.5 text-[10px] font-bold text-gray-500 bg-white hover:text-red-600 hover:bg-red-50 rounded border border-gray-200 hover:border-red-200 print:hidden" title="Hide this part on every form. The remaining parts are re-lettered and the answer key updates.">Hide part {part.letter}</button>
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
  const html = window.katex.renderToString(safeTex, { throwOnError: false, strict: false, trust: true, displayMode: false });
  return (
    <span className="relative inline-block whitespace-nowrap align-middle group" ref={containerRef}>
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
        <th className={`border border-black p-1 w-1/${cols} leading-tight`}><span className="font-bold text-[10pt] mr-1"><window.SettingsEditableText field="hN" settings={settings} setSettings={setSettings}/></span><window.SettingsEditableText field="hNDesc" settings={settings} setSettings={setSettings}/></th>
        <th className={`border border-black p-1 w-1/${cols} leading-tight`}><span className="font-bold text-[10pt] mr-1"><window.SettingsEditableText field="hC" settings={settings} setSettings={setSettings}/></span><window.SettingsEditableText field="hCDesc" settings={settings} setSettings={setSettings}/></th>
        {cols === 5 && <th className="border border-black p-1 w-1/5 leading-tight"><span className="font-bold text-[10pt] mr-1"><window.SettingsEditableText field="hB" settings={settings} setSettings={setSettings}/></span><window.SettingsEditableText field="hBDesc" settings={settings} setSettings={setSettings}/></th>}
        <th className={`border border-black p-1 w-1/${cols} leading-tight`}><span className="font-bold text-[10pt] mr-1"><window.SettingsEditableText field="hAm" settings={settings} setSettings={setSettings}/></span><window.SettingsEditableText field="hAmDesc" settings={settings} setSettings={setSettings}/></th>
        <th className={`border border-black p-1 w-1/${cols} leading-tight`}><span className="font-bold text-[10pt] mr-1"><window.SettingsEditableText field="hA" settings={settings} setSettings={setSettings}/></span><window.SettingsEditableText field="hADesc" settings={settings} setSettings={setSettings}/></th>
      </tr>
    </thead>
  );
  if (mode === '5-point' && isFirstSection) return ( <table className="w-full text-[9pt] text-left border-collapse border border-black mb-4 bg-white table"> {renderHeaders(5)} <tbody> <tr className="align-top"> <td className="border border-black p-1"><window.SettingsEditableText field="c51" settings={settings} setSettings={setSettings}/></td> <td className="border border-black p-1"><window.SettingsEditableText field="c52" settings={settings} setSettings={setSettings}/></td> <td className="border border-black p-1"><window.SettingsEditableText field="c53" settings={settings} setSettings={setSettings}/></td> <td className="border border-black p-1"><window.SettingsEditableText field="c54" settings={settings} setSettings={setSettings}/></td> <td className="border border-black p-1"><window.SettingsEditableText field="c55" settings={settings} setSettings={setSettings}/></td> </tr> </tbody> </table> );
  if (mode === '4-point' && isFirstSection) return ( <table className="w-full text-[9pt] text-left border-collapse border border-black mb-4 bg-white table"> {renderHeaders(4)} <tbody> <tr className="align-top"> <td className="border border-black p-1"><window.SettingsEditableText field="c41" settings={settings} setSettings={setSettings}/></td> <td className="border border-black p-1"><window.SettingsEditableText field="c42" settings={settings} setSettings={setSettings}/></td> <td className="border border-black p-1"><window.SettingsEditableText field="c43" settings={settings} setSettings={setSettings}/></td> <td className="border border-black p-1"><window.SettingsEditableText field="c44" settings={settings} setSettings={setSettings}/></td> </tr> </tbody> </table> );
  if (!isFirstSection && (mode === '5-point' || mode === '4-point')) { const cols = mode === '5-point' ? 5 : 4; return ( <table className="w-full text-[9pt] text-center border-collapse border border-black mb-4 bg-white table"> <thead className="bg-gray-200"> <tr> <th className={`border border-black p-1 w-1/${cols} font-bold`}><window.SettingsEditableText field="sN" settings={settings} setSettings={setSettings}/></th> <th className={`border border-black p-1 w-1/${cols} font-bold`}><window.SettingsEditableText field="sC" settings={settings} setSettings={setSettings}/></th> {cols === 5 && <th className="border border-black p-1 w-1/5 font-bold"><window.SettingsEditableText field="sB" settings={settings} setSettings={setSettings}/></th>} <th className={`border border-black p-1 w-1/${cols} font-bold`}><window.SettingsEditableText field="sAm" settings={settings} setSettings={setSettings}/></th> <th className={`border border-black p-1 w-1/${cols} font-bold`}><window.SettingsEditableText field="sA" settings={settings} setSettings={setSettings}/></th> </tr> </thead> </table> ); }
  return null;
};

// Content area is 9.4in tall both on screen (11in sheet, 0.8in top/bottom padding) and in print
// (10.2in page inside 0.4in @page margins, 0.4in padding), so what fits in the preview fits on paper.
const PAGE_DPI = 96;
const PageFrame = ({ isPrint, children }) => {
  const bodyRef = useRef(null);
  const [overflowIn, setOverflowIn] = useState(0);
  useEffect(() => { // screen only: warn when content is taller than the printable area
    if (isPrint || !bodyRef.current) return;
    const el = bodyRef.current;
    const over = Math.round(((el.scrollHeight - el.clientHeight) / PAGE_DPI) * 100) / 100;
    const next = over > 0.02 ? over : 0;
    if (next !== overflowIn) setOverflowIn(next);
  });
  return (
    <div style={{ width: '8.5in', height: isPrint ? '10.2in' : '11in', padding: isPrint ? '0.4in' : '0.8in 0.4in' }} className={`bg-white mx-auto box-border flex flex-col relative ${isPrint ? 'print-page-break overflow-hidden' : `shadow-2xl border mb-12 overflow-visible ${overflowIn ? 'border-red-500 ring-4 ring-red-200' : 'border-gray-300'}`}`}>
      {(!isPrint && overflowIn > 0) && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[70] bg-red-600 text-white text-xs font-bold px-3 py-1 rounded shadow whitespace-nowrap print:hidden">
          Page is {overflowIn.toFixed(2)}in too tall and will be cut off when printed. Shrink a workspace or start a new page.
        </div>
      )}
      <div ref={bodyRef} className="flex flex-col flex-1 min-h-0">{children}</div>
    </div>
  );
};

// Workspace below a question. Auto: at least the template's `space`, plus an equal share of the page's
// leftover height (when Auto-spread is on). Dragging pins an exact height (customSpace, may be 0);
// double-clicking the handle returns to auto.
const Workspace = ({ itemState, renderer, update, isPrint, autoFill }) => {
  const ref = useRef(null);
  const minIn = (renderer.space || 0) * 0.5;
  const pinned = itemState?.customSpace !== undefined && itemState?.customSpace !== null;
  const style = pinned ? { height: `${itemState.customSpace}in`, flex: '0 0 auto' }
    : { minHeight: `${minIn}in`, flex: autoFill ? '1 0 auto' : '0 0 auto' };
  return (
    <div ref={ref} className="relative w-full border-b border-transparent hover:border-blue-200 transition-colors" style={style}>
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

const StudentTestView = ({ formObj, params, updateParam, hideStandards, updateFormTitle, updateCourseTitle, updateSectionTitle, toggleSectionPageBreak, toggleItemPageBreak, rubricMode, customRubricHTML, isPrint=false, questionFontSize="text-[12pt]", hiddenQuestions=[], setHiddenQuestions, showFormLabels=true, settings, setSettings, templates }) => {
  const autoFill = settings?.autoFillSpace !== false;
  const isHiddenItem = (item) => hiddenQuestions.includes(`${item.id}-${item.t}`);
  const qNumMap = {}; let counter = 1; let globalFirstVisibleId = null;
  formObj.sections.forEach(sec => { sec.items.forEach(item => { const uniqueId = `${item.id}-${item.t}`; if (!hiddenQuestions.includes(uniqueId)) { qNumMap[uniqueId] = counter++; if (!globalFirstVisibleId) globalFirstVisibleId = uniqueId; } }); });

  // Pages are lists of chunks { section, sIndex, items }. A page starts before a section with pageBreak,
  // or before any later question in a section whose item has pageBreak.
  const pages = []; let page = [];
  formObj.sections.forEach((section, sIndex) => {
    const visible = section.items.filter(item => !isHiddenItem(item));
    if (!visible.length) return;
    let chunk = null;
    visible.forEach((item, vIndex) => {
      const breakHere = vIndex === 0 ? section.pageBreak : item.pageBreak;
      if (breakHere && (page.length > 0 || chunk)) { if (chunk) page.push(chunk); pages.push(page); page = []; chunk = null; }
      if (!chunk) chunk = { section, sIndex, items: [] };
      chunk.items.push(item);
    });
    page.push(chunk);
  });
  if (page.length > 0) pages.push(page);
  const isPinned = (item) => params[item.id]?.customSpace !== undefined && params[item.id]?.customSpace !== null;

  return (
    <div className="flex flex-col gap-8 print:gap-0 print:block items-center w-full">
      {pages.map((pageChunks, pIndex) => (
         <PageFrame key={pIndex} isPrint={isPrint}>
                {pageChunks.map(({section, sIndex, items}) => {
                    let sectionStandard = null;
                    const allStandards = section.items.map(item => templates[item.t].standard);
                    if (allStandards.length > 0 && allStandards.every(v => v === allStandards[0])) sectionStandard = allStandards[0];
                    const firstVisibleIndex = section.items.findIndex(item => !isHiddenItem(item));
                    const shares = autoFill ? items.filter(item => !isPinned(item)).length : 0;
                    return (
                      <div key={`${section.id}-${items[0].id}`} className="w-full flex flex-col mb-2" style={{ flex: `${shares} 0 auto` }}>
                          {items.map((itemDef, cIndex) => {
                            const iIndex = section.items.indexOf(itemDef);
                            const uniqueId = `${itemDef.id}-${itemDef.t}`;
                            const qNum = qNumMap[uniqueId]; const isFirst = (iIndex === firstVisibleIndex); const isLast = (cIndex === items.length - 1);
                            const renderer = templates[itemDef.t]; const itemState = params[itemDef.id];
                            const update = isPrint ? null : (field, val) => updateParam(itemDef.id, field, val);
                            const itemStd = renderer.standard; const isAbsoluteFirst = (uniqueId === globalFirstVisibleId);
                            const grows = autoFill && !isPinned(itemDef);
                            return (
                              <div key={uniqueId} className={`group/q relative flex flex-col focus-within:z-50 hover:z-[60] print-avoid-break ${isLast ? 'mb-0' : 'mb-4'}`} style={{ flex: `${grows ? 1 : 0} 0 auto` }}>
                                {isAbsoluteFirst && (
                                  <div className="flex flex-col sm:flex-row justify-between items-end border-b-2 border-gray-800 pb-2 mb-6 shrink-0 w-full">
                                    <div className="flex-1 w-full">
                                      {showFormLabels && <div className="inline-block bg-gray-200 text-gray-700 font-bold px-3 py-0.5 rounded-sm text-xs tracking-widest mb-2 uppercase">{formObj.id}</div>}
                                      <h1 className="text-2xl font-extrabold text-gray-900 uppercase tracking-wide"><window.GlobalEditableText val={formObj.title} onChange={(val) => !isPrint && updateFormTitle(val)} /></h1>
                                      <p className="text-gray-600 font-medium mt-1 text-base"><window.GlobalEditableText val={formObj.course} onChange={(val) => !isPrint && updateCourseTitle(val)} /></p>
                                    </div>
                                    <div className="flex flex-col gap-2 w-full sm:w-56 shrink-0 mt-4 sm:mt-0">
                                      <div className="flex items-end"><span className="font-bold text-gray-800 mr-2 text-sm"><window.LocalEditableText defaultText="Name:"/></span><div className="flex-1 border-b border-gray-800"></div></div>
                                      <div className="flex items-end"><span className="font-bold text-gray-800 mr-2 text-sm"><window.LocalEditableText defaultText="Date:"/></span><div className="flex-1 border-b border-gray-800"></div></div>
                                    </div>
                                  </div>
                                )}
                                {isFirst && (
                                  <div className="mb-4 shrink-0 w-full">
                                    <div className="mb-2 pb-1 border-b-2 border-gray-800 flex justify-between items-end mt-4">
                                       <div className="flex items-center gap-3">
                                         <h2 className="text-xl font-bold uppercase tracking-wide text-gray-800"><window.GlobalEditableText val={section.title} onChange={(val) => !isPrint && updateSectionTitle(section.id, val)} /></h2>
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
                                  <div className="flex-1 w-full flex flex-col relative">
                                    {/* Editor buttons float above the question so they never change how it wraps (screen matches print). */}
                                    {!isPrint && (
                                      <div className="absolute -top-5 left-0 z-30 flex gap-1 print:hidden pointer-events-none group-hover/q:pointer-events-auto">
                                        {!isPrint && setHiddenQuestions && (
                                          <button onClick={() => setHiddenQuestions(prev => [...prev, uniqueId])} className="opacity-0 group-hover/q:opacity-100 transition-opacity inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-bold text-gray-500 hover:text-red-600 hover:bg-red-50 rounded border border-transparent hover:border-red-200" title="Hide question from test"><EyeOff className="w-3 h-3" /> Hide</button>
                                        )}
                                        {!isPrint && !isFirst && toggleItemPageBreak && (
                                          <button onClick={() => toggleItemPageBreak(itemDef.id)} className={`${itemDef.pageBreak ? 'opacity-100 bg-blue-100 text-blue-700 border-blue-300' : 'opacity-0 group-hover/q:opacity-100 text-gray-500 border-transparent hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200'} transition-opacity inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-bold rounded border`} title="Start a new page before this question (all forms)">📄 {itemDef.pageBreak ? 'New page ON' : 'New page'}</button>
                                        )}
                                        {(!isPrint && itemState?.hidden_parts?.length > 0) && (
                                          <button onClick={() => update('hidden_parts', [])} className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-bold rounded border bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100" title="Show all parts of this question again (all forms)"><Eye className="w-3 h-3" /> Restore {itemState.hidden_parts.length} hidden part{itemState.hidden_parts.length > 1 ? 's' : ''}</button>
                                        )}
                                        {(!isPrint && itemState?.hide_svg) && (
                                          <button onClick={() => update('hide_svg', false)} className="opacity-0 group-hover/q:opacity-100 transition-opacity inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-bold text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded border border-transparent hover:border-blue-200" title="Restore Image"><Eye className="w-3 h-3" /> Restore Image</button>
                                        )}
                                      </div>
                                    )}
                                    {(!hideStandards && !sectionStandard) && (
                                      <div className="flex justify-end w-full mb-1">
                                        <span className="text-xs font-bold text-gray-400 font-mono">[{itemStd}]</span>
                                      </div>
                                    )}
                                    <div className={`text-gray-900 leading-[1.5] shrink-0 ${questionFontSize}`}>
                                      <div className="flex flex-wrap items-baseline gap-x-2 w-full">
                                         <span className="font-bold text-gray-900 self-start mt-1 mr-1 shrink-0">{qNum}.</span>
                                         <div className="inline flex-1 min-w-[200px]">
                                           {renderer.q(itemState, update)}
                                         </div>
                                      </div>
                                    </div>
                                    <Workspace itemState={itemState} renderer={renderer} update={update} isPrint={isPrint} autoFill={autoFill} />
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
                    )
                })}
         </PageFrame>
      ))}
    </div>
  );
};

const AnswerKeyView = ({ formObj, params, updateParam, settings, toggleSectionPageBreak, isPrint=false, hiddenQuestions=[], setHiddenQuestions, templates }) => {
  const qNumMap = {}; let counter = 1;
  formObj.sections.forEach(sec => { sec.items.forEach(item => { const uniqueId = `${item.id}-${item.t}`; if (!hiddenQuestions.includes(uniqueId)) { qNumMap[uniqueId] = counter++; } }); });
  const pages = [[]];
  formObj.sections.forEach((section, sIndex) => {
    const hasVisibleItems = section.items.some(item => !hiddenQuestions.includes(`${item.id}-${item.t}`));
    if (!hasVisibleItems && isPrint) return;
    pages[0].push({ section, sIndex });
  });

  return (
    <div className={`flex flex-col gap-8 print:gap-0 print:block items-center w-full ${isPrint ? 'print-page-break' : ''}`}>
      {pages.map((pageSections, pIndex) => (
         <div key={pIndex} style={{ width: '8.5in', padding: '0.4in' }} className={`bg-red-50/20 mx-auto box-border flex flex-col relative ${isPrint ? 'print:min-h-0' : 'shadow-2xl border border-red-200 mb-8 min-h-[11in]'} overflow-hidden`}>
            <div className="border-b-4 border-red-800 pb-4 mb-8 shrink-0 print-avoid-break">
              <div className="flex justify-center items-center gap-3">
                 <h1 className="text-3xl font-extrabold text-red-800 uppercase tracking-wide text-center">Teacher Answer Key</h1>
                 {settings.showFormLabels && <span className="bg-red-100 text-red-800 font-bold px-3 py-1 rounded-full text-lg tracking-widest">{formObj.id}</span>}
              </div>
              <p className="text-center font-bold text-red-700 mt-2 text-xl"><span dangerouslySetInnerHTML={{ __html: formObj.title }} /></p>
            </div>
            <div className="space-y-0 flex flex-col">
              {pageSections.map(({section, sIndex}) => {
                 const firstVisibleIndex = section.items.findIndex(item => !hiddenQuestions.includes(`${item.id}-${item.t}`));
                 return (
                    <div key={section.id} className="w-full mt-4 flex flex-col">
                        {section.items.map((itemDef, iIndex) => {
                          const uniqueId = `${itemDef.id}-${itemDef.t}`; const isHidden = hiddenQuestions.includes(uniqueId);
                          if (isPrint && isHidden) return null;
                          const qNum = isHidden ? '-' : qNumMap[uniqueId]; const isFirst = (iIndex === firstVisibleIndex); const isLast = (iIndex === section.items.length - 1);
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
                                      <div className={`leading-[1.5] text-gray-500 flex flex-wrap items-baseline gap-x-2 ${settings.questionFontSize}`}>
                                        <span className="font-bold shrink-0">{qNum}.</span>
                                        <div className="inline flex-1 min-w-[200px]">{renderer.q(itemState, update)}</div>
                                      </div>
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
                                     {!settings.keyShowQuestion && <span className="font-bold text-red-800 absolute -ml-6">{qNum}.</span>}
                                     {settings.keyShowWork && renderer.work && <div className={`text-red-800 leading-[1.6] text-[11pt] mb-3 overflow-x-auto`}>{renderer.work(itemState)}</div>}
                                     {settings.keyShowAnswer && renderer.answer && <div className="font-bold text-red-700 leading-[1.6] text-[14pt] mb-2 overflow-x-auto">{renderer.answer(itemState)}</div>}
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
  const localStoragePrefix = `mtg_${topicId}`;

  const [activeTab, setActiveTab] = useState('student');
  const [activeFormId, setActiveFormId] = useState(() => localStorage.getItem(`${localStoragePrefix}_activeFormId`) || 'Form A');
  
  // Bulletproof Local Storage Initializers
  const [forms, setForms] = useState(() => { 
      try { const saved = localStorage.getItem(`${localStoragePrefix}_forms`); return saved ? JSON.parse(saved) : defaultForms; } 
      catch(e) { return defaultForms; } 
  });
  const [params, setParams] = useState(() => { 
      try { const saved = localStorage.getItem(`${localStoragePrefix}_params`); return saved ? JSON.parse(saved) : { ...paramsGenerator('A'), ...paramsGenerator('B') }; } 
      catch(e) { return { ...paramsGenerator('A'), ...paramsGenerator('B') }; } 
  });
  const [hiddenQuestions, setHiddenQuestions] = useState(() => { 
      try { const saved = localStorage.getItem(`${localStoragePrefix}_hiddenQuestions`); return saved ? JSON.parse(saved) : []; } 
      catch(e) { return []; } 
  });
  const [disabledStandards, setDisabledStandards] = useState(() => { 
      try { const saved = localStorage.getItem(`${localStoragePrefix}_disabledStandards`); return saved ? JSON.parse(saved) : []; } 
      catch(e) { return []; } 
  });
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [selectedFormsToPrint, setSelectedFormsToPrint] = useState(['Form A', 'Form B']);

  const defaultSettings = {
    printSpecs: true, printForms: true, printKeys: true, hideStandardsOnStudent: false, showFormLabels: true, keyShowAnswer: true, keyShowWork: true, keyShowQuestion: true, keyShowGrading: true, rubricMode: '5-point', autoFillSpace: true, showAnswerLines: true,
    customRubricHTML: '<div style="padding: 10px; border: 2px dashed #ccc; text-align: center;">\n  <em>[Insert Custom Rubric HTML Here]</em>\n</div>', questionFontSize: 'text-[11pt]',
    rubricData: {
      hN: "N:", hNDesc: "Not demonstrated", hC: "C:", hCDesc: "Developing", hB: "B:", hBDesc: "Approaching", hAm: "A−:", hAmDesc: "Proficient", hA: "A:", hADesc: "Mastery",
      c51: "Answer is not correct. Work is absent or shows no concepts learned.", c52: "Answer is correct. Work is absent, uses guess & check. OR major math errors.", c53: "Answer is correct & shows partial ideas. OR Answer is incorrect due to minor error in work.", c54: "Answer is correct. Work shows ideas learned. May contain minor errors but shows strong understanding.", c55: "Answer is correct. Work shows ideas learned. May contain a minor error but shows strong understanding.",
      c41: "No evidence of understanding.", c42: "Partial understanding with significant errors.", c43: "Solid understanding with minor errors.", c44: "Complete understanding and flawless execution.",
      sN: "N", sC: "C", sB: "B", sAm: "A−", sA: "A"
    }
  };
  const [settings, setSettings] = useState(() => { 
      try { const saved = localStorage.getItem(`${localStoragePrefix}_settings`); return saved ? { ...defaultSettings, ...JSON.parse(saved), showFormLabels: JSON.parse(saved).showFormLabels !== undefined ? JSON.parse(saved).showFormLabels : true } : defaultSettings; } 
      catch(e) { return defaultSettings; } 
  });

  useEffect(() => { localStorage.setItem(`${localStoragePrefix}_forms`, JSON.stringify(forms)); }, [forms]);
  useEffect(() => { localStorage.setItem(`${localStoragePrefix}_params`, JSON.stringify(params)); }, [params]);
  useEffect(() => { localStorage.setItem(`${localStoragePrefix}_hiddenQuestions`, JSON.stringify(hiddenQuestions)); }, [hiddenQuestions]);
  useEffect(() => { localStorage.setItem(`${localStoragePrefix}_disabledStandards`, JSON.stringify(disabledStandards)); }, [disabledStandards]);
  useEffect(() => { localStorage.setItem(`${localStoragePrefix}_settings`, JSON.stringify(settings)); }, [settings]);
  useEffect(() => { localStorage.setItem(`${localStoragePrefix}_activeFormId`, activeFormId); }, [activeFormId]);

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
      if (field === 'hidden_parts' || field.endsWith('_dx') || field.endsWith('_dy') || field.endsWith('_scale') || field.endsWith('_rotYaw') || field.endsWith('_rotPitch') || field.endsWith('_dock')) {
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
      <div className="print:hidden">
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50 mb-8">
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
              <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-md border border-gray-200">
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
        </header>

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
                  <div className="p-3 border border-gray-200 rounded-md bg-gray-50">
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
                  <label className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-gray-50 rounded"><input type="checkbox" checked={settings.printSpecs} onChange={e => setSettings({...settings, printSpecs: e.target.checked})} className="w-5 h-5 accent-blue-600 cursor-pointer" /><span className="font-semibold text-gray-700">Standards Summary Page</span></label>
                  <label className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-gray-50 rounded"><input type="checkbox" checked={settings.printForms} onChange={e => setSettings({...settings, printForms: e.target.checked})} className="w-5 h-5 accent-blue-600 cursor-pointer" /><span className="font-semibold text-gray-700">Print Student Test Copies</span></label>
                  <label className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-gray-50 rounded"><input type="checkbox" checked={settings.printKeys} onChange={e => setSettings({...settings, printKeys: e.target.checked})} className="w-5 h-5 accent-blue-600 cursor-pointer" /><span className="font-semibold text-gray-700">Print Teacher Answer Keys</span></label>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-blue-800 bg-blue-50 px-3 py-1 rounded">2. Customize Content</h3>
                  <div className="p-3 border border-gray-200 rounded-md bg-gray-50 space-y-3">
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
                  <label className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-gray-50 rounded"><input type="checkbox" checked={settings.hideStandardsOnStudent} onChange={e => setSettings({...settings, hideStandardsOnStudent: e.target.checked})} className="w-5 h-5 accent-blue-600 cursor-pointer" /><span className="font-semibold text-gray-700">Hide Standard Codes on Student Tests</span></label>
                  <label className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-gray-50 rounded"><input type="checkbox" checked={settings.showFormLabels} onChange={e => setSettings({...settings, showFormLabels: e.target.checked})} className="w-5 h-5 accent-blue-600 cursor-pointer" /><span className="font-semibold text-gray-700">Show Form Labels (A, B, etc.) on Tests & Keys</span></label>
                  <h4 className="font-bold text-sm text-gray-500 uppercase tracking-wider mt-4">Answer Key Visibility</h4>
                  <label className="flex items-center space-x-3 cursor-pointer p-1.5 hover:bg-gray-50 rounded"><input type="checkbox" checked={settings.keyShowQuestion} onChange={e => setSettings({...settings, keyShowQuestion: e.target.checked})} className="w-4 h-4 accent-blue-600 cursor-pointer" /><span className="text-gray-700 text-sm">Show Original Questions & Diagrams</span></label>
                  <label className="flex items-center space-x-3 cursor-pointer p-1.5 hover:bg-gray-50 rounded"><input type="checkbox" checked={settings.keyShowWork} onChange={e => setSettings({...settings, keyShowWork: e.target.checked})} className="w-4 h-4 accent-blue-600 cursor-pointer" /><span className="text-gray-700 text-sm">Show Worked Out Solutions</span></label>
                  <label className="flex items-center space-x-3 cursor-pointer p-1.5 hover:bg-gray-50 rounded"><input type="checkbox" checked={settings.keyShowAnswer} onChange={e => setSettings({...settings, keyShowAnswer: e.target.checked})} className="w-4 h-4 accent-blue-600 cursor-pointer" /><span className="text-gray-700 text-sm">Show Final Answers</span></label>
                  <label className="flex items-center space-x-3 cursor-pointer p-1.5 hover:bg-gray-50 rounded"><input type="checkbox" checked={settings.keyShowGrading} onChange={e => setSettings({...settings, keyShowGrading: e.target.checked})} className="w-4 h-4 accent-blue-600 cursor-pointer" /><span className="text-gray-700 text-sm">Show Grading Considerations / Rubric Tips</span></label>
                </div>
              </div>
              <div className="space-y-4 mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-bold text-red-800 bg-red-50 px-3 py-1 rounded">Danger Zone</h3>
                <button onClick={() => { if(window.confirm('Are you sure you want to reset all application data?')){ localStorage.clear(); window.location.reload(); } }} className="bg-red-100 text-red-700 hover:bg-red-200 font-bold py-2 px-4 rounded transition-colors">Reset Application Data</button>
              </div>
            </div>
          )}

          {activeTab === 'student' && activeFilteredForm && (
            <div className="flex flex-col gap-8 w-full items-center">
              <div className="bg-blue-50 text-blue-800 px-4 py-3 rounded-md border border-blue-200 shadow-sm text-sm flex items-center gap-2 w-[8.5in] max-w-[8.5in]"><Edit3 className="w-4 h-4 shrink-0" /><span><strong>Interactive Mode:</strong> Click dashed text to edit values. <strong>Click a diagram</strong> to open its toolbar. <strong>Drag the blue bar</strong> below questions to adjust spacing.</span></div>
              <StudentTestView formObj={activeFilteredForm} params={params} updateParam={updateParam} hideStandards={settings.hideStandardsOnStudent} updateFormTitle={updateFormTitle} updateCourseTitle={updateCourseTitle} updateSectionTitle={updateSectionTitle} toggleSectionPageBreak={toggleSectionPageBreak} toggleItemPageBreak={toggleItemPageBreak} rubricMode={settings.rubricMode} customRubricHTML={settings.customRubricHTML} questionFontSize={settings.questionFontSize} hiddenQuestions={hiddenQuestions} setHiddenQuestions={setHiddenQuestions} showFormLabels={settings.showFormLabels} settings={settings} setSettings={setSettings} templates={templates} />
            </div>
          )}
          {activeTab === 'student' && !activeFilteredForm && <div className="p-8 text-center text-gray-500 italic bg-white rounded shadow w-[8.5in] mx-auto">No active questions. Check Standards filter.</div>}
          {activeTab === 'key' && activeFilteredForm && <AnswerKeyView formObj={activeFilteredForm} params={params} updateParam={updateParam} settings={settings} toggleSectionPageBreak={toggleSectionPageBreak} hiddenQuestions={hiddenQuestions} setHiddenQuestions={setHiddenQuestions} templates={templates} />}
        </main>
      </div>

      <div className="hidden print:block text-black">
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
    root.render(<App config={config} />);
  }
};