import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Favorites } from "../target/types/favorites";
import { BankrunProvider, startAnchor } from "anchor-bankrun";
import { Keypair, PublicKey } from "@solana/web3.js";
import { assert } from "chai";

const IDL = require("../target/idl/favorites.json");
const programID = new PublicKey(IDL.address);

describe("favorites", () => {
  let context;
  let provider: BankrunProvider;
  let payer;
  let program: anchor.Program<Favorites>;

  before(async () => {
    context = await startAnchor(
      "",
      [{ name: "favorites", programId: programID }],
      []
    );
    provider = new BankrunProvider(context);
    program = new anchor.Program<Favorites>(IDL, provider);
    payer = (provider.wallet as anchor.Wallet).payer;
  });

  // Here's what we want to write to the blockchain
  const favoriteNumber = new anchor.BN(23);
  const favoriteColor = "purple";
  const favoriteHobbies = ["skiing", "skydiving", "biking"];
  

  it("Is initialized!", async () => {  
    // Add your test here.
    const tx = await program.methods.setFavorites(favoriteNumber, favoriteColor, favoriteHobbies)
    .signers([payer])
    .rpc();
    console.log("Your transaction signature", tx);
  });

  it("get favorites", async() => {
     // Find the PDA for the user's favorites
     const favoritesPdaAndBump = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from("favorites"), payer.publicKey.toBuffer()],program.programId);
    console.log({favoritesPdaAndBump});
    const favoritesPda = favoritesPdaAndBump[0];
     const dataFromPda = await program.account.favorites.fetch(favoritesPda);
     console.log({dataFromPda});
     // And make sure it matches!
     assert.equal(dataFromPda.color, favoriteColor);
     // A little extra work to make sure the BNs are equal
     assert.equal(dataFromPda.number.toString(), favoriteNumber.toString());
     // And check the hobbies too
     assert.deepEqual(dataFromPda.hobbies, favoriteHobbies);
  })

  it('Updates the favorites', async () => {
    const newFavoriteHobbies = ['skiing', 'skydiving', 'biking', 'swimming'];
    try {
      await program.methods.setFavorites(favoriteNumber, favoriteColor, newFavoriteHobbies).signers([payer]).rpc();
    } catch (error) {
      console.error((error as Error).message);
      // const customErrorMessage = getCustomErrorMessage(systemProgramErrors, error);
      // throw new Error(customErrorMessage);
    }
  });

  it("get favorites", async() => {
    // Find the PDA for the user's favorites
    const favoritesPdaAndBump = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from("favorites"), payer.publicKey.toBuffer()],program.programId);
    console.log({favoritesPdaAndBump});
    
    const favoritesPda = favoritesPdaAndBump[0];
    const dataFromPda = await program.account.favorites.fetch(favoritesPda);
    console.log({dataFromPda});

 })
});
