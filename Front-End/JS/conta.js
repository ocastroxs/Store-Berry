const cpf = document.getElementById('cpf');

// Formatação de CPF
if (cpf) {
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
}

// Animação de carregamento
window.addEventListener("load", () => {
    document.body.classList.add("loaded");
});

document.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", e => {
        if (link.href && !link.href.includes("#") && !link.target) {
            e.preventDefault();
            document.body.classList.remove("loaded");
            setTimeout(() => {
                window.location = link.href;
            }, 350);
        }
    });
});

// Função para mostrar mensagens
function showMessage(message, type = 'error') {
    const oldMessage = document.querySelector('.message-box');
    if (oldMessage) oldMessage.remove();

    const messageBox = document.createElement('div');
    messageBox.className = `message-box ${type}`;
    messageBox.textContent = message;
    messageBox.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        padding: 15px 30px;
        border-radius: 8px;
        font-weight: bold;
        z-index: 9999;
        animation: slideDown 0.3s ease;
        ${type === 'success' ? 'background: #4CAF50; color: white;' : 'background: #f44336; color: white;'}
    `;

    document.body.appendChild(messageBox);

    setTimeout(() => {
        messageBox.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => messageBox.remove(), 300);
    }, 3000);
}

// Lógica de CRIAR CONTA
if (window.location.pathname.includes('criar')) {
    const btnCriar = document.querySelector('.space-button button');
    const inputCpf = document.querySelector('input[placeholder="CPF"]');
    const inputEmail = document.querySelector('input[placeholder="Email"]');
    const inputSenha = document.querySelector('input[placeholder="Senha"]');

    if (btnCriar) {
        btnCriar.addEventListener('click', async () => {
            const cpfValue = inputCpf.value;
            const emailValue = inputEmail.value;
            const senhaValue = inputSenha.value;

            if (!cpfValue || !emailValue || !senhaValue) {
                showMessage('Preencha todos os campos!', 'error');
                return;
            }

            if (senhaValue.length < 6) {
                showMessage('A senha deve ter pelo menos 6 caracteres!', 'error');
                return;
            }

            const cpfLimpo = cpfValue.replace(/\D/g, '');
            if (cpfLimpo.length !== 11) {
                showMessage('CPF inválido!', 'error');
                return;
            }

            try {
                const response = await fetch('/conta/api/registrar', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        cpf: cpfValue,
                        email: emailValue,
                        senha: senhaValue
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    showMessage(data.message, 'success');
                    setTimeout(() => {
                        window.location.href = '/conta/entrar';
                    }, 1500);
                } else {
                    showMessage(data.error, 'error');
                }
            } catch (error) {
                showMessage('Erro ao criar conta. Tente novamente.', 'error');
                console.error(error);
            }
        });
    }
}

// Lógica de ENTRAR NA CONTA (CORRIGIDO)
if (window.location.pathname.includes('entrar')) {
    const btnEntrar = document.querySelector('.space-button button');
    const inputCpf = document.querySelector('input[placeholder="CPF"]');
    const inputEmail = document.querySelector('input[placeholder="Email"]');
    const inputSenha = document.querySelector('input[placeholder="Senha"]');

    if (btnEntrar) {
        btnEntrar.addEventListener('click', async () => {
            const cpfValue = inputCpf.value;
            const emailValue = inputEmail.value;
            const senhaValue = inputSenha.value;

            if ((!cpfValue && !emailValue) || !senhaValue) {
                showMessage('Preencha CPF/Email e Senha!', 'error');
                return;
            }

            try {
                const response = await fetch('/conta/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        cpf: cpfValue,
                        email: emailValue,
                        senha: senhaValue
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    showMessage(data.message, 'success');
                    // AGUARDAR MAIS TEMPO para garantir que a sessão foi salva
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 1500); // Aumentado de 1000 para 1500ms
                } else {
                    showMessage(data.error, 'error');
                }
            } catch (error) {
                showMessage('Erro ao fazer login. Tente novamente.', 'error');
                console.error(error);
            }
        });
    }
}

// Adicionar estilo de animação
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
        to { transform: translateX(-50%) translateY(0); opacity: 1; }
    }
    @keyframes slideUp {
        from { transform: translateX(-50%) translateY(0); opacity: 1; }
        to { transform: translateX(-50%) translateY(-100%); opacity: 0; }
    }
`;
document.head.appendChild(style);