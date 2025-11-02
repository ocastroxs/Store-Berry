// Verificar login e atualizar botões de login
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🍓 Auth-check iniciado!'); // DEBUG
    
    // Buscar botões pelo ID
    const btnLoginHeader = document.getElementById('btnLoginHeader');
    const btnLoginFooter = document.getElementById('btnLoginFooter');
    
    console.log('Botões encontrados:', { header: !!btnLoginHeader, footer: !!btnLoginFooter }); // DEBUG
    
    // Array com todos os botões encontrados
    const allLoginButtons = [btnLoginHeader, btnLoginFooter].filter(btn => btn !== null);
    
    if (allLoginButtons.length === 0) {
        console.warn('❌ Nenhum botão de login encontrado');
        return;
    }

    try {
        console.log('🔍 Verificando sessão...'); // DEBUG
        const response = await fetch('/conta/api/verificar');
        const data = await response.json();
        
        console.log('✅ Resposta da API:', data); // DEBUG

        // Atualizar TODOS os botões
        allLoginButtons.forEach(btnLogin => {
            if (data.loggedIn) {
                console.log('👤 Usuário logado:', data.userName); // DEBUG
                
                // Usuário está logado
                const isFooter = btnLogin.id === 'btnLoginFooter';
                
                if (isFooter) {
                    // No footer, o texto está dentro de um h3
                    const h3 = btnLogin.querySelector('h3');
                    if (h3) {
                        h3.textContent = data.userName;
                        console.log('✅ Footer atualizado'); // DEBUG
                    }
                } else {
                    // No header, o texto está direto no link
                    btnLogin.textContent = data.userName;
                    console.log('✅ Header atualizado'); // DEBUG
                }
                
                btnLogin.href = '#';
                btnLogin.style.cursor = 'pointer';
                
                // Adicionar evento de clique
                btnLogin.addEventListener('click', (e) => {
                    e.preventDefault();
                    showUserMenu(btnLogin, isFooter);
                });
            } else {
                console.log('❌ Usuário NÃO está logado'); // DEBUG
                
                // Usuário não está logado
                const isFooter = btnLogin.id === 'btnLoginFooter';
                
                if (isFooter) {
                    const h3 = btnLogin.querySelector('h3');
                    if (h3) {
                        h3.textContent = 'Login';
                    }
                } else {
                    btnLogin.textContent = 'Login';
                }
                
                btnLogin.href = '/conta/entrar';
            }
        });
    } catch (error) {
        console.error('❌ Erro ao verificar login:', error);
    }
});

// Função para mostrar menu do usuário
function showUserMenu(btnLogin, isFooter) {
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
        ${isFooter ? 'left: 0;' : 'right: 0;'}
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
    const parent = btnLogin.parentElement;
    parent.style.position = 'relative';
    parent.appendChild(menu);

    // Logout
    document.getElementById('btnLogout').addEventListener('click', async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/conta/api/logout', { method: 'POST' });
            if (response.ok) {
                window.location.href = '/';
            } else {
                alert('Erro ao fazer logout');
            }
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
            alert('Erro ao fazer logout');
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
}