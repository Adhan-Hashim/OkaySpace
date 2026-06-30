/**
 * OkaySpace Client-side Vector Database Engine
 * Implements local cosine similarity searches for Semantic Memory (Local Vector RAG)
 */

export interface EchoMemory {
  id: number;
  user: string;
  assistant: string;
  embedding: number[];
  timestamp: string;
}

/**
 * Calculates the cosine similarity between two numeric vectors
 * Cosine Similarity = (A . B) / (||A|| * ||B||)
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    console.warn("Vector length mismatch in cosineSimilarity computation:", vecA.length, vecB.length);
    return 0;
  }
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Queries local semantic memories to retrieve the most relevant past interactions
 */
export function querySemanticMemory(
  queryEmbedding: number[],
  memories: EchoMemory[],
  limit = 2,
  threshold = 0.70
): EchoMemory[] {
  if (!queryEmbedding || memories.length === 0) return [];

  const scored = memories
    .map(mem => ({
      ...mem,
      similarity: cosineSimilarity(queryEmbedding, mem.embedding)
    }))
    .filter(mem => mem.similarity >= threshold)
    .sort((a, b) => b.similarity - a.similarity);

  return scored.slice(0, limit);
}
