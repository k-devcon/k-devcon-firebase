import firebaseConfig from "./firebase.json" with { type: "json" };
import fs from "fs";

const secretRedirectsJsonPath = "secret-redirects.json";
if (fs.existsSync(secretRedirectsJsonPath)) {
  try {
    const secretRedirectsJson = fs.readFileSync(
      secretRedirectsJsonPath,
      "utf-8"
    );
    const secretRedirects = JSON.parse(secretRedirectsJson);
    firebaseConfig['hosting']['redirects'].push(...secretRedirects);

    const firebaseConfigJson = JSON.stringify(firebaseConfig, null, 2);
    fs.writeFileSync(
      "firebase.json",
      firebaseConfigJson,
      "utf-8"
    );
  } catch (error) {
    console.error("merge failed", error);
  }
}
