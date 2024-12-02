import { Connection, Keypair, PublicKey, Transaction } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, createTransferInstruction, getAssociatedTokenAddress, createAssociatedTokenAccountInstruction } from '@solana/spl-token';

// Solana connection (Devnet or Mainnet)
// const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

// Define the keypair of the sender's wallet (this can be your wallet or a Keypair instance)
const senderKeypair = Keypair.fromSecretKey(new Uint8Array([/* your private key here */]));

// Define the recipient's public key
const recipientPublicKey = new PublicKey('recipient-public-key');

// Define the mint address of the NFT (this is the token mint address of the NFT you're transferring)
const nftMintAddress = new PublicKey('nft-token-mint-address');

// Function to transfer NFT
export async function transferNft() {
  try {
    // Fetch the sender's associated token account that holds the NFT
    const senderTokenAccount = await getAssociatedTokenAddress(
      nftMintAddress, // Mint address of the NFT
      senderKeypair.publicKey // Sender's public key
    );

    // Fetch the recipient's associated token account
    const recipientTokenAccount = await getAssociatedTokenAddress(
      nftMintAddress, // Mint address of the NFT
      recipientPublicKey // Recipient's public key
    );

    // Check if the recipient has an associated token account, create it if not
    const recipientAccountInfo = await connection.getAccountInfo(recipientTokenAccount);
    if (!recipientAccountInfo) {
      const createAccountTx = new Transaction().add(
        createAssociatedTokenAccountInstruction(
          senderKeypair.publicKey, // Owner of the token account
          recipientTokenAccount,   // Recipient's associated token account
          recipientPublicKey,      // Recipient's public key
          nftMintAddress           // The mint address of the NFT
        )
      );
      await connection.sendTransaction(createAccountTx, [senderKeypair], { skipPreflight: false, preflightCommitment: 'processed' });
    }

    // Create the transfer transaction
    const transferTransaction = new Transaction().add(
      createTransferInstruction(
        senderTokenAccount,         // Sender's token account
        recipientTokenAccount,      // Recipient's token account
        senderKeypair.publicKey,    // Sender's public key
        1,                           // Number of tokens to transfer (1 for an NFT)
        [],                          // Multi-signature accounts (leave empty for single signature)
        TOKEN_PROGRAM_ID            // The Solana token program ID
      )
    );

    // Send the transaction
    const signature = await connection.sendTransaction(transferTransaction, [senderKeypair], { skipPreflight: false, preflightCommitment: 'processed' });
    await connection.confirmTransaction(signature, 'processed');
    console.log('NFT transfer successful:', signature);
  } catch (error) {
    console.error('Error transferring NFT:', error);
  }
}