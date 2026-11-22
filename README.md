# rfid-tracking · API

API do **rfid-tracking**, protótipo de gestão de inventário e rastreamento de produtos com RFID, desenvolvido como Trabalho de Conclusão do curso de Sistemas de Informação da **PUCRS (2024)**.

> **TCC:** *Visibilidade da Cadeia de Suprimentos com RFID: um protótipo para gestão de inventário e rastreamento de produtos*
> **Autor:** José Henrique Martins Dotta · **Orientador:** Prof. Dilnei Venturini

| Repositório | Papel |
| --- | --- |
| **tcc-back** (este) | API REST + WebSocket, regras de negócio e persistência |
| [tcc-front](https://github.com/JoseMD12/tcc-front) | Dashboard web (React) |
| [ESP32-ReadTag](https://github.com/JoseMD12/ESP32-ReadTag) | Firmware do leitor RFID (ESP32 + MFRC522) |

---

## Como funciona

Cada **etiqueta RFID** representa uma *instância de produto* (um lote físico). Os **depósitos** representam os pontos da cadeia (registro, depósito, transporte e expedição), e cada leitura de etiqueta em um ponto vira um **evento de movimentação**.

```mermaid
sequenceDiagram
    participant Tag as Etiqueta RFID
    participant ESP as ESP32 + MFRC522
    participant API as API (NestJS)
    participant DB as PostgreSQL
    participant Web as Dashboard (React)

    Tag->>ESP: leitura por radiofrequência
    ESP->>API: POST /product/event (depósito + etiquetas)
    API->>DB: registra o evento se a instância mudou de depósito
    API-->>Web: WebSocket "event-update"
    Web->>API: recarrega indicadores e gráficos
```

Além do rastreio, a API cobre o cadastro em lote de produtos, instâncias, depósitos e pedidos, e gera os indicadores do dashboard:

- **Ocupação por depósito** (quantidade atual × capacidade máxima)
- **Produtos por depósito**
- **Movimentação** de entrada e saída ao longo do ano
- **Projeção de estoque negativo**: cruza o saldo das instâncias (ordem FIFO) com os pedidos planejados para antecipar rupturas
- **Exportação para Excel** de todos os cadastros e gráficos

## Stack

- **NestJS 10** (TypeScript)
- **Prisma 6** + **PostgreSQL**
- **Socket.IO** para atualização do dashboard em tempo real
- **ExcelJS** para os relatórios e **Luxon** para datas

## Modelo de dados

```mermaid
erDiagram
    Product ||--o{ ProductInstance : "tem"
    Product ||--o{ ProductOrder : "aparece em"
    Order ||--o{ ProductOrder : "contém"
    ProductInstance ||--o{ Event : "gera"
    Deposit ||--o{ Event : "recebe"

    Product { string id string description }
    ProductInstance { int id int quantity datetime FIFO }
    Event { string id EventType type datetime eventDate }
    Deposit { string id string name EventType type int maxQuantity }
    Order { string id datetime orderDate }
    ProductOrder { string id int quantity }
```

`EventType`: `REGISTRATION`, `DEPOSIT`, `TRANSPORTATION`, `DESTINATION`.

## Endpoints

| Recurso | Rotas |
| --- | --- |
| Produtos | `GET /product` · `POST /product/create-many` · `DELETE /product/delete-many` |
| Instâncias (etiquetas) | `GET /product-instance` · `GET /product-instance/:tagId` · `POST /product-instance` · `POST /product-instance/create-many` · `DELETE /product-instance` |
| Eventos (leituras) | `POST /product/event` · `DELETE /product/event/:id` |
| Depósitos | `GET /deposit` · `GET /deposit/type` · `POST /deposit/create-many` · `DELETE /deposit/delete-many` |
| Pedidos | `GET /order` · `POST /order` · `POST /order/create-many` · `DELETE /order/delete-many` |
| Indicadores | `GET /total-inventory` · `GET /total-orders` |
| Gráficos | `GET /deposit-occupation/:depositId` · `GET /product-by-deposit/:productId?` · `GET /moving-instances` · `GET /stock-projection` |
| Exportação (Excel) | `GET /excel/product` · `/excel/product-instance` · `/excel/deposit` · `/excel/order` · `/excel/product-by-deposit/:productId?` · `/excel/moving-instances` · `/excel/stock-projection` |
| Teste de conexão do ESP32 | `GET /rfid` |

Payload enviado pelo ESP32 a cada leitura:

```json
{
  "actualDepositId": "<id do depósito onde o leitor está>",
  "tagList": ["<idInstancia>-<idProduto>"]
}
```

## Como rodar

Pré-requisitos: Node.js 18+, Yarn e um PostgreSQL acessível.

```bash
# 1. Dependências
yarn install

# 2. Banco de dados: crie um arquivo .env com a conexão
echo 'DATABASE_URL="postgresql://usuario:senha@localhost:5432/rfid_tracking"' > .env

# 3. Migrations
npx prisma migrate deploy

# 4. API em modo desenvolvimento (porta 3000)
yarn dev
```

Com a API no ar, suba o [dashboard](https://github.com/JoseMD12/tcc-front) e configure o [leitor ESP32](https://github.com/JoseMD12/ESP32-ReadTag) apontando para o IP da máquina na rede.

## Limitações e o que eu faria diferente

Este é um protótipo acadêmico, mantido como foi apresentado. Olhando hoje, os pontos que eu mudaria:

- **Processamento das leituras:** o serviço de eventos usa `forEach(async ...)`. Com isso, erros de uma etiqueta não são tratados e o aviso por WebSocket pode sair antes de os eventos serem gravados. O certo seria `for...of` com `await` ou `Promise.all`, dentro de uma transação.
- **Testes:** o Jest está configurado, mas não há testes automatizados.
- **Configuração:** porta, CORS e URLs estão fixos no código; faltam `.env.example` e um `docker-compose` com o PostgreSQL.
- **Segurança:** não há autenticação na API nem no dispositivo, e o CORS está aberto (`*`).
- **Hardware:** o MFRC522 (13,56 MHz) tem alcance de poucos centímetros e foi usado para simular uma antena de longo alcance. Um cenário real pediria leitores UHF.
