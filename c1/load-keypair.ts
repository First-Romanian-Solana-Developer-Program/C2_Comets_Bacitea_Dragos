import "dotenv/config";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";

const keypair = getKeypairFromEnvironment("SECRET_KEY");

console.log(`Your pubkey: ${keypair.publicKey.toBase58()}`);
console.log(`Your secret-key: ${keypair.secretKey}`);