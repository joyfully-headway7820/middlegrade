export type HomeworkFileDrop = {
  file: File | null;
  isDirectory: boolean;
};

export const readHomeworkFileDrop = (dataTransfer: DataTransfer): HomeworkFileDrop => {
  if (dataTransfer.items[0]?.webkitGetAsEntry?.()?.isDirectory)
    return { file: null, isDirectory: true };

  return { file: dataTransfer.files[0] ?? null, isDirectory: false };
};
