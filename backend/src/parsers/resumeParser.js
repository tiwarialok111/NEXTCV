import fs from 'fs';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import path from 'path';

export const parseResumeFile = async (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  let text = '';

  try {
    if (ext === '.pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      text = data.text;
    } else if (ext === '.docx' || ext === '.doc') {
      const result = await mammoth.extractRawText({ path: filePath });
      text = result.value;
    } else {
      throw new Error('Unsupported file format');
    }
    
    // Clean up basic formatting
    return text.replace(/\n\s*\n/g, '\n').trim();
  } catch (error) {
    throw new Error(`Failed to parse document: ${error.message}`);
  }
};
