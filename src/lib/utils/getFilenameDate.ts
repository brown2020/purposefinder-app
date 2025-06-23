function sanitizeFilename(text: string) {
  return text.replace(/\s+/g, "_").replace(/[^0-9a-zA-Z_-]/g, "");
}

export default function getFilenameDate(inputString: string) {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  const sanitizedInput = sanitizeFilename(inputString);
  return `${sanitizedInput}_${year}_${month}_${day}_${hours}_${minutes}_${seconds}.docx`;
}
