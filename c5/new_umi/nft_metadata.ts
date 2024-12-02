import { Umi } from "@metaplex-foundation/umi";

export async function uploadNftMetadata(
  umi: Umi,
  nftData: any,
  imageUri: string,
) {
  try {
    // Follow this JSON structure
    // https://docs.metaplex.com/programs/token-metadata/changelog/v1.0#json-structure

    const metadata = {
      name: nftData.name,
      symbol: nftData.symbol,
      description: nftData.description,
      image: imageUri,
      attributes: nftData.attributes,
      properties: {
        files: [
          {
            type: "image/png",
            uri: imageUri,
          },
        ],
      },
      creators: [],
    };

    const myUri = await umi.uploader.uploadJson(metadata);

    console.log("Your metadata URI: ", myUri);

    return myUri;
  } catch (error) {
    console.log("Oops.. Something went wrong", error);
  }
}

const someArray = [
  { trait_type: "Rug Owner", value: "Daniel" },
  { trait_type: "Breakout Room", value: "2" },
];