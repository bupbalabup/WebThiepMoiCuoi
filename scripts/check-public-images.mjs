import { readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve, sep } from "node:path";

const root = fileURLToPath(new URL("../public/", import.meta.url));
const configs = ["photos.json", "wedding.json"].map(name => JSON.parse(
  readFileSync(new URL(`../src/config/${name}`, import.meta.url), "utf8"),
));
const images = new Set();
function collect(value) {
  if (typeof value === "string" && value.startsWith("/images/")) images.add(value);
  else if (value && typeof value === "object") Object.values(value).forEach(collect);
}
configs.forEach(collect);

const missing = [];
for (const url of images) {
  let current = root;
  try {
    // Windows accepts wrong filename casing; Cloudflare does not.
    for (const segment of decodeURIComponent(url.split(/[?#]/)[0]).slice(1).split("/")) {
      if (!segment || segment === "." || segment === ".." || !readdirSync(current).includes(segment)) throw new Error("Missing file");
      current = resolve(current, segment);
      if (!current.startsWith(root.endsWith(sep) ? root : root + sep)) throw new Error("Invalid path");
    }
    if (!statSync(current).isFile()) throw new Error("Not a file");
  } catch {
    missing.push(url);
  }
}
if (missing.length) {
  console.error("Thiếu ảnh hoặc sai chữ hoa/thường trong public:\n" + missing.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Đã kiểm tra ${images.size} đường dẫn ảnh trong cấu hình.`);
}
