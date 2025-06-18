export const delay = async (time: number) =>
  await new Promise((_) => setTimeout(_, time))
