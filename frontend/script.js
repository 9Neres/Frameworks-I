const API_URL = 'http://localhost:3000';

// Elementos do DOM vsfd raykaaa

const tarefaForm = document.getElementById('tarefaForm');
const listaTarefas = document.getElementById('listaTarefas');

async function carregarTarefas() {
    try {
        const response = await fetch(`${API_URL}/tarefas`);
        const tarefas = await response.json();
        
        listaTarefas.innerHTML = '';
        
        tarefas.forEach(tarefa => {
            const tarefaElement = document.createElement('div');
            tarefaElement.className = 'tarefa-item';
            
            const statusClass = `status-${tarefa.status}`;
            const statusConfig = {
                'pendente': {
                    text: 'Pendente',
                    icon: 'fa-clock'
                },
                'em_andamento': {
                    text: 'Em Andamento',
                    icon: 'fa-spinner fa-spin'
                },
                'concluida': {
                    text: 'Concluída',
                    icon: 'fa-check-circle'
                }
            }[tarefa.status];
            
            tarefaElement.innerHTML = `
                <div class="tarefa-titulo">${tarefa.titulo}</div>
                <div class="tarefa-descricao">${tarefa.descricao}</div>
                <span class="tarefa-status ${statusClass}">
                    <i class="fas ${statusConfig.icon}"></i>
                    ${statusConfig.text}
                </span>
            `;
            
            listaTarefas.appendChild(tarefaElement);
        });
    } catch (error) {
        console.error('Erro ao carregar tarefas:', error);
        alert('Erro ao carregar tarefas. Por favor, tente novamente.');
    }
}

// Função para criar uma nova tarefa
async function criarTarefa(event) {
    event.preventDefault();
    
    const formData = new FormData(tarefaForm);
    const tarefa = {
        titulo: formData.get('titulo'),
        descricao: formData.get('descricao'),
        status: formData.get('status')
    };
    
    try {
        const response = await fetch(`${API_URL}/tarefas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tarefa)
        });
        
        if (!response.ok) {
            throw new Error('Erro ao criar tarefa');
        }
        
        tarefaForm.reset();
        
        await carregarTarefas();
        
        // Mostrar mensagem de sucesso
        const mensagem = document.createElement('div');
        mensagem.className = 'mensagem-sucesso';
        mensagem.innerHTML = '<i class="fas fa-check-circle"></i> Tarefa criada com sucesso!';
        document.body.appendChild(mensagem);
        
        setTimeout(() => {
            mensagem.remove();
        }, 3000);
    } catch (error) {
        console.error('Erro ao criar tarefa:', error);
        alert('Erro ao criar tarefa. Por favor, tente novamente.');
    }
}
tarefaForm.addEventListener('submit', criarTarefa);

carregarTarefas(); 
