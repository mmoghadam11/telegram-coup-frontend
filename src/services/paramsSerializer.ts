function paramsSerializer(params: any) {
  if (!params || Object.values(params)?.length === 0) return "";

  let result = Object.entries(params)
    .filter(([key, value]) => key !== "count" && value !== null && value !== undefined && value !== "")
    .map(([key, value]) => {
      return `${key}=${value}`;
    })
    .join("&");
  return `?${result}`;
}

export default paramsSerializer;
