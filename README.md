# 🚀 LandIt

## Kort og godt
- LandIt er din AI-assistent til jobsøgning, og indeholder alt, hvad du har brug for til jobsøgningen.
- Prøv selv appen og se om du kan LandIt: 

## Vigtigste features
- Generér komplet ansøgning + e-mail-udkast og match-score.
- Generér skræddersyede interviewspørgsmål, elevator pitch og estimeret løn.
- Simuler interview og få professionel AI-evaluering og feedback af dine svar.
- Transskribér audio (Whisper/OpenAI audio endpoint).

## Teknologier og libraries
- Backend: RESTful API, .NET 9 (C#), System.Text.Json, HttpClient  
- AI: OpenAI / Chat completions + audio transcriptions med Whisper (konfigureres via OPENAI_API_KEY) — klient i [src/API/Program.cs](src/API/Program.cs)  
- Filbehandling: iText (PDF), DocumentFormat.OpenXml (DOCX) — implementeret i [FileProcessing.cs](src/Infrastructure/Services/FileProcessing.cs)  
- Validering: FluentValidation  
- Frontend: React, Typescript, Vite, Tailwind CSS (styling), axios (API kald), React Router, Lucide, Aceternity UI 
- Test: xUnit, Moq (backend tests)

## Designprincipper
- DRY — Don’t Repeat Yourself: undgå duplikation af state/handlers og prompt‑logik; centraliser fælles UI/state i en hook (fx src/Web/Hooks/useFileInput.ts) og prompt/parsing i Infrastructure (fx src/Infrastructure/Services/AIService.cs).
- SRP — Single Responsibility Principle: hver klasse/funktion skal have ét ansvar (fx lad InterviewPrompts.cs kun bygge prompts, og FileProcessing.cs kun ekstraktere tekst).
- SOC — Separation of Concerns: hold kontrakter/DTO’er i Application og implementeringer i Infrastructure (se Application vs src/Infrastructure).
- DIP — Dependency Inversion Principle: services i Application skal afhænge af interfaces (fx IAIService) defineret i Application og registreres med implementations i API/composition root (src/API/Program.cs).
- KISS — Keep It Simple, Stupid: hold prompt‑tekster og parsing klar og robuste

## Arkitektur (kort)
- src/API — Web API med Controller Endpoints / composition root (DI + Program.cs)  
  - [src/API/Program.cs](src/API/Program.cs)
- src/Application — Abstraktioner, DTO'er, validering og services (forretningslaget)  
  - Interfaces og DTOs f.eks. [src/Application/Interfaces/IFileProcessing.cs](src/Application/Interfaces/IFileProcessing.cs), [src/Application/DTOs/Application/GeneratedApplicationDto.cs](src/Application/DTOs/Application/GeneratedApplicationDto.cs)
  - Services: [src/Application/Services/ApplicationService.cs](src/Application/Services/ApplicationService.cs), [src/Application/Services/InterviewService.cs](src/Application/Services/InterviewService.cs)
- src/Infrastructure — Implementeringer for eksterne integrationer (OpenAI, fil-behandling, prompt-logic)  
  - OpenAI / prompt + parsing: [src/Infrastructure/Services/AIService.cs](src/Infrastructure/Services/AIService.cs)  
  - Fil-ekstraktion (PDF/DOCX): [src/Infrastructure/Services/FileProcessing.cs](src/Infrastructure/Services/FileProcessing.cs)  
  - Prompts: [src/Infrastructure/Prompts/ApplicationPrompt.cs](src/Infrastructure/Prompts/ApplicationPrompt.cs), [src/Infrastructure/Prompts/InterviewPrompts.cs](src/Infrastructure/Prompts/InterviewPrompts.cs)
- src/Web — Frontend (Vite, React, TypeScript/JSX, Tailwind)
  - Sider: [src/Web/Pages/ApplicationPage.tsx](src/Web/Pages/ApplicationPage.tsx), [src/Web/Pages/InterviewPage.tsx](src/Web/Pages/InterviewPage.tsx)
  - Genbrugelige komponenter: [src/Web/Components/FileInputSection.tsx](src/Web/Components/FileInputSection.tsx), [src/Web/Components/InterviewSimulation.tsx](src/Web/Components/InterviewSimulation.tsx)
  - Hooks: [src/Web/Hooks/useFileInput.ts](src/Web/Hooks/useFileInput.ts)
- Tests — xUnit / integration tests (dotnet) og JS tests hvis tilføjet: `Tests/*`

## Kør projektet lokalt
- Backend:
  - Konfigurer miljøvariabler (fx OPENAI_API_KEY i .env eller system env). Se [src/API/Program.cs](src/API/Program.cs).
  - Build & run:
    - dotnet restore
    - dotnet build
    - dotnet run --project src/API
- Frontend:
  - Gå til `src/Web`
  - npm install
  - Anbefalet Node LTS (>=18)
  - npm run dev
- Tests:
  - dotnet test Tests/*
