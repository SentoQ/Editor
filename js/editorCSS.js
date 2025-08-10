
// Funcions de ed-side
// Tancar si fem clic fora de ed-subside
document.addEventListener('click', function (e) {
   let p   // ed-subside de collection

  // Evitar tancar si el clic és dins d’un .ed-subside
  if (e.target.closest('.ed-subside')) return;

  // Si clic fora del side o en una zona buida del side (però no en un botó)
  if (e.target.closest('.ed-side') && !e.target.closest('button')) {
    document.querySelectorAll('.ed-subside.open').forEach(p => {
		p.classList.remove('open');
		p.previousElementSibling.classList.remove('active');
	});
  }
});

// Funcions de ed-subside
// Obrir/tancar la subside
function subsideOpen(btn) {
  // Tancar tot
  document.querySelectorAll('.ed-subside.open').forEach(p => {
    p.classList.remove('open');
    if (p.previousElementSibling && p.previousElementSibling.tagName === 'BUTTON') 
      p.previousElementSibling.classList.remove('active');
    if (p.previousElementSibling?.dataset.anex) {
      const classe = p.previousElementSibling.dataset.anex.split(/\s*[\{\(]/)[0].trim();
      const target = document.querySelector('.' + classe);
      if (target) target.style.display = 'none';
    }
  });

  if (!btn.nextElementSibling.classList.contains('open')) {
    btn.nextElementSibling.classList.add('open');
    btn.classList.add('active');

    if (btn.dataset.anex) {
      const [classe, estilos] = btn.dataset.anex.split(/\s*\{([^}]*)\}/).filter(Boolean);
      const target = document.querySelector('.' + classe);
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
              }
            }
            target.style[prop] = finalVal;
          }
        });
      }
    }
  }
}





function showTab(index) {
  document.querySelectorAll('.ed-tab').forEach((tab, i) => {
    tab.classList.toggle('active', i === index);
  });
  document.querySelectorAll('.ed-tab-content').forEach((content, i) => {
    content.classList.toggle('active', i === index);
  });
}


//Funcions de Inputs i CSS
// Veure atribut total o parcial d'un objecte 
function getCSS(classe, prop, ix) {
  let valcss, modo, ini, fin;

  let el =  document.querySelector("." + classe);
  let obj = getComputedStyle(el);
  if (prop in el.style) {
	  valcss= obj.getPropertyValue(prop).trim();
  } else {
      valcss=el[prop];
  }
  if (ix && parseInt(ix) >= 0) {
    valcss = valcss.match(/[a-zA-Z-]+\([^)]+\)|[^\s]+/g)[parseInt(ix)-1];
    if (ix.includes("[")) {
      [, modo, ini, fin] = ix.match(/^\d+(?:-)?(?:([a-z]+))?(?:\[(\d{1,2})(?::(\d{1,2}))?\])?$/i);
		valcss = valcss.match(/[^(),\s]+/g);
        valcss = (modo ? modo + "(" : "") +
                 valcss.slice(parseInt(ini), (fin ? parseInt(fin) : parseInt(ini)) + 1).join(", ") +
                 (modo ? ")" : "");
      }
    }
  return valcss;
}

//Inserir un atribut total o parcialment
function setCSS(classe, prop, ix, valor) {
  let obj, tcss, surfb, modo, ini, fin, sub;
  obj = document.querySelector("." + classe);

  if(ix) {
	tcss = getComputedStyle(obj).getPropertyValue(prop)
			 .trim().match(/[a-zA-Z-]+\([^)]+\)|[^\s]+/g);	
	let i = parseInt(ix) - 1;
	if (ix.includes("[")) {
	  [, modo, ini, fin] = ix.match(/^\d+(?:-)?(?:([a-z]+))?(?:\[(\d{1,2})(?::(\d{1,2}))?\])?$/i);
	  ini = parseInt(ini);
	  fin = fin ? parseInt(fin) : ini;

	  sub = tcss[i].match(/([a-zA-Z]+)|(\d*\.?\d+)/g); // ex: ["rgba", "81", "82", "83", "0.5"]

	  sub.splice(ini, fin - ini + 1, ...valor.match(/(\d*\.?\d+)/g)); // ini ja apunta al valor dins dels parèntesis

	  tcss[i] = sub[0] + "(" + sub.slice(1).join(", ") + ")";
	}else{
	   tcss[i]=valor;
	}

	valor=tcss.join(" ");
  }
  console.log ("setCCS >>" , classe, prop);
  if (prop in obj.style) {
	obj.style.setProperty(prop, valor);
  } else {
    obj[prop] = valor;
  } 
  
	return;
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
		case "px":
		  valor=input.value + "px";
		  break;
		default:
		  valor=input.value;
	  }
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
        case "px":
          input.value = parseFloat(valor); // Elimina "px" i assigna número
          break;
        default:
          input.value = valor;
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
    setCSS (input.dataset.fclass, input.dataset.fproperty, input.dataset.findex,getInput(input));
}

function cssToinput(input){
   setInput(input,getCSS(input.dataset.fclass, input.dataset.fproperty, input.dataset.findex));
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


// Events dels objectes
window.addEventListener("DOMContentLoaded", () => {
  syncAllInputsFromCSS();  // Carrega valors del CSS als input 
  bindInputsToCSS();       // Enllaça els inputs perquè s'actualitzin el CSS
});
document.querySelectorAll('.ed-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.classList.toggle('active');
	inputTocss(btn);
  });
}); 


 // Afegir opcions als selects
const llistes = {
"font-family": ["Arial", "Calibri", "Cambria", "Comic Sans MS", "Consolas", "Garamond", "Georgia", "Impact", "Lucida Console", "Palatino Linotype", "Segoe UI", "Symbol", "Tahoma", "Times New Roman", "Trebuchet MS", "Verdana",
"serif", "sans-serif", "monospace", "cursive", "fantasy", "system-ui", "Cursive", "Brush Script MT", "Lucida Handwriting", "Comic Sans MS", "Bradley Hand", "Segoe Script", "Zapfino"
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

