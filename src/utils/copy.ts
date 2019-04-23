import { ncp } from "ncp";

export function copy(target: string) {
  return new Promise((resolve, reject) => {
    try {
        ncp(__dirname + "./../../templates", `./${target}`, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    } catch (err) {
      reject(err);
    }
  });
}
