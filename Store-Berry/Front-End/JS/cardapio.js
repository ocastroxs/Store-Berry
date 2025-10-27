const buttons = document.querySelectorAll('.one-titulo button');
        const sections = document.querySelectorAll('.topico-produto');

        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const category = button.getAttribute('data-category');
                buttons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                sections.forEach(section => {
                    if (category === 'all' || section.classList.contains(category)) {
                        section.style.display = 'flex';
                    } else {
                        section.style.display = 'none';
                    }
                });
            });
        });
        document.querySelector('.one-titulo button[data-category="all"]').classList.add('active');