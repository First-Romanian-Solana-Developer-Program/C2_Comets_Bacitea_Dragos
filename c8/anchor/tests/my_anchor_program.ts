import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { MyAnchorProgram } from "../target/types/my_anchor_program";

import { assert } from "chai";
import web3 = anchor.web3;

describe("my_anchor_program", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const user = (provider.wallet as anchor.Wallet).payer;  // the signer
  const program = anchor.workspace.MyAnchorProgram as Program<MyAnchorProgram>;

  before(async() => {
    const balance = await provider.connection.getBalance(user.publicKey);
    const balanceInSOL = balance / web3.LAMPORTS_PER_SOL;
    const formattedBalance = new Intl.NumberFormat().format(balanceInSOL);
    console.log(
      `Balance of account ${user.publicKey}: ${formattedBalance} SOL`
    );
  });

  it("Save a user's favorites to the blockchain!", async () => {
    const favoriteNumber = new anchor.BN(23);   
    const favoriteColor = "purple";
    const favoriteHobbies = ["skiing","kangoo","hiking"];

    let txHash = await program.methods.setFavorites(favoriteNumber, favoriteColor, favoriteHobbies)
    .signers([user])
    .rpc();

    console.log("txHash", txHash);

    const [favoritesPda, favoritesBump] = web3.PublicKey.findProgramAddressSync(
      [Buffer.from("favorites"), user.publicKey.toBuffer()],
      program.programId
    );

    const favoritesAccount = await program.account.favorites.fetch(
      favoritesPda
    );

    assert.equal(favoritesAccount.number.toString(), favoriteNumber.toString());
    assert.equal(favoritesAccount.color, favoriteColor);
    assert.deepEqual(favoritesAccount.hobbies, favoriteHobbies);
  });
});
