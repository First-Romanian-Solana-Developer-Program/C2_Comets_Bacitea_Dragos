import { createGenericFile, Umi } from "@metaplex-foundation/umi";
import { readFile } from "fs/promises";

export async function uploadNftImage(umi: Umi, imgFilePath: string) {
  try {
    //1. Load image
    const imgFile = await readFile(imgFilePath);

    //2. Convert image to generic file.
    const imageConverted = createGenericFile(
      new Uint8Array(imgFile),
      "image/png",
    );

    //3. Upload image
    const [myUri] = await umi.uploader.upload([imageConverted], {
      onProgress: (percent) => {
        console.log(`Uploading image: ${percent * 100}%`);
      },
    });
    console.log("Your image URI: ", myUri);

    if (!myUri) {
      throw new Error("Image upload failed");
    }

    return myUri;
  } catch (error) {
    console.log("Oops.. Something went wrong", error);
  }
}