// Chave de armazenamento (DEVE ser a mesma da outra página)
const CART_KEY = "meuCarrinho";

// Elementos da página
const carrinhoItensContainer = document.getElementById("lista-produtos");
const totalEl = document.getElementById("total");
const subtotalEl = document.getElementById("subtotal");
const entregaEl = document.getElementById("entrega");
const quantidadeItensEl = document.getElementById("quantidade-itens");
const btnFinalizar = document.getElementById("btn-finalizar");

// --- Funções de Ajuda (Helpers) ---
function carregarCarrinho() {
  const carrinhoSalvo = localStorage.getItem(CART_KEY);
  return JSON.parse(carrinhoSalvo) || [];
}

function salvarCarrinho(carrinho) {
  localStorage.setItem(CART_KEY, JSON.stringify(carrinho));
}

function formatCurrency(value) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
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

/**
 * Função principal que desenha o carrinho na tela
 */
function renderizarCarrinho() {
  // Carrega os dados mais recentes
  const carrinho = carregarCarrinho();

  // Limpa o HTML antigo
  carrinhoItensContainer.innerHTML = "";

  let subtotal = 0;
  let totalItems = 0;

  if (!carrinho || carrinho.length === 0) {
    carrinhoItensContainer.innerHTML = `<p style="color:#444;">Seu carrinho está vazio</p>`;
    subtotalEl.textContent = formatCurrency(0);
    totalEl.textContent = formatCurrency(0);
    entregaEl.textContent = "Grátis";
    quantidadeItensEl.textContent = "0 itens no carrinho";
    return;
  }

  // Cria o HTML para cada item (usa a estrutura .produto solicitada)
  carrinho.forEach((item) => {
    const li = document.createElement("div");
    li.className = "produto";
    li.innerHTML = `
              <div class="produto-img">
                <img src="${item.image || ""}" class="img" alt="${item.name}">
              </div>
              <div class="info-produto">
                <span class="nome-produto">${item.name}</span>
                <div class="quan-produto">
                  <button class="btn-decrease" data-id="${item.id}">-</button>
                  <input class="qtd-input" type="number" value="${item.quantity}" min="1" data-id="${item.id}" readonly>
                  <button class="btn-increase" data-id="${item.id}">+</button>
                </div>
              </div>
              <div class="preco-produto">
                <button class="remove-btn" data-id="${item.id}"></button>
                <span class="preco-total-item">${formatCurrency(Number(item.price) * Number(item.quantity))}</span>
              </div>
            `;
    carrinhoItensContainer.appendChild(li);

    subtotal += Number(item.price) * Number(item.quantity);
    totalItems += Number(item.quantity);
  });

  // Atualiza valores na UI
  subtotalEl.textContent = formatCurrency(subtotal);
  entregaEl.textContent = "Grátis";
  totalEl.textContent = formatCurrency(subtotal);

  quantidadeItensEl.textContent = `${totalItems} ${totalItems === 1 ? "item" : "itens"} no carrinho`;
}

// --- Lógica de Eventos da Página do Carrinho ---
// Eventos para MUDAR QUANTIDADE ou REMOVER
carrinhoItensContainer.addEventListener("input", (evento) => {
  if (!evento.target.classList.contains("qtd-input")) return;

  const id = evento.target.dataset.id;
  const novaQuantidade = parseInt(evento.target.value, 10);

  if (isNaN(novaQuantidade) || novaQuantidade < 1) {
    evento.target.value = 1;
    return;
  }

  let carrinho = carregarCarrinho();
  const item = carrinho.find((item) => String(item.id) === String(id));

  if (item) {
    item.quantity = novaQuantidade;
    salvarCarrinho(carrinho);
    renderizarCarrinho();
  }
});

// Previne valores inválidos ao digitar
carrinhoItensContainer.addEventListener("keydown", (evento) => {
  if (!evento.target.classList.contains("qtd-input")) return;

  if (
    [46, 8, 9, 27, 13].indexOf(evento.keyCode) !== -1 ||
    (evento.keyCode === 65 && evento.ctrlKey === true) ||
    (evento.keyCode === 67 && evento.ctrlKey === true) ||
    (evento.keyCode === 86 && evento.ctrlKey === true) ||
    (evento.keyCode === 88 && evento.ctrlKey === true) ||
    (evento.keyCode >= 35 && evento.keyCode <= 39)
  ) {
    return;
  }

  if ((evento.shiftKey || evento.keyCode < 48 || evento.keyCode > 57) && (evento.keyCode < 96 || evento.keyCode > 105)) {
    evento.preventDefault();
  }
});

carrinhoItensContainer.addEventListener("click", (evento) => {
  const id = evento.target.dataset.id;

  // Se clicou em REMOVER (botão X)
  if (evento.target.classList.contains("remove-btn")) {
    let carrinho = carregarCarrinho();
    const itemRemovido = carrinho.find((item) => String(item.id) === String(id));
    carrinho = carrinho.filter((item) => String(item.id) !== String(id));
    salvarCarrinho(carrinho);
    renderizarCarrinho();
    return;
  }

  // Se clicou em INCREMENTAR quantidade (+)
  if (evento.target.classList.contains("btn-increase")) {
    let carrinho = carregarCarrinho();
    const item = carrinho.find((it) => String(it.id) === String(id));
    if (item) {
      item.quantity = Number(item.quantity) + 1;
      salvarCarrinho(carrinho);
      renderizarCarrinho();
    }
    return;
  }

  // Se clicou em DECREMENTAR quantidade (-)
  if (evento.target.classList.contains("btn-decrease")) {
    let carrinho = carregarCarrinho();
    const item = carrinho.find((it) => String(it.id) === String(id));
    if (item) {
      const novaQtd = Number(item.quantity) - 1;
      if (novaQtd > 0) {
        item.quantity = novaQtd;
      } else {
        // se chegar a 0, remove o item
        carrinho = carrinho.filter((it) => String(it.id) !== String(id));
      }
      salvarCarrinho(carrinho);
      renderizarCarrinho();
    }
    return;
  }
});

// --- FUNCIONALIDADE DE FINALIZAR COMPRA ---
if (btnFinalizar) {
  btnFinalizar.addEventListener("click", () => {
    const carrinho = carregarCarrinho();

    // Verifica se o carrinho está vazio
    if (!carrinho || carrinho.length === 0) {
      return;
    }

    // Calcula o total
    const total = carrinho.reduce((acc, item) => {
      return acc + Number(item.price) * Number(item.quantity);
    }, 0);

    // Mostra o modal com QR code PIX
    mostrarModalPix(total);
  });
}

// --- FUNÇÕES DO MODAL PIX ---
function mostrarModalPix(total) {
  const modalPix = document.getElementById("modalPix");
  const pixValue = document.getElementById("pixValue");
  const qrcodeImg = document.getElementById("qrcode");
  const pixKey = "12345678901234567890"; // Sua chave PIX aqui

  // Atualiza o valor no modal
  pixValue.textContent = formatCurrency(total);

  // Gera o QR code usando a API gratuita qrserver.com
  qrcodeImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(pixKey)}`;

  // Mostra o modal
  modalPix.classList.add("show");
}

// Fechar modal ao clicar no X
document.getElementById("closeModal").addEventListener("click", () => {
  document.getElementById("modalPix").classList.remove("show");
});

// Fechar modal ao clicar fora dele
document.getElementById("modalPix").addEventListener("click", (e) => {
  if (e.target.id === "modalPix") {
    document.getElementById("modalPix").classList.remove("show");
  }
});

// Copiar chave PIX para clipboard
document.getElementById("btnCopyPix").addEventListener("click", () => {
  const pixKeyEl = document.getElementById("pixKey");
  const pixKey = pixKeyEl.textContent;

  navigator.clipboard.writeText(pixKey).then(() => {
    const btnCopy = document.getElementById("btnCopyPix");
    const originalText = btnCopy.textContent;
    btnCopy.textContent = "✓ Copiado!";
    btnCopy.style.background = "#1db760";

    setTimeout(() => {
      btnCopy.textContent = originalText;
      btnCopy.style.background = "#1db760";
    }, 2000);
  });
});

// Confirmar pagamento (limpa carrinho)
document.getElementById("btnConfirmPix").addEventListener("click", () => {
  const carrinho = carregarCarrinho();

  if (carrinho && carrinho.length > 0) {
    localStorage.removeItem(CART_KEY);
    renderizarCarrinho();
    document.getElementById("modalPix").classList.remove("show");

    // Toast de sucesso
    mostrarToast("Pedido finalizado com sucesso!", "success");

    // Opcional: redirecionar após alguns segundos
    setTimeout(() => {
      window.location.href = "/";
    }, 2000);
  }
});

// --- PONTO DE ENTRADA ---
// Assim que a página carrinho.html carregar,
// chama a função para desenhar o carrinho na tela.
document.addEventListener("DOMContentLoaded", () => {
  renderizarCarrinho();
});
