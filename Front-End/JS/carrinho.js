// Chave de armazenamento (DEVE ser a mesma da outra página)
const CART_KEY = "meuCarrinho";

// Elementos da página
const carrinhoItensContainer = document.getElementById("lista-produtos");
const totalEl = document.getElementById("total");
const subtotalEl = document.getElementById("subtotal");
const entregaEl = document.getElementById("entrega");
const quantidadeItensEl = document.getElementById("quantidade-itens");

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
                <img src="${item.image || ""}" class="img">
              </div>
              <div class="info-produto">
                <span class="nome-produto">${item.name}</span>
                <button class="btn-decrease" data-id="${item.id}">-</button>
                <input class="qtd-input" type="number" value="${
                  item.quantity
                }" min="1" data-id="${item.id}">
                <button class="btn-increase" data-id="${item.id}">+</button>
              </div>
              <div class="preco-produto">
                <button class="remove-btn" data-id="${item.id}">X</button>
                <span class="preco-total-item">${formatCurrency(
                  Number(item.price) * Number(item.quantity)
                )}</span>
              </div>
            `;
    carrinhoItensContainer.appendChild(li);

    subtotal += Number(item.price) * Number(item.quantity);
    totalItems += Number(item.quantity);
  });

  // Atualiza valores na UI
  subtotalEl.textContent = formatCurrency(subtotal);
  // Entrega: manter mensagem atual (pode ser dinamizada no futuro)
  entregaEl.textContent = "Grátis";
  // Total = subtotal (já que entrega é grátis aqui)
  totalEl.textContent = formatCurrency(subtotal);

  quantidadeItensEl.textContent = `${totalItems} ${
    totalItems === 1 ? "item" : "itens"
  } no carrinho`;
}

// --- Lógica de Eventos da Página do Carrinho ---
// Eventos para MUDAR QUANTIDADE ou REMOVER
carrinhoItensContainer.addEventListener("input", (evento) => {
  const id = evento.target.dataset.id;

  // Se mudou a QUANTIDADE no input
  if (evento.target.classList.contains("qtd-input")) {
    const novaQuantidade = parseInt(evento.target.value, 10);
    let carrinho = carregarCarrinho();
    const item = carrinho.find((item) => String(item.id) === String(id));

    if (item && novaQuantidade > 0) {
      item.quantity = novaQuantidade;
      salvarCarrinho(carrinho); // Salva a mudança
      renderizarCarrinho(); // Redesenha tudo para atualizar o total
    }
  }
});

carrinhoItensContainer.addEventListener("click", (evento) => {
  const id = evento.target.dataset.id;

  // Se clicou em REMOVER (botão X)
  if (evento.target.classList.contains("remove-btn")) {
    let carrinho = carregarCarrinho();
    carrinho = carrinho.filter((item) => String(item.id) !== String(id));
    salvarCarrinho(carrinho); // Salva a mudança
    renderizarCarrinho(); // Redesenha
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

// --- PONTO DE ENTRADA ---
// Assim que a página carrinho.html carregar,
// chama a função para desenhar o carrinho na tela.
document.addEventListener("DOMContentLoaded", () => {
  renderizarCarrinho();
});
