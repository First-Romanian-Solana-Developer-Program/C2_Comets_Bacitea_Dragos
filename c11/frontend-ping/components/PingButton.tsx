import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import * as web3 from '@solana/web3.js'
import { FC } from 'react'
import styles from '../styles/PingButton.module.css'

const PROGRAM_ID = `program_id` //program ID pubkey either harcoded or automated
const DATA_ACCOUNT_PUBKEY = `data_account`  //data account pubkey harcoded or automated

export const PingButton: FC = () => {
	const { connection } = useConnection();
	const { publicKey, sendTransaction } = useWallet();

	const onClick = async () => {
		if (!connection || !publicKey) { return }

		const programId = new web3.PublicKey(PROGRAM_ID)
		const programDataAccount = new web3.PublicKey(DATA_ACCOUNT_PUBKEY)
		const transaction = new web3.Transaction()

		const instruction = new web3.TransactionInstruction({
			keys: [
				{
					pubkey: programDataAccount,
					isSigner: false,
					isWritable: true
				},
			],
			programId
		});

		transaction.add(instruction)

		const sig = await sendTransaction(transaction, connection);
		console.log(sig)
	}

	return (
		<div className={styles.buttonContainer} onClick={onClick}>
			<button className={styles.button}>Ping!</button>
		</div>
	)
}