import { ncp } from "ncp";

/**
 * Copy tiles from `templates` directory for new project
 * @export
 * @param {string} target
 * @returns
 */
export function copy(source: string, target: string) {
  return new Promise((resolve, reject) => {
    try {
      ncp(source, target, (err) => {
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
