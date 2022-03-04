import constate from 'constate'
import { ethers, utils } from 'ethers'
import { useCallback, useEffect, useState } from 'react'

import { Transactions__factory } from '../generated'

const { ethereum } = window

const contractAddress = '0xF96a0524A6Fa396D6b1899f0383b7B7CaA7744E1'

type Transaction = {
  addressTo: string
  addressFrom: string
  timestamp: string
  message: string
  keyword: string
  amount: number
}

function getEthereumContract() {
  const provider = new ethers.providers.Web3Provider(ethereum)
  const signer = provider.getSigner()
  return Transactions__factory.connect(contractAddress, signer)
}

function getDefaultFormData() {
  return {
    addressTo: '',
    amount: '',
    keyword: '',
    message: '',
  }
}

function useTransaction() {
  const [currentAccount, setCurrentAccount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [formData, setFormData] = useState(getDefaultFormData())

  const handleChange = useCallback((e, name: keyof typeof formData) => {
    setFormData((prevState) => ({ ...prevState, [name]: e.target.value }))
  }, [])

  const getAllTransactions = useCallback(async () => {
    if (!ethereum) {
      return alert('Please install metamask')
    }

    try {
      const contract = getEthereumContract()
      const availableTransactions = await contract.getAllTransactions()
      const processedTransactions = availableTransactions.map((item) => {
        return {
          addressTo: item.receiver,
          addressFrom: item.sender,
          timestamp: new Date(item.timestamp.toNumber() * 1000).toLocaleString(),
          message: item.message,
          keyword: item.keyword,
          amount: parseInt(item.amount._hex) / 10 ** 18,
        }
      })

      setTransactions(processedTransactions)
    } catch (error) {
      console.error(error)
      throw new Error('No ethereum object.')
    }
  }, [])

  const checkIfWalletIsConnected = useCallback(async () => {
    if (!ethereum) {
      return alert('Please install metamask')
    }

    const accounts = await ethereum.request?.({ method: 'eth_accounts' })

    if (accounts.length) {
      setCurrentAccount(accounts[0])
      return true
    } else {
      console.error('No accounts found')
      return false
    }
  }, [])

  const connectWallet = useCallback(async () => {
    if (!ethereum) {
      return alert('Please install metamask')
    }

    try {
      const accounts = await ethereum.request?.({ method: 'eth_requestAccounts' })
      setCurrentAccount(accounts[0])
    } catch (error) {
      console.error(error)
      throw new Error('No ethereum object.')
    }
  }, [])

  const sendTransaction = useCallback(async () => {
    if (!ethereum) {
      return alert('Please install metamask')
    }

    const { addressTo, amount, keyword, message } = formData

    if (!addressTo || !amount || !keyword || !message) {
      return
    }

    try {
      const contract = getEthereumContract()
      const parsedAmount = utils.parseEther(amount)

      setIsLoading(true)

      await ethereum.request?.({
        method: 'eth_sendTransaction',
        params: [
          {
            from: currentAccount,
            to: addressTo,
            gas: utils.hexlify(21000),
            value: parsedAmount._hex,
          },
        ],
      })

      const transactionHash = await contract.addToBlockchain(
        addressTo,
        parsedAmount,
        message,
        keyword,
      )

      await transactionHash.wait()
      setIsLoading(false)
      setFormData(getDefaultFormData())
      await getAllTransactions()
    } catch (error) {
      console.error(error)
      setIsLoading(false)
      throw new Error('No ethereum object.')
    }
  }, [currentAccount, formData, getAllTransactions])

  useEffect(() => {
    ;(async () => {
      const walletIsConnected = await checkIfWalletIsConnected()

      if (!walletIsConnected) {
        return
      }

      getAllTransactions()
    })()
  }, [checkIfWalletIsConnected, getAllTransactions])

  return {
    connectWallet,
    currentAccount,
    handleChange,
    sendTransaction,
    formData,
    isLoading,
    transactions,
  }
}

export const [TransactionProvider, useTransactionContext] = constate(useTransaction)
