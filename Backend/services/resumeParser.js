import { PDFParse } from "pdf-parse";
import axios from "axios";

export const extractResumeText = async (resumeUrl) => {
  try {
    const response = await axios.get(resumeUrl, {
      responseType: "arraybuffer",
    });

    const parser = new PDFParse({
      data: response.data,
    });

    const result = await parser.getText();

    await parser.destroy();

    if (!result.text || !result.text.trim()) {
      throw new Error("No readable text found in resume");
    }

    return result.text;
  } catch (error) {
    console.error("Resume parsing error:", error.message);

    throw new Error("Unable to extract text from resume");
  }
};