# rfid-tracking · API

API for **rfid-tracking**, a prototype for inventory management and product tracking with RFID, built as my undergraduate thesis in Information Systems at **PUCRS (2024)**.

> **Thesis:** *Visibilidade da Cadeia de Suprimentos com RFID: um protótipo para gestão de inventário e rastreamento de produtos* (Supply Chain Visibility with RFID: a prototype for inventory management and product tracking)
> **Author:** José Henrique Martins Dotta · **Advisor:** Prof. Dilnei Venturini

| Repository | Role |
| --- | --- |
| [rfid-tracking](https://github.com/JoseMD12/rfid-tracking) | Parent repository: project overview, architecture and how to run everything |
| **tcc-back** (this one) | REST API + WebSocket, business rules and persistence |
| [tcc-front](https://github.com/JoseMD12/tcc-front) | Web dashboard (React) |
| [ESP32-ReadTag](https://github.com/JoseMD12/ESP32-ReadTag) | RFID reader firmware (ESP32 + MFRC522) |

---

## How it works

Each **RFID tag** represents a *product instance* (a physical batch). **Deposits** represent the points of the supply chain (registration, storage, transportation and shipping), and every tag read at a point becomes a **movement event**.

```mermaid
sequenceDiagram
    participant Tag as RFID tag
    participant ESP as ESP32 + MFRC522
    participant API as API (NestJS)
    participant DB as PostgreSQL
    participant Web as Dashboard (React)

    Tag->>ESP: radio-frequency read
    ESP->>API: POST /product/event (deposit + tags)
    API->>DB: records the event if the instance changed deposit
    API-->>Web: WebSocket "event-update"
    Web->>API: reloads indicators and charts
```

Besides tracking, the API handles bulk registration of products, instances, deposits and orders, and provides the dashboard indicators:

- **Occupancy per deposit** (current quantity × maximum capacity)
- **Products per deposit**
- **Movements** in and out throughout the year
- **Negative stock projection**: compares instance balances (FIFO order) against planned orders to anticipate stockouts
- **Excel export** for every registry and chart

## Stack

- **NestJS 10** (TypeScript)
- **Prisma 6** + **PostgreSQL**
- **Socket.IO** for real-time dashboard updates
- **ExcelJS** for reports and **Luxon** for dates

## Data model

```mermaid
erDiagram
    Product ||--o{ ProductInstance : "has"
    Product ||--o{ ProductOrder : "appears in"
    Order ||--o{ ProductOrder : "contains"
    ProductInstance ||--o{ Event : "generates"
    Deposit ||--o{ Event : "receives"

    Product { string id string description }
    ProductInstance { int id int quantity datetime FIFO }
    Event { string id EventType type datetime eventDate }
    Deposit { string id string name EventType type int maxQuantity }
    Order { string id datetime orderDate }
    ProductOrder { string id int quantity }
```

`EventType`: `REGISTRATION`, `DEPOSIT`, `TRANSPORTATION`, `DESTINATION`.

## Endpoints

| Resource | Routes |
| --- | --- |
| Products | `GET /product` · `POST /product/create-many` · `DELETE /product/delete-many` |
| Instances (tags) | `GET /product-instance` · `GET /product-instance/:tagId` · `POST /product-instance` · `POST /product-instance/create-many` · `DELETE /product-instance` |
| Events (reads) | `POST /product/event` · `DELETE /product/event/:id` |
| Deposits | `GET /deposit` · `GET /deposit/type` · `POST /deposit/create-many` · `DELETE /deposit/delete-many` |
| Orders | `GET /order` · `POST /order` · `POST /order/create-many` · `DELETE /order/delete-many` |
| Indicators | `GET /total-inventory` · `GET /total-orders` |
| Charts | `GET /deposit-occupation/:depositId` · `GET /product-by-deposit/:productId?` · `GET /moving-instances` · `GET /stock-projection` |
| Excel export | `GET /excel/product` · `/excel/product-instance` · `/excel/deposit` · `/excel/order` · `/excel/product-by-deposit/:productId?` · `/excel/moving-instances` · `/excel/stock-projection` |
| ESP32 connection test | `GET /rfid` |

Payload sent by the ESP32 on every read:

```json
{
  "actualDepositId": "<id of the deposit where the reader is installed>",
  "tagList": ["<instanceId>-<productId>"]
}
```

## Running locally

Requirements: Node.js 18+, Yarn and a reachable PostgreSQL instance.

> To run the whole project at once, use the [rfid-tracking](https://github.com/JoseMD12/rfid-tracking) parent repository, which includes a `docker-compose.yml` with PostgreSQL and a `.env.example`.

```bash
# 1. Dependencies
yarn install

# 2. Database: create a .env file with the connection string
echo 'DATABASE_URL="postgresql://user:password@localhost:5432/rfid_tracking"' > .env

# 3. Migrations
npx prisma migrate deploy

# 4. API in development mode (port 3000)
yarn dev
```

With the API running, start the [dashboard](https://github.com/JoseMD12/tcc-front) and point the [ESP32 reader](https://github.com/JoseMD12/ESP32-ReadTag) to the machine's IP on the network.

## Limitations and what I would do differently

This is an academic prototype, kept as it was presented. Looking at it today, these are the things I would change:

- **Read processing:** the event service uses `forEach(async ...)`. Because of that, errors for a single tag are not handled, and the WebSocket notification can go out before the events are saved. The right approach is `for...of` with `await` or `Promise.all`, inside a transaction.
- **Tests:** Jest is configured, but there are no automated tests.
- **Configuration:** port, CORS and URLs are hardcoded; there is no `.env.example` or `docker-compose` with PostgreSQL.
- **Security:** there is no authentication on the API or the device, and CORS is fully open (`*`).
- **Hardware:** the MFRC522 (13.56 MHz) reads within a few centimeters and was used to simulate a long-range antenna. A real scenario would call for UHF readers.
