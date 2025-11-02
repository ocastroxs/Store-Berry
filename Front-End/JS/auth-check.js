// Verificar login e atualizar botões de login
document.addEventListener('DOMContentLoaded', async () => {
    const btnLoginHeader = document.getElementById('btnLoginHeader');
    const btnLoginFooter = document.getElementById('btnLoginFooter');
    
    const allLoginButtons = [btnLoginHeader, btnLoginFooter].filter(btn => btn !== null);
    
    if (allLoginButtons.length === 0) return;

    try {
        const response = await fetch('/conta/api/verificar');
        const data = await response.json();

        allLoginButtons.forEach(btnLogin => {
            if (data.loggedIn) {
                const isFooter = btnLogin.id === 'btnLoginFooter';
                
                if (isFooter) {
                    const h3 = btnLogin.querySelector('h3');
                    if (h3) {
                        h3.textContent = data.userName;
                    }
                } else {
                    btnLogin.textContent = data.userName;
                }
                
                btnLogin.href = '#';
                btnLogin.style.cursor = 'pointer';
                
                btnLogin.addEventListener('click', (e) => {
                    e.preventDefault();
                    showUserMenu(btnLogin, isFooter);
                });
            } else {
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
        console.error('Erro ao verificar login:', error);
    }
});

// Função para mostrar menu do usuário
function showUserMenu(btnLogin, isFooter) {
    const oldMenu = document.querySelector('.user-dropdown-menu');
    if (oldMenu) {
        oldMenu.remove();
        return;
    }

    const menu = document.createElement('div');
    menu.className = 'user-dropdown-menu';
    menu.innerHTML = `
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

    const parent = btnLogin.parentElement;
    parent.style.position = 'relative';
    parent.appendChild(menu);

    document.getElementById('btnLogout').addEventListener('click', async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/conta/api/logout', { method: 'POST' });
            if (response.ok) {
                window.location.href = '/';
            }
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    });

    setTimeout(() => {
        document.addEventListener('click', (e) => {
            if (!menu.contains(e.target) && e.target !== btnLogin) {
                menu.remove();
            }
        }, { once: true });
    }, 0);
}