const cpf = document.getElementById('cpf');

cpf.addEventListener('input', () => {
  let v = cpf.value.replace(/\D/g, '').slice(0, 11);
  if (v.length > 3 && v.length <= 6)
    v = v.replace(/(\d{3})(\d+)/, '$1.$2');
  else if (v.length > 6 && v.length <= 9)
    v = v.replace(/(\d{3})(\d{3})(\d+)/, '$1.$2.$3');
  else if (v.length > 9)
    v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
  cpf.value = v;
});

window.addEventListener("load", () => {
    document.body.classList.add("loaded");
  });

  document.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", e => {
      if (link.href && !link.href.includes("#")) {
        e.preventDefault();
        document.body.classList.remove("loaded");
        setTimeout(() => {
          window.location = link.href;
        }, 350);
      }
    });
  });