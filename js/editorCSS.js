
// Funcions de ed-side
// **********  EVENTS *****************

function subsideClose(p) {                               
  p.classList.remove('open');
  const btn = p.previousElementSibling;
  if (btn && btn.tagName === 'BUTTON') {
    btn.classList.remove('active');
    if (btn.dataset.anex) {
      const classe = btn.dataset.anex.split(/\s*[\{\(]/)[0].trim();
	  let target;
	  if (classe.startsWith('#')) {
		target = document.getElementById(classe.slice(1));
	  } else {
		target = document.querySelector(classe.startsWith('.') ? classe : '.' + classe);
	  }
      if (target) target.style.display = 'none';
    }
  }
}

function subsideOpen(btn) {
  // Tancar tots els subsides oberts
  document.querySelectorAll('.ed-subside.open').forEach(p => {
    subsideClose(p);
  });

  const subside = btn.nextElementSibling;
  if (!subside.classList.contains('open')) {
    subside.classList.add('open');
    btn.classList.add('active');

    if (btn.dataset.anex) {
      const [classe, estilos] = btn.dataset.anex.split(/\s*\{([^}]*)\}/).filter(Boolean);
	  let target;
	  if (classe.startsWith('#')) {
		target = document.getElementById(classe.slice(1));
	  } else {
		target = document.querySelector(classe.startsWith('.') ? classe : '.' + classe);
	  }
	  if (target) target.style.display = 'block';

      if (estilos) {
        estilos.trim().split(/\s+/).forEach(propVal => {
          const [prop, val] = propVal.split(':').map(s => s.trim());
          if (prop && val) {
            let finalVal = val;
            const refMatch = val.match(/^([.#][\w-]+)([+\-]\d+(?:px|%|em)?)?$/);
            if (refMatch) {
              const refEl = document.querySelector(refMatch[1]);
              if (refEl) {
                const osprop = 'offset' + prop.charAt(0).toUpperCase() + prop.slice(1);
                const baseVal = (osprop in refEl) ? refEl[osprop] : parseFloat(getComputedStyle(refEl)[prop]) || 0;
                const offset = refMatch[2] || '+0px';
                const numericOffset = parseFloat(offset);
                const unit = offset.replace(/^[+\-]?\d+/, '') || 'px';
                finalVal = (baseVal + numericOffset) + unit;
 console.log("Valor Final = ", finalVal, " en ", prop, " de ", refEl);
             }
            }
            target.style[prop] = finalVal;
          }
        });
      }
    }
  }
}


function tabShow(target) {
  const index = target.getAttribute('data-tabidx');
  if (index) {
    if (!target.classList.contains('active')) {
      const group = index.charAt(0);

      document.querySelectorAll('.ed-tab').forEach(tab => {
        if (tab.getAttribute('data-tabidx')?.charAt(0) === group) {
          tab.classList.remove('active');
        }
      });
      target.classList.add('active');

      document.querySelectorAll('.ed-tab-content').forEach(content => {
        if (content.getAttribute('data-tabidx')?.charAt(0) === group) {
          content.classList.remove('active');
        }
      });
      const contentToShow = document.querySelector(`.ed-tab-content[data-tabidx="${index}"]`);
      if (contentToShow) contentToShow.classList.add('active');
    }
  }
}


//Funcions de Inputs i CSS
// Veure atribut total o parcial d'un objecte 
function getCSS(classes, prop, ix, und) {
  classes = classes.split(',').map(c => c.trim());
  let classe = classes[0];
  let valcss=read_styleSheets("." + classe, prop);;
 
  // Aplicar ix si cal
  // console.log("getCSS >> ", " - ", classes, " - ", prop,  " - ",ix, " - ", und)
    
  if (ix && valcss) {

    let parts = tksInSpc(valcss)   //.match(/[a-zA-Z-]+\([^)]+\)|[^\s]+/g);
    let i = parseInt(ix) - 1;
    if (i >= 0 && i < parts.length) {
      valcss = parts[i];
      if (ix.includes("[")) {
        let [, modo, ini, fin] = ix.match(/^\d+(?:-)?(?:([a-z]+))?(?:\[(\d{1,2})(?::(\d{1,2}))?\])?$/i);
        ini = parseInt(ini);
        fin = fin ? parseInt(fin) : ini;
        let sub = tksInSpc(valcss.trim(), ",", true);   //valcss.match(/([a-zA-Z]+)|(\d*\.?\d+)/g);
 // if (prop==="transform") console.log("Returen >> ", ini, " / ", fin, " / ", sub);
		sub = sub.slice(ini, fin + 1);
		valcss = (modo ? modo + "(" : "") + sub.join(", ") + (modo ? ")" : "");
        valcss = valcss.replace(und,"");
	  }
    }
  }

  // if (prop==="transform")
//	  console.log("Returen >> ", prop, " = ", valcss);
  return valcss;
}

//Inserir un atribut total o parcialment
function setCSS(classes, prop, ix, und, valor) {
  // console.log("setCSS 1.0 >> ", valor);
  classes = classes.split(',').map(c => c.trim());
  classes.forEach(classe => {

    let valorActual = valor;

    if (ix) {
      let valclass = read_styleSheets("." + classe, prop);

      if (valclass) {
        let tcss = tksInSpc(valclass)  //.trim().match(/[a-zA-Z-]+\([^)]+\)|[^\s]+/g);
        let i = parseInt(ix) - 1;

        if (ix.includes("[")) {
          let [, modo, ini, fin] = ix.match(/^\d+(?:-)?(?:([a-z]+))?(?:\[(\d{1,2})(?::(\d{1,2}))?\])?$/i);
          ini = parseInt(ini);
          fin = fin ? parseInt(fin) : ini;

          let sub = tksInSpc(tcss[i], ",", true);  //tcss[i].match(/([a-zA-Z\-]+)|(\d*\.?\d+)/g);
			if (ini === fin) {
			  sub[ini] = valor
//			  if (!isNaN(parseInt(valor))) sub[ini] = valor + ((/^[a-z]+$/.test(und)) ? und : "");
			} else {
				sub.splice(ini, fin - ini + 1, ...valor.match(/(\d*\.?\d+)/g));
			}
          tcss[i] = sub[0] + "(" + sub.slice(1).join(", ") + ")";
       } else {
		  tcss[i] = valor;
       }
	 
//	  console.log("setCSS >> ",tcss);
        valorActual = tcss.join(" ");
     
      }
	}
//	  console.log("setCSS >> ",valorActual)

    // 1. Modificar la regla CSS
    let updated = false;
    for (let sheet of document.styleSheets) {
      for (let rule of sheet.cssRules) {
        if (rule.selectorText === "." + classe) {
          rule.style.setProperty(prop, valorActual);
          updated = true;
          break;
        }
      }
      if (updated) break;
    }
    // 2. Modificar elements actuals

	if (prop === "textContent") {
	  document.querySelectorAll("." + classe).forEach(el => el.textContent = valorActual);
	}
  });
}



// Extreu el valor d'un input
function getInput(input) {
  let valor
  switch (input.type) {
    case "number":
      switch (input.dataset.funit){
		case "%":
          valor = (parseInt(input.value)/100).toFixed(2);
		  break;
//		case "px":
//		  valor=input.value + "px";
//		  break;
//		case "em":
//		  valor=input.value + "em";
//		  break;
		default:
		  valor=input.value + input.dataset.funit;
	  }
//		console.log("getInpu num >> ",valor," en ", input.value , "-" , "input.dataset.fclass","/",input.dataset.fproperty,"/",input.dataset.findex,"/",input.dataset.funit);
	  break;
	case "color":
	  valor=hexTorgb(input.value);
	  break;
	case "checkbox":
	  valor=input.checked ? input.dataset.funit : "";
	  break;
	case "button":
	  valor = input.classList.contains("active") ? input.dataset.funit : "";
	  break;
	default:
	  valor=input.value;
  }
  return valor;
}  

function setInput(input, valor) {
  switch (input.type) {
    case "number":
      switch (input.dataset.funit) {
        case "%":
          input.value = (parseFloat(valor) * 100).toFixed(0);
          break;
//        case "px":
//          input.value = parseFloat(valor); // Elimina "px" i assigna número
//          break;
//         case "em":
//          input.value = parseFloat(valor); // Elimina "em" i assigna número
//          break;
       default:
          input.value = valor.replace(input.dataset.funit, "");
      }
      break;
    case "color":
  	  input.value = rgbTohex(valor); // Necessites funció inversa de `hetTorgb`
      break;
    case "checkbox":
      input.checked = (valor === input.dataset.funit);
      break;
    case "button":
	  input.classList.toggle("active", valor === input.dataset.funit);
	  break;
	default:
      input.value = valor;
  }
}

function inputTocss(input) {
    setCSS (input.dataset.fclass, input.dataset.fproperty, input.dataset.findex, input.dataset.funit, getInput(input));
}

function cssToinput(input){
   setInput(input,getCSS(input.dataset.fclass, input.dataset.fproperty, input.dataset.findex, input.dataset.funit));
}

function read_styleSheets(classe, prop) {
  let valclass = null;

  // Prioritza el valor del DOM
  let el = document.querySelector(classe);
  if (el) {
    valclass = prop === "textContent"
      ? el.textContent.trim()
      : getComputedStyle(el).getPropertyValue(prop).trim();
  }

  // Només recorre el CSS si no hi ha valor o si és pseudo-class/element
  if (!valclass || classe.includes(":")) {
    for (let sheet of document.styleSheets) {
      if (!sheet.href || sheet.href.startsWith(window.location.origin)) {
        for (let rule of sheet.cssRules) {
          if (rule.selectorText === classe) {
            valclass = rule.style.getPropertyValue(prop).trim();
            if (valclass) break;
          }
        }
      }
      if (valclass) break;
    }
  }

  return valclass;
}

function tksInSpc(propvalue, sep=" ", sptxt=false) {
  let tks = [];
  let rvalue = propvalue.trim();

  let ixSpc; 
  let ixPar = rvalue.indexOf("(");
  if (sptxt && ixPar>-1) {
	tks.push(rvalue.slice(0,ixPar).trim());
	rvalue = rvalue.slice(ixPar+1,-1).trim();
  }  

   let c=0;
   while (rvalue.length > 0) {
    ixSpc = rvalue.indexOf(sep);
    ixPar = rvalue.indexOf("(");

    if (ixSpc === -1) ixSpc = rvalue.length + 1;
    if (ixPar === -1) ixPar = rvalue.length + 1;

    if (ixPar < ixSpc) {       // c=0  - No
      ixSpc = rvalue.indexOf(")"+sep, ixPar) + 1;
	  if (ixSpc === 0) ixSpc = rvalue.length + 1;
	  
    }

	
    if (ixSpc > rvalue.length) {   // c=0  / No
      tks.push(rvalue.trim());
      rvalue = "";
    } else {
      tks.push(rvalue.slice(0, ixSpc).trim());    // en c=0 >> '0
      rvalue = rvalue.slice(ixSpc+1).trim();
    }
	c++;
	
  }

  return tks;
}

function syncAllInputsFromCSS() {
  document.querySelectorAll("[data-fclass]").forEach(input => {
    cssToinput(input);
  });
}

function bindInputsToCSS() {
  document.querySelectorAll("[data-fclass]").forEach(input => {
    input.addEventListener("input", () => {
      inputTocss(input);
    });
  });
}
	  
function hexTorgb(hex) {
  let r, g, b, a;
  [, r, g, b, a] = hex.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})?$/i);

  [r, g, b] = [r, g, b].map(x => parseInt(x, 16));
  if (a) [a] = [a].map(x => (parseInt(x, 16) / 255).toFixed(3));

  return `rgb${a ? "a" : ""}(${r}, ${g}, ${b}${a ? ", " + a : ""})`;
}

function rgbTohex(rgb) {
  let r, g, b, a;
  [, r, g, b, a] = rgb.match(/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d*\.?\d+)\s*)?\)$/i);

  [r, g, b] = [r, g, b].map(x => parseInt(x).toString(16).padStart(2, "0"));
  if (a) [a] = [a].map(x => Math.round(parseFloat(x) * 255).toString(16).padStart(2, "0"));

  return `#${r}${g}${b}${a || ""}`;
} 

// Cos executable
// Events dels objectes
window.addEventListener("DOMContentLoaded", () => {
  syncAllInputsFromCSS();  
  bindInputsToCSS();       

  document.addEventListener('click', (e) => {
    const target = e.target;

    if (target.classList.contains('ed-btn')) {
      target.classList.toggle('active');
      inputTocss(target);
    }

    if (target.classList.contains('ed-side-bt')) {
      subsideOpen(target);
    }

    if (target.closest('.ed-closeside-bt')) {
      const subside = target.closest('.ed-closeside-bt').closest('.ed-subside');
      if (subside) subsideClose(subside);
    }

    if (target.classList.contains('ed-tab')) {
      tabShow(target);
    }
  });
});


 // Afegir opcions als selects
const llistes = {

"border": ["none", "solid", "dashed", "dotted", "double", "groove", "ridge", "inset", "outset"
],
"font-family": ["Arial","Arial Narrow", "Calibri", "Cambria", "Roboto", "Comic Sans MS", "Consolas", "Garamond", "Georgia", "Impact", "Lucida Console", "Palatino Linotype", "Segoe UI", "Symbol", "Tahoma", "Times New Roman", "Trebuchet MS", "Verdana",
"serif", "sans-serif", "monospace", "cursive", "fantasy", "system-ui", "Cursive", "Brush Script MT", "Lucida Handwriting", "Comic Sans MS", "Bradley Hand", "Segoe Script", "Zapfino"
],
"font-stretch": ["ultra-condensed","extra-condensed","condensed","semi-condensed","normal","semi-expanded","expanded","extra-expanded","ultra-expanded"
],
};

document.querySelectorAll('select[data-fproperty]').forEach(sel => {
const prop = sel.dataset.fproperty;

if (llistes[prop]) {
  llistes[prop].forEach(opc => {
	const option = document.createElement('option');
	option.value = opc;
	option.textContent = opc;
	sel.add(option);
	});
  }
});

