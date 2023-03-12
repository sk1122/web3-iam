import { Queue, Worker } from 'bullmq'
import axios from 'axios'
import { findEventById, updateEvent } from './events.service'
import { findIamUserById, updateIamUser } from '../iamUsers/iamUser.service'

export const queue = new Queue('transaction')

const worker = new Worker('transaction', async (job) => {
    const URL = `https://api.helius.xyz/v0/transactions/?api-key=cf0d04d7-c2ae-4cd3-b039-2eb5258e1539`
    
    const hash = job.data.hash

    const res = await axios({
        url: URL,
        method: 'POST',
        data: {
            transactions: [hash]
        }
    })

    const data = await res.data

    const tokenTransfers = data[0].tokenTransfers
    let transactionVolume: any[] = []

    for(let i = 0; i < tokenTransfers.length; i++) {
        const transfer = tokenTransfers[i]

        transactionVolume.push({
            token: transfer.mint,
            amount: transfer.tokenAmount
        })
    }

    let event = await findEventById(job.data.id)

    let result = await updateEvent({
        id: job.data.id,
        data: {
            ...event.data as object,
            transactionVolume,
            transactionExecuted: 1
        }
    });

    let iam = await findIamUserById(job.data.iam)

    await updateIamUser({
        id: job.data.iam,
        transactionExecuted: iam.transactionExecuted + 1,
        transactionVolume: iam.transactionVolume + 1
    })
})