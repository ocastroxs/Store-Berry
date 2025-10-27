// =============== CONFIGURAÇÃO BÁSICA ===============

// URL da sua API (ajuste conforme o back-end)
const API_URL = "http://localhost:3000/carrinho";

// Elementos principais
const listaProdutos = document.getElementById("lista-produtos");
const subtotalElem = document.getElementById("subtotal");
const totalElem = document.getElementById("total");
const quantidadeElem = document.getElementById("quantidade-itens");


// =============== FUNÇÃO PRINCIPAL ===============

// Busca os dados do carrinho no back-end
async function carregarCarrinho() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Erro ao carregar carrinho.");

        const data = await response.json();
        renderizarCarrinho(data.itens);
    } catch (err) {
        console.error(err);
        listaProdutos.innerHTML = `<p style="color:red;">Erro ao carregar o carrinho 😞</p>`;
    }
}


// =============== FUNÇÃO DE RENDERIZAÇÃO ===============

function renderizarCarrinho(itens) {
    listaProdutos.innerHTML = "";
    let subtotal = 0;
    let totalItens = 0;

    itens.forEach((item) => {
        subtotal += item.preco * item.quantidade;
        totalItens += item.quantidade;

        const produto = document.createElement("div");
        produto.classList.add("one-produto");

        produto.innerHTML = `
      <div class="produto-img">
        <img src="${item.imagem}" alt="${item.nome}">
      </div>

      <div class="produto-detalhes">
        <h4>${item.nome}</h4>
        <p>${item.categoria}</p>
      </div>

      <div class="produto-qtd">
        <button class="menos" data-id="${item.id}">−</button>
        <span>${item.quantidade}</span>
        <button class="mais" data-id="${item.id}">+</button>
      </div>

      <div class="produto-preco">
        <p class="total">R$ ${(item.preco * item.quantidade).toFixed(2)}</p>
        <small>R$ ${item.preco.toFixed(2)} cada</small>
      </div>

      <button class="remover" data-id="${item.id}">×</button>
    `;

        listaProdutos.appendChild(produto);
    });

    // Atualiza totais
    subtotalElem.textContent = `R$ ${subtotal.toFixed(2)}`;
    totalElem.textContent = `R$ ${subtotal.toFixed(2)}`;
    quantidadeElem.textContent = `${totalItens} ${totalItens > 1 ? "itens" : "item"} no carrinho`;

    // Adiciona eventos
    adicionarEventos();
}


// =============== EVENTOS DE BOTÕES ===============

function adicionarEventos() {
    // Botão +
    document.querySelectorAll(".mais").forEach((btn) => {
        btn.addEventListener("click", async () => {
            const id = btn.dataset.id;
            await atualizarQuantidade(id, "aumentar");
        });
    });

    // Botão −
    document.querySelectorAll(".menos").forEach((btn) => {
        btn.addEventListener("click", async () => {
            const id = btn.dataset.id;
            await atualizarQuantidade(id, "diminuir");
        });
    });

    // Botão remover
    document.querySelectorAll(".remover").forEach((btn) => {
        btn.addEventListener("click", async () => {
            const id = btn.dataset.id;
            await removerProduto(id);
        });
    });
}


// =============== FUNÇÕES DE AÇÃO (API) ===============

// Atualiza quantidade de um produto
async function atualizarQuantidade(id, acao) {
    try {
        const response = await fetch(`${API_URL}/${id}/${acao}`, { method: "PUT" });
        if (!response.ok) throw new Error("Erro ao atualizar quantidade.");
        const data = await response.json();
        renderizarCarrinho(data.itens);
    } catch (err) {
        console.error(err);
    }
}

// Remove um produto
async function removerProduto(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (!response.ok) throw new Error("Erro ao remover produto.");
        const data = await response.json();
        renderizarCarrinho(data.itens);
    } catch (err) {
        console.error(err);
    }
}


// =============== BOTÕES DO RESUMO ===============

document.getElementById("btn-finalizar").addEventListener("click", () => {
    alert("Pedido finalizado com sucesso! 🍓");
});

document.getElementById("btn-continuar").addEventListener("click", () => {
    window.location.href = "cardapio.html";
});


// =============== INICIALIZAÇÃO ===============

carregarCarrinho();