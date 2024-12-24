graph TD
    subgraph Client Layer
        WA[Web App - React]
        MA[Mobile App - Flutter]
        AD[Admin Dashboard]
    end

    subgraph API Gateway
        AG[AWS API Gateway]
    end

    subgraph Microservices
        UMS[User Management Service]
        SAS[Skills Assessment Service]
        CPS[Career Path Service]
        LMS[Learning Management Service]
        JMS[Job Market Service]
        NS[Networking Service]
        CMS[Content Management Service]
        AS[Analytics Service]
    end

    subgraph Databases
        PSQL[(PostgreSQL)]
        MONGO[(MongoDB)]
        REDIS[(Redis)]
        ES[(Elasticsearch)]
        NEO[(Neo4j)]
        CH[(ClickHouse)]
    end

    subgraph External Services
        TP[Third Party APIs]
        PG[Payment Gateway]
        LP[Learning Platforms]
        JB[Job Boards]
    end

    %% Client to Gateway Connections
    WA --> AG
    MA --> AG
    AD --> AG

    %% Gateway to Microservices
    AG --> UMS
    AG --> SAS
    AG --> CPS
    AG --> LMS
    AG --> JMS
    AG --> NS
    AG --> CMS
    AG --> AS

    %% Microservices to Databases
    UMS --> PSQL
    SAS --> MONGO
    CPS --> PSQL
    LMS --> PSQL & MONGO
    JMS --> MONGO
    NS --> NEO
    CMS --> MONGO
    AS --> CH

    %% Cache Connections
    UMS --> REDIS
    LMS --> REDIS
    JMS --> REDIS

    %% Search Connections
    CMS --> ES
    JMS --> ES

    %% External Service Connections
    JMS --> JB
    LMS --> LP
    UMS --> PG
    CPS --> TP
