const fastify = require('fastify')({ logger: true });
const cors = require('@fastify/cors');
const mysql = require('@fastify/mysql');
require('dotenv').config();

// =============================================
// CONFIGURAÇÃO DO BANCO DE DADOS
// =============================================
// 1. Certifique-se de que o MySQL está instalado e rodando
// 2. Crie o banco de dados e a tabela executando o script em src/database.sql
// 3. Configure as credenciais no arquivo .env
// 4. A string de conexão deve seguir o formato:
//    mysql://usuario:senha@host:porta/nome_do_banco

// Configuração do CORS
fastify.register(cors, {
  origin: true
});

// Configuração do MySQL
fastify.register(mysql, {
  promise: true,
  connectionString: process.env.DATABASE_URL
});

// =============================================
// ROTAS DA API
// =============================================

// Rota de teste
fastify.get('/', async (request, reply) => {
  return { message: 'API de Gerenciamento de Tarefas' };
});

// Rotas de tarefas
fastify.post('/tarefas', async (request, reply) => {
  const { titulo, descricao, status } = request.body;
  
  try {
    // Obtém uma conexão do pool de conexões
    const connection = await fastify.mysql.getConnection();
    
    // Executa a query de inserção
    const [result] = await connection.execute(
      'INSERT INTO tarefas (titulo, descricao, status) VALUES (?, ?, ?)',
      [titulo, descricao, status]
    );
    
    // Libera a conexão de volta para o pool
    connection.release();
    
    return { 
      id: result.insertId,
      titulo,
      descricao,
      status
    };
  } catch (error) {
    fastify.log.error(error);
    reply.code(500).send({ error: 'Erro ao criar tarefa' });
  }
});

fastify.get('/tarefas', async (request, reply) => {
  try {
    // Obtém uma conexão do pool de conexões
    const connection = await fastify.mysql.getConnection();
    
    // Executa a query de seleção
    const [rows] = await connection.execute('SELECT * FROM tarefas');
    
    // Libera a conexão de volta para o pool
    connection.release();
    
    return rows;
  } catch (error) {
    fastify.log.error(error);
    reply.code(500).send({ error: 'Erro ao buscar tarefas' });
  }
});

// =============================================
// INICIALIZAÇÃO DO SERVIDOR
// =============================================
const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log('Servidor rodando em http://localhost:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start(); 