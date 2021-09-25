import { getCsrfToken, signIn } from "next-auth/client";
import { useState } from "react";
import { Box, Button, Divider, Input, VStack } from "@chakra-ui/react"
import { ethers } from 'ethers';
import Onboard from 'bnc-onboard';
import axios from "axios";
let web3: ethers.providers.Web3Provider;
export default function SignIn() {
  const [newUser, setNew] = useState(false);
  const [sig, setSignature] = useState('');
  const [email, setEmail] = useState('');
  
  
  //@ts-ignore
  const wallets = [
    { walletName: "metamask", preferred: true },
    { walletName: "trust", preferred: true },
    { walletName: "torus" },
    { walletName: "opera" },
    { walletName: "operaTouch" },
  ];
  const onboard = Onboard({
    networkId: 1,
    subscriptions: {
      wallet: (wallet) => {
        try {
          //@ts-ignore
          if (window.ethereum) {
                      //@ts-ignore
            window.ethereum.enable();
          }
          web3 = new ethers.providers.Web3Provider(wallet.provider);
        } catch (err) {
          console.log(err);
      }}},
    walletSelect: {
      wallets: wallets,
    },
  });

  const handleConnectWeb3 = async () => {
    try {
      const walletSelected = await onboard.walletSelect();
      let signer = await web3.getSigner();
      const message = 'login';
      let address = onboard.getState().address;

      let res = await axios.post('/api/accounts/rng', { data: { address: address }});
      let signature = await signer.signMessage(message + res.data);
      setSignature(signature);
      
      signIn('web3',{ address: address, signature: signature})
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <VStack>
      <Button onClick={() => signIn("github")}>Login with Github</Button>
      <Divider />
      <Input
        value={email}
        onChange={(evt) => setEmail(evt.target.value)}
        placeholder="newbie@fakesystem.com"
      />
      <Button onClick={() => signIn("email", { email: email })}>
        Login with Email
      </Button>
      <Divider />
      <Button onClick={handleConnectWeb3}>Login with Web3</Button>
    </VStack>
  );
}

export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}
