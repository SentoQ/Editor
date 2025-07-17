// Helpers per a selectors ràpids
const $ = e => document.getElementById(e),
      qs = sel => document.querySelector(sel),
      qsa = sel => document.querySelectorAll(sel);

// Generadors de CSS per a borde i ombra
const border = (w, s, c) => `${w}px ${s} ${c}`;
const shadow = (x, y, b, s, c) => `${x}px ${y}px ${b}px ${s}px ${c}`;

// Elements principals
const cv = qs('#canvas'),
      lbl = $('lbl'),
      inp = $('inp'),
      css = $('css');

// Gestió de pestanyes (tabs)
qsa('.tabs button').forEach(b => 
  b.onclick = _ => {
    qsa('.tabs button').forEach(x => x.classList.remove('active'));
    qsa('.tab').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    qs('#' + b.dataset.t).classList.add('active');
  }
);

// Actualitza l'àrea de treball
function updArea() {
  cv.style.width = $('cw').value + 'px';
  cv.style.height = $('ch').value + 'px';
  cv.style.background = $('cbg').value;
}

// Actualitza l'estil del label
function updLbl() {
  lbl.textContent = $('ltxt').value;
  lbl.style.cssText = `
    position:absolute;
    left:${$('lx').value}px;
    top:${$('ly').value}px;
    width:${$('lw').value}px;
    color:${$('lcol').value};
    font-size:${$('lsz').value}px;
    font-weight:${$('lwt').value};
    background:${$('lbg').value};
    opacity:${$('lop').value};
    border:${border($('lbw').value, $('lbs').value, $('lbc').value)};
    box-shadow:${shadow($('lsx').value, $('lsy').value, $('lsb').value, $('lss').value, $('lsc').value)};
  `.replace(/\s+/g, ' ').trim();
}

// Actualitza l'estil de l'input
function updInp() {
  inp.style.cssText = `
    position:absolute;
    left:${$('ix').value}px;
    top:${$('iy').value}px;
    width:${$('iw').value}px;
    color:${$('icol').value};
    font-size:${$('isz').value}px;
    background:${$('ibg').value};
    opacity:${$('iop').value};
    padding:${$('ipad').value}px;
    border-radius:${$('irad').value}px;
    border:${border($('ibw').value, $('ibs').value, $('ibc').value)};
    box-shadow:${shadow($('isx').value, $('isy').value, $('isb').value, $('iss').value, $('isc').value)};
  `.replace(/\s+/g, ' ').trim();
}

// Mostra el CSS actual a la zona de codi
function showCSS() {
  css.textContent = 
    `/* label */\n${lbl.getAttribute('style')}\n\n` +
    `/* input */\n${inp.getAttribute('style')}`;
}

// Refresca tota la UI (area, label, input i css)
function refresh() {
  updArea();
  updLbl();
  updInp();
  showCSS();
}

// Vincula tots els inputs a la funció refresh
qsa('input,select').forEach(el => el.addEventListener('input', refresh));

// Inicialitza
refresh();

// Botó per copiar el CSS al portapapers
$('copy').onclick = async () => {
  await navigator.clipboard.writeText(css.textContent);
  alert('CSS copiat');
};

// Botó per descarregar l'HTML de l'àrea
$('dl').onclick = () => {
  const blob = new Blob([cv.innerHTML], {type: 'text/html'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'fragment.html';
  a.click();
  URL.revokeObjectURL(a.href);
};
