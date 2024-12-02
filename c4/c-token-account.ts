import "dotenv/config";
import { 
    getKeypairFromEnvironment, 
    getExplorerLink 
} from "@solana-developers/helpers";

import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount } from "@solana/spl-token";

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

const user = getKeypairFromEnvironment("SECRET_KEY");

console.log(`User account loaded: ${user.publicKey.toBase58()}`);

// Making apublic key for mint account
const tokenMint = new PublicKey("mint_account"); 

//Destination pubkey ussually the address of the user
const destPubKey = new PublicKey(
    "my_pubkey"
); 

const destTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    user,
    tokenMint,
    destPubKey,
);

console.log("Token account created:", destTokenAccount.address.toBase58());
