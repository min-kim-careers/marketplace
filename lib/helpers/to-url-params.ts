const serialize = (object: Object) => {
  return Object.fromEntries(
    Object.entries(object)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(
        ([_, value]) => value !== undefined &&
          value !== null &&
          value !== ''
      )
      .map(([key, value]) => [key, String(value)])
  );
};

export const toUrlParams = (object: Object) => new URLSearchParams(serialize(object));
