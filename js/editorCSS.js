/* =============================================================
   EDITOR CSS · LÒGICA DE CONFIGURACIÓ (versió Vicent + Menú)
   ============================================================= */

/* ---------- CONFIGURACIÓ PER DEFECTE ---------- */
const defaultConfig = {
  form: {
    width: 1024,
    height: 800,
    bg: "#ffffff",
    shadow: { x: 0, y: 0, blur: 40, spread: 0, color: "#1e1e3c", alpha: 40, inset: false }
  },
  header: {
    height: 40,
    bg: "#1976d2",
    zones: {
      left:   { text: "Atria-ERP: Formulario", font: "Arial", size: 12, bold: false, italic: false, color: "#ffffff", pos: 0 },
      center: { text: "HRC",                   font: "Arial", size: 18, bold: true,  italic: false, color: "#ffffff" },
      right:  { text: "User01",                font: "Arial", size: 12, bold: false, italic: false, color: "#ffffff", pos: 0 }
    }
  },
  /* ---------- MENÚ ---------- */
  menu: {
    general: { height: 36, bg: "#f8f9fa", font: "Arial", size: 12, fontColor: "#000000" },
    states: {
      activo: {
        border: "#dee2e6", radius: 4,
        fontColor: "#000000", bgColor: "transparent",
        shadow: { x: 0, y: 0, blur: 0, spread: 0, color: "#000000", alpha: 0, inset: false },
        bold: false, italic: false
      },
      seleccionado: {
        border: "#1976d2", radius: 4,
        fontColor: "#ffffff", bgColor: "#1976d2",
        shadow: { x: 0, y: 2, blur: 6, spread: 0, color: "#1976d2", alpha: 30, inset: false },
        bold: true, italic: false
      },
      inactivo: {
        border: "#cccccc", radius: 4,
        fontColor: "#888888", bgColor: "transparent",
        shadow: { x: 0, y: 0, blur: 0, spread: 0, color: "#000000", alpha: 0, inset: false },
        bold: false, italic: true
      }
    }
  }
};

let config = JSON.parse(JSON.stringify(defaultConfig));

/* ---------- HELPERS ---------- */
const $  = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const toggleBtn = (btn, cls = "active") => btn.classList.toggle(cls);

function hexToRgb(hex){
  hex = hex.replace("#", "");
  if(hex.length === 3) hex = hex.split("").map(c => c + c).join("");
  const n = parseInt(hex, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}
function buildShadowCss(sh){
  const {x,y,blur,spread,color,alpha,inset} = sh;
  const {r,g,b} = hexToRgb(color);
  return `${inset ? "inset " : ""}${x}px ${y}px ${blur}px ${spread}px rgba(${r},${g},${b},${alpha/100})`;
}

/* ---------- PANELLS ---------- */
const panels = {
  formulario:{ trigger:"#titulo-formulario", li:"#element-formulario", panel:"#config-formulario" },
  cabecera:  { trigger:"#titulo-cabecera",   li:"#element-cabecera",   panel:"#config-cabecera"   },
  menu:      { trigger:"#titulo-menu",       li:"#element-menu",       panel:"#config-menu"       }
};
let openKey = null;
function closePanels(){
  Object.values(panels).forEach(({li,panel})=>{
    $(panel)?.classList.add("is-hidden");
    $(li)?.classList.remove("selected");
  });
  openKey = null;
}
function initPanelTriggers(){
  Object.entries(panels).forEach(([k,{trigger,li,panel}])=>{
    $(trigger)?.addEventListener("click",e=>{
      e.stopPropagation();
      (openKey === k) ? closePanels()
                      : (closePanels(), $(panel).classList.remove("is-hidden"), $(li).classList.add("selected"), openKey = k);
    });
    $(panel)?.addEventListener("click", e => e.stopPropagation());
  });
  document.addEventListener("click", closePanels);
}

/* ---------- APLICAR CONFIG ---------- */
function aplicarConfig(vals = config){
  /* Form */
  $("#main-form").style.cssText = `
    width:${vals.form.width}px;
    height:${vals.form.height}px;
    background:${vals.form.bg};
    box-shadow:${buildShadowCss(vals.form.shadow)}
  `;
  ["width","height","bg"].forEach(f => $("#input-" + f).value = vals.form[f]);
  $("#shadow-x").value      = vals.form.shadow.x;
  $("#shadow-y").value      = vals.form.shadow.y;
  $("#shadow-blur").value   = vals.form.shadow.blur;
  $("#shadow-spread").value = vals.form.shadow.spread;
  $("#shadow-color").value  = vals.form.shadow.color;
  $("#shadow-alpha").value  = vals.form.shadow.alpha;
  $("#shadow-inset").checked= vals.form.shadow.inset;

  /* Header global */
  $("#main-header").style.height     = vals.header.height + "px";
  $("#main-header").style.background = vals.header.bg;
  $("#input-cab-height").value = vals.header.height;
  $("#input-cab-bg").value     = vals.header.bg;

  /* Header zones */
  ["left","center","right"].forEach(zone=>{
    const z = vals.header.zones[zone];
    $("#text-"+zone).value  = z.text;
    $("#font-"+zone).value  = z.font;
    $("#size-"+zone).value  = z.size;
    $("#color-"+zone).value = z.color;
    $("#bold-"+zone).classList.toggle("active", z.bold);
    $("#italic-"+zone).classList.toggle("active", z.italic);
    if($("#pos-"+zone)) $("#pos-"+zone).value = z.pos;

    const wrap = $("#header-"+zone);
    wrap.style.cssText = `
      font-family:${z.font};
      font-size:${z.size}px;
      font-weight:${z.bold ? "bold" : "normal"};
      font-style:${z.italic ? "italic" : "normal"};
      color:${z.color};
      ${zone==="left" ? `margin-left:${z.pos||0}px;` : ""}
      ${zone==="right" ? `margin-right:${z.pos||0}px;` : ""}
    `;
    wrap.innerHTML = zone==="right" ? `${z.text} <i class='bi bi-person-circle'></i>` : z.text;
  });

  /* Barra de menú */
  const fm = $("#form-menu");
  if(fm){
    const m = vals.menu;
    fm.style.cssText = `
      height:${m.general.height}px;
      background:${m.general.bg};
      font-family:${m.general.font};
      font-size:${m.general.size}px;
      border-bottom:1px solid ${m.states.activo.border};
      color:${m.general.fontColor};
    `;
	["height","bg","font","size","fontColor"].forEach(k=>{
	  const el = $("#menu-"+k);
	  if(el) el.value = m.general[k];
	});
    $$("#form-menu .menu-item").forEach(it=>{
      let st = m.states.activo;
      if(it.classList.contains("selected")) st = m.states.seleccionado;
      if(it.classList.contains("disabled")) st = m.states.inactivo;
      it.style.cssText = `
        padding:2px 8px;
        color:${st.fontColor};
        background:${st.bgColor};
        border:1px solid ${st.border};
        border-radius:${st.radius}px;
        box-shadow:${buildShadowCss(st.shadow)};
        font-weight:${st.bold ? "bold" : "normal"};
        font-style:${st.italic ? "italic" : "normal"};
      `;
    });
  }
}

/* ---------- UPDATE CONFIG FROM UI ---------- */
function updateConfigFromUI(){
  /* Form */
  config.form.width  = +$("#input-width").value;
  config.form.height = +$("#input-height").value;
  config.form.bg     = $("#input-bg").value;
  config.form.shadow.x      = +$("#shadow-x").value;
  config.form.shadow.y      = +$("#shadow-y").value;
  config.form.shadow.blur   = +$("#shadow-blur").value;
  config.form.shadow.spread = +$("#shadow-spread").value;
  config.form.shadow.color  = $("#shadow-color").value;
  config.form.shadow.alpha  = +$("#shadow-alpha").value;
  config.form.shadow.inset  = $("#shadow-inset").checked;

  /* Header global */
  config.header.height = +$("#input-cab-height").value;
  config.header.bg     = $("#input-cab-bg").value;

  /* Header zones */
  ["left","center","right"].forEach(zone=>{
    const z = config.header.zones[zone];
    z.text   = $("#text-"+zone).value;
    z.font   = $("#font-"+zone).value;
    z.size   = +$("#size-"+zone).value;
    z.color  = $("#color-"+zone).value;
    z.bold   = $("#bold-"+zone).classList.contains("active");
    z.italic = $("#italic-"+zone).classList.contains("active");
    if($("#pos-"+zone)) z.pos = +$("#pos-"+zone).value;
  });

  /* Menú general */
  if($("#menu-height")){
    config.menu.general.height    = +$("#menu-height").value;
    config.menu.general.bg        = $("#menu-bg").value;
    config.menu.general.font      = $("#menu-font").value;
    config.menu.general.size      = +$("#menu-size").value;
    config.menu.general.fontColor = $("#menu-fontColor").value;
  }
}

/* ---------- LISTENERS ---------- */
function initFormListeners(){
  ["#input-width","#input-height","#input-bg",
   "#shadow-x","#shadow-y","#shadow-blur","#shadow-spread","#shadow-color","#shadow-alpha","#shadow-inset"
  ].forEach(sel => $(sel)?.addEventListener("input", ()=>{ updateConfigFromUI(); aplicarConfig(); }));
}
/* ---------- LISTENERS ---------- */
function initHeaderGlobal(){
  ["#input-cab-height","#input-cab-bg"].forEach(sel=>{
    $(sel)?.addEventListener("input",()=>{
      updateConfigFromUI();
      aplicarConfig();
    });
  });
}

function initHeaderZoneListeners(){
  ["left","center","right"].forEach(zone=>{
    /* inputs de text / font / mida / color */
    ["#font-","#size-","#color-","#text-"].forEach(pref=>{
      $(pref+zone)?.addEventListener("input",()=>{
        updateConfigFromUI();
        aplicarConfig();
      });
    });
    /* botons B / I */
    ["#bold-","#italic-"].forEach(pref=>{
      $(pref+zone)?.addEventListener("click",e=>{
        toggleBtn(e.currentTarget);
        updateConfigFromUI();
        aplicarConfig();
      });
    });
    /* posició (només left / right) */
    if($("#pos-"+zone)){
      $("#pos-"+zone).addEventListener("input",()=>{
        updateConfigFromUI();
        aplicarConfig();
      });
    }
  });
}

/* ---------- MENÚ ---------- */
function initMenuListeners(){
  /* inputs generals */
  ["#menu-height","#menu-bg","#menu-font","#menu-size","#menu-fontColor"]
    .forEach(sel=> $(sel)?.addEventListener("input",()=>{
      updateConfigFromUI();
      aplicarConfig();
    }));

  /* inputs dels 3 estats */
  ["activo","seleccionado","inactivo"].forEach(st=>{
    const id = suf => `#${st}-${suf}`;

    ["border","radius","fontColor","bgColor",
     "shadow-x","shadow-y","shadow-blur","shadow-spread",
     "shadow-color","shadow-alpha","shadow-inset"
    ].forEach(k=>{
      $(id(k))?.addEventListener("input",()=>{
        updateConfigFromUI();
        aplicarConfig();
      });
    });

    ["bold","italic"].forEach(k=>{
      $(id(k))?.addEventListener("click",e=>{
        toggleBtn(e.currentTarget);
        updateConfigFromUI();
        aplicarConfig();
      });
    });
  });

  /* pestanyes Activo / Seleccionado / Inactivo */
  $$(".state-trigger").forEach(btn=>{
    btn.addEventListener("click",()=>{
      $$(".state-trigger").forEach(b=>b.classList.remove("active"));
      $$(".state-panel").forEach(p=>p.classList.add("is-hidden"));

      btn.classList.add("active");
      const tgt = "#"+btn.dataset.target;
      $(tgt)?.classList.remove("is-hidden");
    });
  });
}

/* ---------- INIT PRINCIPAL ---------- */
function init(){
  initPanelTriggers();
  initFormListeners();
  initHeaderGlobal();
  initHeaderZoneListeners();
  initMenuListeners();
  aplicarConfig();          // dibuixa tot amb els valors per defecte
}

document.addEventListener("DOMContentLoaded", init);
