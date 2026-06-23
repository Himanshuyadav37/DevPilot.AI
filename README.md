# 🚀 DevPilot AI

### Autonomous Multi-Agent Software Development Platform

DevPilot AI is an Agentic AI-powered software development platform that automates the software development lifecycle using a team of specialized AI agents. Built with LangGraph, LangChain, FastAPI, React, Groq LLMs, ChromaDB, MongoDB, and Docker, the platform enables intelligent project planning, code generation, testing, debugging, deployment planning, and knowledge retrieval through Retrieval-Augmented Generation (RAG).

---

## 📌 Overview

Modern software development involves multiple stakeholders such as project managers, developers, testers, reviewers, and DevOps engineers. DevPilot AI simulates this workflow through a collaborative multi-agent architecture where each AI agent is responsible for a specific task.

The system transforms natural language requirements into structured development workflows, generates code, creates test cases, performs debugging, retrieves relevant knowledge using RAG, and produces deployment strategies.

---

## ✨ Features

### 🤖 Multi-Agent Software Development

DevPilot AI consists of multiple specialized agents:

| Agent            | Responsibility                                 |
| ---------------- | ---------------------------------------------- |
| Supervisor Agent | Controls and coordinates the complete workflow |
| Planner Agent    | Converts requirements into actionable tasks    |
| Coder Agent      | Generates production-ready code                |
| Tester Agent     | Creates test cases and validation strategies   |
| Debugger Agent   | Detects and fixes issues                       |
| Deployer Agent   | Generates deployment recommendations           |

---

### 🧠 Agentic AI Workflows

* LangGraph-based workflow orchestration
* Multi-agent collaboration
* State management
* Conditional routing
* Sequential execution
* Parallel task execution
* Workflow monitoring

---

### 📚 Retrieval-Augmented Generation (RAG)

DevPilot AI leverages RAG to provide context-aware responses and accurate code generation.

#### RAG Pipeline

```text
Documents
    ↓
Chunking
    ↓
Embeddings
    ↓
ChromaDB Vector Store
    ↓
Semantic Retrieval
    ↓
Context Injection
    ↓
LLM Generation
```

Features:

* Semantic search
* Context-aware code generation
* Knowledge retrieval
* Reduced hallucinations
* Source grounding

---

### 🔍 Vector Database & Semantic Search

The platform utilizes ChromaDB as its vector database.

Capabilities:

* Embedding storage
* Similarity search
* Semantic retrieval
* Knowledge indexing
* Fast context lookup

Supported Embeddings:

* HuggingFace Embeddings
* Sentence Transformers

---

### 🛠 Tool Calling

Agents can dynamically invoke tools to perform specialized tasks.

Supported Tool Categories:

* Code generation tools
* Documentation retrieval tools
* API interaction tools
* Database query tools
* Testing tools
* Development utilities

Benefits:

* Improved reasoning
* Enhanced task execution
* Real-world integrations
* Reduced hallucinations

---

### 🧩 Model Context Protocol (MCP)

DevPilot AI follows MCP concepts for structured communication between agents, tools, and external systems.

Capabilities:

* Context sharing
* Tool integration
* Structured communication
* Agent interoperability
* External service connectivity

---

### 🔐 Authentication & Security

* JWT Authentication
* Secure API access
* Protected endpoints
* User session management

---

### 📊 Project Management Dashboard

* Project tracking
* Agent activity monitoring
* Workflow visibility
* Progress tracking
* Development lifecycle management

---

## 🏗 Architecture

```text
                         User
                           │
                           ▼
                    React Frontend
                           │
                           ▼
                     FastAPI Backend
                           │
      ┌────────────────────┼────────────────────┐
      ▼                    ▼                    ▼
   LangGraph            MongoDB             ChromaDB
 Workflow Engine      Data Storage       Vector Storage
      │
      ▼
 ┌───────────────────────┐
 │   Supervisor Agent    │
 └───────────────────────┘
            │
 ┌──────────┼──────────┐
 ▼          ▼          ▼
Planner   Coder      Tester
Agent     Agent      Agent
  │          │          │
  └──────┬───┴────┬─────┘
         ▼        ▼
    Debugger   Deployer
      Agent      Agent
```

---

## 🧰 Tech Stack

### Frontend

* React.js
* JavaScript
* HTML5
* CSS3

### Backend

* FastAPI
* Python
* REST APIs

### AI & Agent Frameworks

* LangChain
* LangGraph
* Multi-Agent Systems
* Agentic AI
* Tool Calling
* MCP (Model Context Protocol)

### Retrieval & Knowledge Systems

* Retrieval-Augmented Generation (RAG)
* ChromaDB
* Vector Search
* Semantic Retrieval
* HuggingFace Embeddings
* Sentence Transformers

### LLM Integration

* Groq API
* Llama Models

### Database

* MongoDB

### Authentication

* JWT Authentication

### DevOps

* Docker
* GitHub Actions
* CI/CD

---

## 📂 Project Structure

```bash
devpilot-ai/
│
├── .github/
│
├── backend/
│   │
│   ├── agents/           # Multi-Agent System
│   ├── api/              # FastAPI Routes
│   ├── auth/             # JWT Authentication
│   ├── core/             # Core Business Logic
│   ├── db/               # MongoDB Configuration
│   ├── llm/              # LLM Integrations
│   ├── rag/              # RAG Pipeline
│   ├── tests/            # Testing Suite
│   │
│   ├── config.py
│   └── main.py
│
├── frontend/
│   │
│   ├── public/
│   │
│   └── src/
│       ├── api/
│       ├── assets/
│       ├── components/
│       ├── context/
│       ├── pages/
│       ├── App.jsx
│       ├── Main.jsx
│       ├── App.css
│       └── Index.css
│
├── .gitignore
├── eslint.config.js
├── package.json
├── package-lock.json
├── index.html
└── README.md
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/Himanshuyadav37/DevPilot-AI.git

cd DevPilot-AI
```

### Create Virtual Environment

```bash
python -m venv venv
```

### Activate Environment

#### Windows

```bash
venv\Scripts\activate
```

#### Linux / Mac

```bash
source venv/bin/activate
```

### Install Backend Dependencies

```bash
pip install -r requirements.txt
```

### Install Frontend Dependencies

```bash
cd frontend

npm install
```

---

## 🔑 Environment Variables

Create a `.env` file:

```env
GROQ_API_KEY=your_groq_api_key

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CHROMA_DB_PATH=./chroma_db
```

---

## ▶️ Running Backend

```bash
cd backend

uvicorn main:app --reload
```

Backend:

```text
http://localhost:8000
```

---

## ▶️ Running Frontend

```bash
cd frontend

npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

## 🐳 Docker Deployment

### Build Docker Image

```bash
docker build -t devpilot-ai .
```

### Run Container

```bash
docker run -p 8000:8000 devpilot-ai
```

---

## 🔄 Workflow Execution

### Step 1

User submits project requirements.

### Step 2

Supervisor Agent analyzes the request.

### Step 3

Planner Agent creates a development roadmap.

### Step 4

Coder Agent generates implementation code.

### Step 5

Tester Agent creates test cases.

### Step 6

Debugger Agent resolves detected issues.

### Step 7

Deployer Agent generates deployment recommendations.

### Step 8

Results are stored and indexed for future retrieval.

---

## 🚀 Future Enhancements

* LangSmith Integration
* Persistent Memory Systems
* GitHub Repository Generation
* Pull Request Automation
* AWS Bedrock Integration
* Kubernetes Deployment
* Multi-LLM Routing
* CrewAI Integration
* Autonomous Deployment Pipelines
* Real-Time Agent Collaboration

---

## 🎯 Use Cases

* AI Software Engineering
* Autonomous Development Workflows
* Requirement Analysis
* Code Generation
* Code Review
* Automated Testing
* Project Planning
* MVP Development
* Architecture Design
* Development Automation

---

## 👨‍💻 Author

### Himanshu Yadav

B.Tech Computer Science Engineering
JECRC University (2027)

#### Connect

* GitHub: https://github.com/Himanshuyadav37
* LinkedIn: https://linkedin.com/in/ydvvhimanshu

---

## ⭐ Support

If you found this project useful:

* Star the repository
* Fork the project
* Create issues
* Submit pull requests

---

## 📜 License

This project is licensed under the MIT License.

© 2026 DevPilot AI. All Rights Reserved.
