import { Keypair } from "@solana/web3.js";

const keypair = Keypair.generate();

console.log(`Your pubkey: ${keypair.publicKey.toBase58()}`);
console.log(`Your secret key: ${keypair.secretKey}`);