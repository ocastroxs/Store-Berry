const buttons = document.querySelectorAll(".one-titulo button");
const sections = document.querySelectorAll(".topico-produto");

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const category = button.getAttribute("data-category");
    buttons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    sections.forEach((section) => {
      if (category === "all" || section.classList.contains(category)) {
        section.style.display = "flex";
      } else {
        section.style.display = "none";
      }
    });
  });
});
document
  .querySelector('.one-titulo button[data-category="all"]')
  .classList.add("active");

const hash = window.location.hash.substring(1);
if (hash) {
  const buttonToActivate = document.querySelector(
    `.one-titulo button[data-category="${hash}"]`
  );
  if (buttonToActivate) {
    buttonToActivate.click();
  }
}

// Chave de armazenamento
const CART_KEY = "meuCarrinho";

// --- Funções de Ajuda (Helpers) ---
function carregarCarrinho() {
  const carrinhoSalvo = localStorage.getItem(CART_KEY);
  return JSON.parse(carrinhoSalvo) || [];
}

function salvarCarrinho(carrinho) {
  localStorage.setItem(CART_KEY, JSON.stringify(carrinho));
}

// Verifica se o usuário está logado
async function verificarLogin() {
  try {
    const response = await fetch("/conta/api/verificar");
    const data = await response.json();
    return data.loggedIn;
  } catch (error) {
    console.error("Erro ao verificar login:", error);
    return false;
  }
}

// Mostra um toast de notificação
function mostrarToast(mensagem, tipo = "success") {
  const toast = document.createElement("div");
  toast.style.cssText = `
          position: fixed;
          bottom: 20px;
          right: 20px;
          padding: 15px 25px;
          border-radius: 5px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
          z-index: 1000;
          animation: slideIn 0.3s ease-out;
          color: white;
          font-weight: 500;
        `;

  // Cores diferentes para diferentes tipos de mensagem
  if (tipo === "success") {
    toast.style.background = "#4CAF50";
  } else if (tipo === "error") {
    toast.style.background = "#f44336";
  } else if (tipo === "warning") {
    toast.style.background = "#ff9800";
  }

  toast.textContent = mensagem;
  document.body.appendChild(toast);

  // Remove o toast após 3 segundos
  setTimeout(() => {
    toast.style.animation = "slideOut 0.3s ease-in";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// --- Lógica da Página de Produtos ---
document.addEventListener("click", async (evento) => {
  // Procuramos o botão mais próximo que represente o "Adicionar".
  const botao = evento.target.closest(
    ".modal-button.adicionar, button[data-id], .btn-primary.adicionar"
  );

  if (!botao) return; // clique não é relevante

  // Verifica se está logado antes de prosseguir
  const estaLogado = await verificarLogin();
  if (!estaLogado) {
    if (
      confirm(
        "Você precisa fazer login para adicionar itens ao carrinho. Deseja fazer login agora?"
      )
    ) {
      // Salva a URL atual para voltar depois do login
      sessionStorage.setItem("returnToUrl", window.location.href);
      window.location.href = "/conta/entrar";
    }
    return;
  }

  const id = botao.dataset.id;
  const name =
    botao.dataset.name || botao.getAttribute("data-name") || "Produto";
  const priceRaw = botao.dataset.price || botao.getAttribute("data-price");
  const price = priceRaw ? parseFloat(priceRaw) : NaN;

  // Tenta inferir o tipo/categoria do produto:
  // 1) data-type no botão
  // 2) atributo data-category no botão
  // 3) id do container .topico-produto mais próximo (ex: 'doces', 'bebidas')
  const typeFromButton =
    botao.dataset.type ||
    botao.getAttribute("data-type") ||
    botao.dataset.category ||
    botao.getAttribute("data-category");
  const topico = botao.closest(".topico-produto");
  const typeFromContainer = topico ? topico.id : "";
  const inferredType = typeFromButton || typeFromContainer || "";

  // Tenta obter imagem (se fornecida via data-image no botão)
  const image = botao.dataset.image || botao.getAttribute("data-image") || "";

  if (!id) {
    console.warn("Botão adicionar clicado sem data-id:", botao);
    mostrarToast(
      "Este produto não possui informações para ser adicionado ao carrinho.",
      "error"
    );
    return;
  }

  // 1. Carrega o carrinho ATUAL do localStorage
  let carrinhoAtual = carregarCarrinho();

  // 2. Modifica o carrinho
  const itemExistente = carrinhoAtual.find((item) => item.id === id);

  if (itemExistente) {
    itemExistente.quantity++;
    mostrarToast(`Quantidade de ${name} aumentada no carrinho!`, "success");
  } else {
    const novoItem = {
      id: id,
      name: name,
      price: isNaN(price) ? 0 : price,
      quantity: 1,
      type: inferredType,
      image: image,
    };
    carrinhoAtual.push(novoItem);
    mostrarToast(`${name} adicionado ao carrinho!`, "success");
  }

  // 3. Salva o carrinho MODIFICADO de volta no localStorage
  salvarCarrinho(carrinhoAtual);
});
