import { ncp } from "ncp";

/**
 * Copy tiles from `templates` directory for new project
 * @export
 * @param {string} target
 * @returns
 */
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
