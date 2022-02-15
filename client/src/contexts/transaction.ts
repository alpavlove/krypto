import { useCallback, useEffect, useState } from 'react'
import constate from 'constate'
import { Contract, ethers } from 'ethers'
import { contractAddress, contractABI } from '../contstants'

const { ethereum } = window

function useTransaction() {
  const [contract, setContract] = useState<Contract>()
  const [currentAccount, setCurrentAccount] = useState('')

  const getEtheriumContract = useCallback(() => {
    const provider = new ethers.providers.Web3Provider(ethereum)
    const signer = provider.getSigner()
    const transactionContract = new ethers.Contract(contractAddress, contractABI, signer)

    setContract(transactionContract)
  }, [])

  const checkIfWalletIsConnected = useCallback(async () => {
    if (!ethereum) {
      return alert('Please install metamask')
    }

    const accounts = await ethereum.request?.({ method: 'eth_accounts' })

    console.log(accounts)
  }, [])

  const connectWallet = useCallback(async () => {
    if (!ethereum) {
      return alert('Please install metamask')
    }

    try {
      const accounts = await ethereum.request?.({ method: 'eth_requestAccounts' })
      setCurrentAccount(accounts[0])
    } catch (error) {
      console.log(error)
      throw new Error('No ethereum object.')
    }
  }, [])

  useEffect(() => {
    checkIfWalletIsConnected()
    getEtheriumContract()
  }, [checkIfWalletIsConnected, getEtheriumContract])

  return {
    getEtheriumContract,
    connectWallet,
    currentAccount,
    handleChange: () => {},
    sendTransaction: () => {},
    formData: {
      addressTo: '',
      amount: '',
      keyword: '',
      message: '',
    },
    isLoading: false,
    transactions: [],
  }
}

export const [TransactionProvider, useTransactionContext] = constate(useTransaction)
