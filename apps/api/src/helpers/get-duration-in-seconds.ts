export const getDurationInSeconds = (start: number, end: number): number =>
	Number(((end - start) / 1000).toFixed(2))
