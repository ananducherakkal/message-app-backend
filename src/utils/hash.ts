const bcrypt = require("bcrypt");

export const hash = async (text: string) => {
  const salt = await bcrypt.genSalt(10);
  const hashText = await bcrypt.hash(text, salt);

  return hashText;
};

export const compareHash = async (
  plainText: string,
  hashText: string
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(plainText, hashText, (err: any, result: any) => {
      if (err) resolve(false);
      resolve(!!result);
    });
  });
};
