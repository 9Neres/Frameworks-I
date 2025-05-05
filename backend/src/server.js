const fastify = require('fastify')({ logger: true });
const cors = require('@fastify/cors');
const mysql = require('@fastify/mysql');
require('dotenv').config();

fastify.register(cors, {
  origin: true
});

fastify.register(mysql, {
  promise: true,
  connectionString: process.env.DATABASE_URL
});

// Rota de teste
fastify.get('/', async (request, reply) => {
  return { message: 'API de Gerenciamento de Tarefas' };
});

// Rotas de tarefas
fastify.post('/tarefas', async (request, reply) => {
  const { titulo, descricao, status } = request.body;
  
  try {
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
    const connection = await fastify.mysql.getConnection();
    
    const [rows] = await connection.execute('SELECT * FROM tarefas');
    
    connection.release();
    
    return rows;
  } catch (error) {
    fastify.log.error(error);
    reply.code(500).send({ error: 'Erro ao buscar tarefas' });
  }
});

// INICIALIZAÇÃO DO SERVIDOR

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
