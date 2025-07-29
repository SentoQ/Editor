
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
   let p   // ed-subside de collection
 
  // Tancar tot
  document.querySelectorAll('.ed-subside.open').forEach(p => {
    p.classList.remove('open');
    if (p.previousElementSibling && p.previousElementSibling.tagName === 'BUTTON') p.previousElementSibling.classList.remove('active');
  });

  // Obrir si estava tancat
  if (!btn.nextElementSibling.classList.contains('open')) {
    btn.nextElementSibling.classList.add('open');
    btn.classList.add('active');
  }
}
