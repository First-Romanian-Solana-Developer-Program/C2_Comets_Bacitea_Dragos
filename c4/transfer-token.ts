import "dotenv/config";
import { 
    getKeypairFromEnvironment, 
    getExplorerLink 
} from "@solana-developers/helpers";

import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";
//import { token } from "@metaplex-foundation/js";

const AMOUNT = 9; // Quantity
const DECIMALS = 6;

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
const user = getKeypairFromEnvironment("SECRET_KEY");

console.log(
    `Loaded our keypair securely, using an env file! Our public key is: ${user.publicKey.toBase58()}`
);

// Add the recipient's public key here
const recipient = new PublicKey("dest_pubkey"); 

// Substitute in your token mint account - Your token mint address here
const tokenMintAccount = new PublicKey("token_mint_account");

// Our token has two decimal places
const MINOR_UNITS_PER_MAJOR_UNITS = Math.pow(10, 2);

console.log(`Attempting to send 1 token to ${recipient.toBase58()}`);

// Get or create the source and destination token accounts to store this token
const sourceTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    user,
    tokenMintAccount,
    user.publicKey
);

const destinationTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    user,
    tokenMintAccount,
    recipient
);

const signature = await transfer(
    connection,
    user,
    sourceTokenAccount.address,
    destinationTokenAccount.address,
    user, 
    AMOUNT * 10 ** DECIMALS,
);

const explorerLink = getExplorerLink("transaction", signature, "devnet");

console.log(`Transaction confirmed, explorer link is: ${explorerLink}`);

console.log("Signature: ", signature);