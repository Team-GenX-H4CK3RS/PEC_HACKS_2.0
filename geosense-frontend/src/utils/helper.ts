export function base64ToArrayBuffer(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

export function base64TUrl(data: string) {
  const bytes = base64ToArrayBuffer(data);
  const blob = new Blob([bytes], { type: "audio/mp3" });
  return window.URL.createObjectURL(blob);
}

export function blobToBase64(blob: Blob) {
  return new Promise<string>((resolve, reason) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve((reader.result as string).split(",")[1]);
    };
    reader.onerror = () => {
      reason("Reader Error");
    };
    reader.readAsDataURL(blob);
  });
}
