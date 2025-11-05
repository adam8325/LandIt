// const API_BASE_URL = 'https://localhost:7131/api';

// export interface IdeasRequest {
//   sessionId: string;
//   motivation: string;
//   experience: string;
// }

// export interface IdeasResponse {
//   ideas: string[];
// }

// export const ideasService = {
//   async updateIdeas(request: IdeasRequest): Promise<void> {
//     const response = await fetch(`${API_BASE_URL}/Ideas/update`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(request),
//     });
//     if (!response.ok) {
//       const errorText = await response.text();
//       throw new Error(`HTTP ${response.status}: ${errorText}`);
//     }
//   },

//  async generateIdeas(sessionId: string, type: "motivation" | "experience"): Promise<IdeasResponse> {
//     const response = await fetch(`${API_BASE_URL}/Ideas/generate/${sessionId}/${type}`);
//     if (!response.ok) {
//       const errorText = await response.text();
//       throw new Error(`HTTP ${response.status}: ${errorText}`);
//     }
//     return await response.json();
//   }
// };
