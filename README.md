# CodePulse AI

CodePulse AI is an AI-powered developer tool for **code generation, AI-powered code analysis, and JavaScript static analysis**.

It combines LLM-based developer assistance with ESLint to help developers understand their code, identify potential issues, generate code, and receive actionable improvement suggestions.

## Features

* 🤖 AI-powered code generation
* 🔍 AI-powered code analysis
* 🧹 JavaScript static analysis with ESLint
* 💡 Code improvement suggestions
* 🐛 Potential bug and code-quality issue detection
* 📝 AI-generated code summaries
* 🧪 Unit test generation
* 📚 Documentation and docstring generation
* 🗂️ Request and analysis history
* 🔀 LLM provider routing
* ⚡ Groq integration for code generation
* 🌐 OpenRouter integration for code analysis
* 🐘 PostgreSQL database
* 🐳 Docker-based PostgreSQL development environment
* 🔐 Environment-based API configuration
* ⚛️ React frontend
* 🟢 Node.js and Express.js backend

---

## Architecture

```text
                         CodePulse AI
                              │
                ┌─────────────┴─────────────┐
                │                           │
             Frontend                    Backend
              React                   Node.js/Express
                │                           │
                │                    ┌──────┴──────┐
                │                    │             │
                │                 LLM Router   Static Analysis
                │                    │             │
                │              ┌─────┴─────┐     ESLint
                │              │           │
                │            Groq      OpenRouter
                │              │           │
                │              └─────┬─────┘
                │                    │
                │              AI Services
                │
                └────────────── API
                              │
                              ▼
                         PostgreSQL
                              │
                           Docker
```

---

## AI Provider Architecture

CodePulse AI uses different AI providers for different tasks.

### Code Generation

Groq handles AI-powered generation tasks:

* Boilerplate generation
* Unit test generation
* Documentation and docstring generation

```text
/generate
    ↓
LLM Model Router
    ↓
Groq Provider
    ↓
Groq API
```

### Code Analysis

OpenRouter handles AI-powered code analysis.

```text
/analyze
    ↓
LLM Model Router
    ↓
OpenRouter Provider
    ↓
OpenRouter API
```

### Static Analysis

The `/analyze` endpoint also performs static analysis independently using ESLint.

```text
/analyze
    │
    ├── AI Analysis
    │      └── OpenRouter
    │
    └── Static Analysis
           └── ESLint
                └── JavaScript
```

AI analysis and static analysis are executed independently, so a failure in one does not prevent the other from returning results.

---

## AI Code Analysis

The AI analysis produces structured results containing:

```json
{
  "summary": "Overall explanation of the code.",
  "issues": [],
  "suggestions": []
}
```

The frontend converts this structured response into a human-readable interface instead of displaying raw JSON.

Example:

```text
AI Analysis

Summary

The code correctly calculates the sum of the numbers
using reduce and produces the expected result.

Issues

No issues found.

Suggestions

1. Use more descriptive variable names.
2. Remove unnecessary console.log statements
   from production code.
```

### Analysis Capabilities

The AI can provide feedback related to:

* Functional issues
* Potential bugs
* Security concerns
* Performance considerations
* Code quality
* Readability
* Maintainability
* Improvement suggestions

AI-generated feedback is intended to assist developers and should be reviewed before being applied to production code.

---

## Static Analysis

Static analysis is currently implemented using **ESLint for JavaScript**.

ESLint can detect and report:

* Syntax errors
* ESLint rule violations
* JavaScript module parsing issues
* Code-quality problems
* Severity levels
* Line numbers
* Column numbers

### Current Language Support

| Language   | AI Analysis | Static Analysis |
| ---------- | ----------- | --------------- |
| JavaScript | ✅           | ✅ ESLint        |
| Python     | ✅           | ❌               |
| Java       | ✅           | ❌               |

AI analysis and static analysis are separate capabilities. Python and Java code can be submitted for AI analysis, but dedicated static-analysis support is currently available only for JavaScript.

---

## Tech Stack

### Frontend

* React
* JavaScript
* Axios
* CSS

### Backend

* Node.js
* Express.js
* JavaScript
* REST APIs

### AI

* Groq
* OpenRouter

### Static Analysis

* ESLint

### Database

* PostgreSQL
* Docker
* Repository-based data access

### Development

* npm
* Nodemon
* Docker Compose

---

## Project Structure

```text
CodePulse-AI/
│
├── backend/
│   ├── src/
│   │   ├── controller/
│   │   │   ├── analyze.controller.js
│   │   │   ├── generate.controller.js
│   │   │   └── history.controller.js
│   │   │
│   │   ├── repositories/
│   │   │   └── request.repository.js
│   │   │
│   │   ├── routes/
│   │   │   └── generate.routes.js
│   │   │
│   │   ├── services/
│   │   │   ├── analysis/
│   │   │   │   └── eslint.service.js
│   │   │   │
│   │   │   ├── llm/
│   │   │   │   ├── groq.provider.js
│   │   │   │   ├── openrouter.provider.js
│   │   │   │   └── model.router.js
│   │   │   │
│   │   │   └── analyze.service.js
│   │   │
│   │   └── server.js
│   │
│   ├── eslint.config.mjs
│   ├── nodemon.json
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   └── pages/
│   │
│   └── package.json
│
├── docker-compose.yaml
├── .env.exa
```
