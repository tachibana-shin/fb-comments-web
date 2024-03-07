export function parseRT<T>(data: string): T {
  return JSON.parse(data.replace(/^for \(;;\);/, ""))
}
