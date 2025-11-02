// Verificar login e atualizar botão
document.addEventListener('DOMContentLoaded', async () => {
    const btnLogin = document.querySelector('a[href*="conta"]'); // Ajuste o seletor conforme seu botão
    
    if (!btnLogin) return;

    try {
        const response = await fetch('/conta/api/verificar');
        const data = await response.json();

        if (data.loggedIn) {
            // Usuário está logado
            btnLogin.textContent = data.userName;
            btnLogin.href = '#';
            
            // Criar menu dropdown ao clicar
            btnLogin.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove menu existente
                const oldMenu = document.querySelector('.user-dropdown-menu');
                if (oldMenu) {
                    oldMenu.remove();
                    return;
                }

                // Criar menu
                const menu = document.createElement('div');
                menu.className = 'user-dropdown-menu';
                menu.innerHTML = `
                    <a href="/conta/perfil">Minha Conta</a>
                    <a href="#" id="btnLogout">Sair</a>
                `;
                menu.style.cssText = `
                    position: absolute;
                    background: white;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    padding: 10px 0;
                    min-width: 150px;
                    z-index: 1000;
                    margin-top: 10px;
                `;

                // Estilizar links do menu
                menu.querySelectorAll('a').forEach(link => {
                    link.style.cssText = `
                        display: block;
                        padding: 10px 20px;
                        color: #333;
                        text-decoration: none;
                        transition: background 0.2s;
                    `;
                    link.addEventListener('mouseenter', () => {
                        link.style.background = '#f5f5f5';
                    });
                    link.addEventListener('mouseleave', () => {
                        link.style.background = 'transparent';
                    });
                });

                // Posicionar menu
                btnLogin.parentElement.style.position = 'relative';
                btnLogin.parentElement.appendChild(menu);

                // Logout
                document.getElementById('btnLogout').addEventListener('click', async (e) => {
                    e.preventDefault();
                    try {
                        await fetch('/conta/api/logout', { method: 'POST' });
                        window.location.reload();
                    } catch (error) {
                        console.error('Erro ao fazer logout:', error);
                    }
                });

                // Fechar menu ao clicar fora
                setTimeout(() => {
                    document.addEventListener('click', (e) => {
                        if (!menu.contains(e.target) && e.target !== btnLogin) {
                            menu.remove();
                        }
                    }, { once: true });
                }, 0);
            });
        } else {
            // Usuário não está logado
            btnLogin.textContent = 'Login';
            btnLogin.href = '/conta/entrar';
        }
    } catch (error) {
        console.error('Erro ao verificar login:', error);
    }
});