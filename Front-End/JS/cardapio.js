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

// Toast estilizado bonito que combina com o site
function mostrarToast(mensagem, tipo = "success") {
  const toast = document.createElement("div");
  toast.className = `toast-notification toast-${tipo}`;

  // Ícone baseado no tipo
  let icone = "";
  if (tipo === "success") {
    icone = "✓";
  } else if (tipo === "error") {
    icone = "✕";
  } else if (tipo === "warning") {
    icone = "⚠";
  } else if (tipo === "info") {
    icone = "ℹ";
  }

  toast.innerHTML = `
    <div class="toast-icon">${icone}</div>
    <div class="toast-message">${mensagem}</div>
  `;

  document.body.appendChild(toast);

  // Animação de entrada suave
  setTimeout(() => toast.classList.add("toast-show"), 10);

  // Remove o toast após 3 segundos com animação
  setTimeout(() => {
    toast.classList.remove("toast-show");
    toast.classList.add("toast-hide");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// --- Lógica da Página de Produtos ---
document.addEventListener("click", async (evento) => {
  const botao = evento.target.closest(
    ".modal-button.adicionar, button[data-id], .btn-primary.adicionar"
  );

  if (!botao) return;

  const estaLogado = await verificarLogin();
  if (!estaLogado) {
    mostrarToast(
      "Você precisa fazer login para adicionar itens ao carrinho 🔒",
      "warning"
    );
    setTimeout(() => {
      sessionStorage.setItem("returnToUrl", window.location.href);
      window.location.href = "/conta/entrar";
    }, 1500);
    return;
  }

  const id = botao.dataset.id;
  const name =
    botao.dataset.name || botao.getAttribute("data-name") || "Produto";
  const priceRaw = botao.dataset.price || botao.getAttribute("data-price");
  const price = priceRaw ? parseFloat(priceRaw) : NaN;

  // Captura a imagem do background do modal
  const modal = botao.closest(".modal-content");
  const modalHeader = modal
    ? modal.querySelector(".modal-header.banner-modal")
    : null;
  let image = botao.dataset.image || botao.getAttribute("data-image") || "";

  if (!image && modalHeader) {
    const backgroundStyle =
      window.getComputedStyle(modalHeader).backgroundImage;
    const urlMatch = backgroundStyle.match(/url\(["']?([^"')]+)["']?\)/);
    if (urlMatch && urlMatch[1]) {
      image = urlMatch[1];
    }
  }

  const typeFromButton =
    botao.dataset.type ||
    botao.getAttribute("data-type") ||
    botao.dataset.category ||
    botao.getAttribute("data-category");
  const topico = botao.closest(".topico-produto");
  const typeFromContainer = topico ? topico.id : "";
  const inferredType = typeFromButton || typeFromContainer || "";

  if (!id) {
    console.warn("Botão adicionar clicado sem data-id:", botao);
    mostrarToast("Este produto não possui informações válidas", "error");
    return;
  }

  let carrinhoAtual = carregarCarrinho();
  const itemExistente = carrinhoAtual.find((item) => item.id === id);

  if (itemExistente) {
    itemExistente.quantity++;
    mostrarToast(`Quantidade de ${name} aumentada no carrinho! 🍓`, "success");
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
    mostrarToast(`${name} adicionado ao carrinho com sucesso! 🛒`, "success");
  }

  salvarCarrinho(carrinhoAtual);
});
