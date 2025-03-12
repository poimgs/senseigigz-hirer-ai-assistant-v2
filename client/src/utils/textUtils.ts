// Types for diff results
export interface DiffResult {
  type: 'unchanged' | 'addition' | 'deletion';
  text: string;
  startPos: number;
  endPos: number;
}

/**
 * Splits text into words while preserving punctuation
 */
const splitIntoWords = (text: string): string[] => {
  if (!text) return [];
  return text.split(/\s+/).filter(Boolean);
};

/**
 * Sophisticated diff algorithm using a hierarchical approach to find text differences
 * at paragraph, sentence, and word levels.
 * 
 * @param original - The original text
 * @param suggested - The suggested/modified text
 * @returns Array of DiffResult objects containing position and type information
 */
export const findTextDifferences = (original: string, suggested: string): DiffResult[] => {
  if (!original || !suggested) return [];
  
  // Split text into paragraphs first to better handle document structure
  const originalParagraphs = original.split(/\n\s*\n/);
  const suggestedParagraphs = suggested.split(/\n\s*\n/);
  
  let result: DiffResult[] = [];
  let currentPos = 0;
  
  // Process each paragraph
  for (let i = 0; i < Math.max(originalParagraphs.length, suggestedParagraphs.length); i++) {
    const origPara = i < originalParagraphs.length ? originalParagraphs[i] : '';
    const suggPara = i < suggestedParagraphs.length ? suggestedParagraphs[i] : '';
    
    if (origPara === suggPara) {
      // Paragraph unchanged
      result.push({
        type: 'unchanged',
        text: origPara,
        startPos: currentPos,
        endPos: currentPos + origPara.length
      });
      currentPos += origPara.length + 2; // +2 for paragraph break
      continue;
    }
    
    // Split paragraphs into sentences for more granular diff
    const origSentences = origPara.split(/(?<=[.!?])\s+/);
    const suggSentences = suggPara.split(/(?<=[.!?])\s+/);
    
    let sentencePos = currentPos;
    
    for (let j = 0; j < Math.max(origSentences.length, suggSentences.length); j++) {
      const origSent = j < origSentences.length ? origSentences[j] : '';
      const suggSent = j < suggSentences.length ? suggSentences[j] : '';
      
      if (origSent === suggSent) {
        // Sentence unchanged
        result.push({
          type: 'unchanged',
          text: origSent + ' ',
          startPos: sentencePos,
          endPos: sentencePos + origSent.length + 1
        });
        sentencePos += origSent.length + 1; // +1 for space
      } else if (origSent && !suggSent) {
        // Sentence deleted
        result.push({
          type: 'deletion',
          text: origSent + ' ',
          startPos: sentencePos,
          endPos: sentencePos + origSent.length + 1
        });
        sentencePos += origSent.length + 1;
      } else if (!origSent && suggSent) {
        // Sentence added
        result.push({
          type: 'addition',
          text: suggSent + ' ',
          startPos: sentencePos,
          endPos: sentencePos + suggSent.length + 1
        });
        sentencePos += suggSent.length + 1;
      } else {
        // Sentence modified - compare words
        const origWords = splitIntoWords(origSent);
        const suggWords = splitIntoWords(suggSent);
        
        let wordPos = sentencePos;
        
        for (let k = 0; k < Math.max(origWords.length, suggWords.length); k++) {
          const origWord = k < origWords.length ? origWords[k] : '';
          const suggWord = k < suggWords.length ? suggWords[k] : '';
          
          if (origWord === suggWord) {
            // Word unchanged
            result.push({
              type: 'unchanged',
              text: origWord + ' ',
              startPos: wordPos,
              endPos: wordPos + origWord.length + 1
            });
            wordPos += origWord.length + 1; // +1 for space
          } else if (origWord && !suggWord) {
            // Word deleted
            result.push({
              type: 'deletion',
              text: origWord + ' ',
              startPos: wordPos,
              endPos: wordPos + origWord.length + 1
            });
            wordPos += origWord.length + 1;
          } else if (!origWord && suggWord) {
            // Word added
            result.push({
              type: 'addition',
              text: suggWord + ' ',
              startPos: wordPos,
              endPos: wordPos + suggWord.length + 1
            });
            wordPos += suggWord.length + 1;
          } else {
            // Word modified
            result.push({
              type: 'deletion',
              text: origWord + ' ',
              startPos: wordPos,
              endPos: wordPos + origWord.length + 1
            });
            result.push({
              type: 'addition',
              text: suggWord + ' ',
              startPos: wordPos,
              endPos: wordPos + suggWord.length + 1
            });
            wordPos += Math.max(origWord.length, suggWord.length) + 1;
          }
        }
        
        sentencePos = wordPos;
      }
    }
    
    currentPos = sentencePos + 2; // +2 for paragraph break
  }
  
  return result;
};
