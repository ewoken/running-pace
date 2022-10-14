function formatDuration(duration: number) {
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration - hours * 3600) / 60);
  const seconds = Math.ceil(duration % 60);

  return `${hours > 0 ? `${hours}h` : ""}${
    hours > 0 || minutes > 0 ? `${minutes.toString().padStart(2, "0")}'` : ""
  }${seconds.toString().padStart(2, "0")}"`;
}

export default formatDuration;
