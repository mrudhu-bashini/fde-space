# FDE Accuracy Tracker - Architecture Diagrams

This document provides both the **current architecture** and the **proposed future architecture** for the FDE Accuracy Tracker application.

---

## Current Architecture

### High-Level System Architecture

```mermaid
flowchart TB
    subgraph Client["🖥️ Client Layer"]
        Browser["Web Browser"]
    end

    subgraph Frontend["⚛️ React Frontend (Vite + TypeScript)"]
        Router["React Router DOM"]
        
        subgraph Pages["Pages"]
            Tracker["Tracker Page"]
            Gallery["Gallery Page"]
            Insights["Insights Page"]
            Dashboard["Dashboard Page"]
            Login["Login Page"]
        end
        
        subgraph Components["Shared Components"]
            Layout["Layout"]
            Sidebar["Sidebar"]
            CustomerSelector["Customer Selector"]
            IssueDetailPanel["Issue Detail Panel"]
            Modals["Modals (Add Customer, Add Issue)"]
        end
        
        subgraph State["State Management"]
            Zustand["Zustand Store"]
        end
    end

    subgraph Backend["☁️ Firebase Backend (Optional)"]
        Auth["Firebase Auth"]
        Firestore["Cloud Firestore"]
        Storage["Firebase Storage"]
    end

    Browser --> Router
    Router --> Pages
    Pages --> Components
    Pages --> State
    State --> Firestore
    Modals --> Storage
    Login --> Auth

    style Frontend fill:#e8f5e9
    style Backend fill:#fff3e0
    style Client fill:#e3f2fd
```

### Component Architecture

```mermaid
flowchart LR
    subgraph App["App.tsx"]
        BrowserRouter --> Layout
        Layout --> Sidebar
        Layout --> Outlet["Page Outlet"]
    end

    subgraph PageRoutes["Page Routes"]
        Outlet --> Tracker
        Outlet --> Gallery
        Outlet --> Insights
        Outlet --> Dashboard
    end

    subgraph TrackerPage["Tracker Page Components"]
        Tracker --> CustomerSelector
        Tracker --> IssueDetailPanel
        Tracker --> AddIssueModal
        Tracker --> AddCustomerModal
    end

    CustomerSelector --> useStore["Zustand Store"]
    IssueDetailPanel --> useStore
    AddIssueModal --> useStore
    Tracker --> useStore

    style App fill:#bbdefb
    style PageRoutes fill:#c8e6c9
    style TrackerPage fill:#fff9c4
```

### Data Model

```mermaid
erDiagram
    Customer ||--o{ Issue : contains
    Issue ||--o{ Screenshot : has
    User ||--o{ Issue : reports
    
    Customer {
        string id PK
        string name
        number createdDate
        number issueCount
    }
    
    Issue {
        string id PK
        string customerId FK
        string customerName
        string title
        string category
        string status
        string model
        string workflow
        string executionLogLink
        string issueSummary
        string fix
        number dateAdded
        number lastUpdated
        string reportedBy
    }
    
    Screenshot {
        string id PK
        string url
        string description
        number dateAdded
    }
    
    User {
        string id PK
        string email
        string name
        string role
        number createdAt
    }
```

### Current Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend Framework** | React 19 + TypeScript |
| **Build Tool** | Vite 7 |
| **Styling** | TailwindCSS |
| **State Management** | Zustand |
| **Routing** | React Router DOM v7 |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **Notifications** | React Hot Toast |
| **Backend** | Firebase (Auth, Firestore, Storage) |

---

## Future Architecture (With AI Agents)

### Enhanced System Architecture

```mermaid
flowchart TB
    subgraph Client["🖥️ Client Layer"]
        Browser["Web Browser"]
        ChatUI["Agent Chat Interface"]
    end

    subgraph Frontend["⚛️ React Frontend"]
        Router["React Router DOM"]
        
        subgraph Pages["Enhanced Pages"]
            Tracker["Tracker Page"]
            Gallery["Gallery Page"]
            Insights["Insights Page"]
            Dashboard["Dashboard Page"]
            AgentsHub["🤖 Agents Hub"]
            CloneEnv["🔧 Clone Environment"]
            Solutions["💡 Solutions Lab"]
        end
        
        subgraph AgentPages["AI Agent Interfaces"]
            BaymaxUI["Baymax Agent UI"]
            FyroUI["Fyro Agent UI"]
            ClonerUI["Agent Cloner UI"]
        end
        
        subgraph State["Enhanced State"]
            Zustand["Zustand Store"]
            AgentState["Agent Session State"]
        end
    end

    subgraph AgentLayer["🤖 AI Agent Layer"]
        subgraph Baymax["Baymax Agent"]
            AccuracyAnalyzer["Accuracy Analyzer"]
            FixSuggester["Fix Suggester"]
            PatternDetector["Pattern Detector"]
        end
        
        subgraph Fyro["Fyro Agent"]
            UseCaseAnalyzer["Use Case Analyzer"]
            RequirementExtractor["Requirement Extractor"]
            SolutionDesigner["Solution Designer"]
        end
        
        subgraph Cloner["Agent Cloner"]
            AgentTemplate["Agent Templates"]
            ModelSelector["Model Selector"]
            PromptOptimizer["Prompt Optimizer"]
        end
    end

    subgraph Backend["☁️ Enhanced Backend"]
        Auth["Firebase Auth"]
        Firestore["Cloud Firestore"]
        Storage["Firebase Storage"]
        
        subgraph NewServices["New Services"]
            AgentDB["Agent Configurations DB"]
            CloneRegistry["Clone Registry"]
            SolutionsDB["Solutions Database"]
        end
    end

    subgraph Integrations["🔌 External Integrations"]
        Jira["Jira API"]
        LLMProvider["LLM Provider (OpenAI/Gemini)"]
        ModelRegistry["Model Version Registry"]
    end

    Browser --> Router
    ChatUI --> AgentLayer
    Router --> Pages
    Router --> AgentPages
    Pages --> State
    AgentPages --> AgentLayer
    AgentLayer --> LLMProvider
    AgentLayer --> Firestore
    Baymax --> Firestore
    Fyro --> NewServices
    Cloner --> CloneRegistry
    Tracker --> Jira

    style Frontend fill:#e8f5e9
    style Backend fill:#fff3e0
    style AgentLayer fill:#f3e5f5
    style Integrations fill:#fce4ec
```

### Agent Architecture Detail

```mermaid
flowchart TB
    subgraph BaymaxAgent["🏥 Baymax - Accuracy Issue Analyst"]
        direction TB
        IssueInput["Issue Input"]
        
        subgraph Analysis["Analysis Pipeline"]
            LogParser["Execution Log Parser"]
            ScreenshotAnalyzer["Screenshot Analyzer (Vision)"]
            ContextBuilder["Context Builder"]
        end
        
        subgraph Intelligence["LLM Intelligence"]
            RootCauseAnalysis["Root Cause Analysis"]
            FixGeneration["Fix Generation"]
            SimilarityMatcher["Similar Issue Matcher"]
        end
        
        subgraph Output["Baymax Output"]
            FixSuggestions["Fix Suggestions"]
            PreventionTips["Prevention Tips"]
            ConfidenceScore["Confidence Score"]
        end
        
        IssueInput --> Analysis
        Analysis --> Intelligence
        Intelligence --> Output
    end

    style BaymaxAgent fill:#e3f2fd
```

```mermaid
flowchart TB
    subgraph FyroAgent["🔥 Fyro - New Use Case Analyst"]
        direction TB
        UseCaseInput["New Use Case Request"]
        
        subgraph Extraction["Requirement Extraction"]
            NLPProcessor["NLP Processor"]
            EntityExtractor["Entity Extractor"]
            ConstraintIdentifier["Constraint Identifier"]
        end
        
        subgraph Planning["Solution Planning"]
            FeasibilityChecker["Feasibility Checker"]
            ComplexityEstimator["Complexity Estimator"]
            TimelineGenerator["Timeline Generator"]
        end
        
        subgraph Recommendations["Recommendations"]
            TechStackSuggestion["Tech Stack Suggestion"]
            ResourceEstimate["Resource Estimate"]
            RiskAssessment["Risk Assessment"]
        end
        
        UseCaseInput --> Extraction
        Extraction --> Planning
        Planning --> Recommendations
    end

    style FyroAgent fill:#fff8e1
```

```mermaid
flowchart TB
    subgraph ClonerSystem["🧬 Agent Cloner System"]
        direction TB
        BaseAgent["Base Agent Selection"]
        
        subgraph Customization["Customization Layer"]
            ModelSwitch["Model Version Switch"]
            PromptTuning["Prompt Tuning"]
            ParameterConfig["Parameter Configuration"]
        end
        
        subgraph Environment["Clone Environment"]
            SandboxEnv["Sandbox Environment"]
            TestSuite["Test Suite Runner"]
            PerformanceMonitor["Performance Monitor"]
        end
        
        subgraph Registry["Clone Registry"]
            VersionControl["Version Control"]
            ABTesting["A/B Testing Config"]
            RollbackManager["Rollback Manager"]
        end
        
        BaseAgent --> Customization
        Customization --> Environment
        Environment --> Registry
    end

    style ClonerSystem fill:#f3e5f5
```

### Future Data Model Extension

```mermaid
erDiagram
    Customer ||--o{ Issue : contains
    Issue ||--o{ Screenshot : has
    Issue ||--o{ AgentAnalysis : analyzed_by
    User ||--o{ Issue : reports
    AgentConfig ||--o{ AgentClone : clones
    UseCase ||--o{ Solution : generates
    Customer ||--o{ UseCase : requests
    
    AgentAnalysis {
        string id PK
        string issueId FK
        string agentType
        string rootCause
        string suggestedFix
        number confidenceScore
        timestamp analyzedAt
    }
    
    AgentConfig {
        string id PK
        string name
        string type
        string modelVersion
        json systemPrompt
        json parameters
        boolean isActive
    }
    
    AgentClone {
        string id PK
        string parentAgentId FK
        string name
        string modelVersion
        json customPrompt
        string environment
        boolean isDeployed
    }
    
    UseCase {
        string id PK
        string customerId FK
        string title
        string description
        string status
        string complexity
        timestamp submittedAt
    }
    
    Solution {
        string id PK
        string useCaseId FK
        string approach
        json techStack
        string timeline
        json risks
        string generatedBy
    }
    
    JiraIntegration {
        string id PK
        string issueId FK
        string jiraKey
        string jiraUrl
        string syncStatus
        timestamp lastSynced
    }
```

### Proposed Feature Modules

| Module | Description | Key Components |
|--------|-------------|----------------|
| **🏥 Baymax Agent** | Analyzes accuracy issues and suggests fixes | Issue Parser, Log Analyzer, Fix Generator, Pattern Matcher |
| **🔥 Fyro Agent** | Analyzes new use cases for enterprise customers | Requirement Extractor, Feasibility Checker, Solution Designer |
| **🧬 Agent Cloner** | Clone and customize existing agents | Template Manager, Model Selector, Prompt Editor |
| **🔧 Clone Environment** | Test environments for cloned agents | Sandbox Runner, Performance Monitor, A/B Testing |
| **💡 Solutions Lab** | Central place for new technical solutions | Solution Catalog, Architecture Templates, Best Practices |
| **🔌 Jira Integration** | Sync issues with Jira projects | Issue Mapper, Status Sync, Comment Sync |

---

## Implementation Roadmap

```mermaid
gantt
    title FDE Accuracy Tracker - Feature Roadmap
    dateFormat  YYYY-MM
    
    section Core Enhancements
    Persistent Auth & Data Export    :2026-02, 2026-03
    Advanced Filtering               :2026-03, 2026-04
    Team Collaboration               :2026-04, 2026-05
    
    section AI Agents
    Baymax Agent (MVP)               :2026-03, 2026-05
    Fyro Agent (MVP)                 :2026-05, 2026-07
    
    section Agent Platform
    Agent Cloner                     :2026-06, 2026-08
    Clone Environment                :2026-07, 2026-09
    
    section Integrations
    Jira Integration                 :2026-04, 2026-05
    LLM Provider Integration         :2026-03, 2026-04
    
    section Solutions
    Solutions Lab                    :2026-08, 2026-10
```

---

## API Design for Agents

### Baymax Agent API

```typescript
interface BaymaxAnalysisRequest {
  issueId: string;
  includeScreenshots: boolean;
  includeExecutionLogs: boolean;
  analysisDepth: 'quick' | 'detailed' | 'comprehensive';
}

interface BaymaxAnalysisResponse {
  issueId: string;
  rootCause: string;
  suggestedFixes: Array<{
    fix: string;
    confidence: number;
    effort: 'low' | 'medium' | 'high';
  }>;
  similarIssues: Array<{
    issueId: string;
    similarity: number;
  }>;
  preventionRecommendations: string[];
}
```

### Fyro Agent API

```typescript
interface FyroAnalysisRequest {
  customerId: string;
  useCaseDescription: string;
  constraints?: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
}

interface FyroAnalysisResponse {
  useCaseId: string;
  feasibility: 'feasible' | 'partially_feasible' | 'not_feasible';
  complexityScore: number;
  estimatedTimeline: string;
  recommendedTechStack: string[];
  risks: Array<{
    risk: string;
    severity: 'low' | 'medium' | 'high';
    mitigation: string;
  }>;
  nextSteps: string[];
}
```

---

> [!TIP]
> The agent architecture is designed to be modular. You can start with Baymax for accuracy analysis and incrementally add Fyro and the Agent Cloner as the platform matures.
