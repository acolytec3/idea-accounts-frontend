import { signOut, useSession } from "next-auth/client";

import { Center, Button, VStack } from "@chakra-ui/react";

import ProfileForm from "../components/ProfileForm";
import { useState } from "react";
import Signin from "../components/signin";

const IndexPage = () => {
  const [session, loading] = useSession();

  const [showSignin, setShow] = useState(false);
  if (loading) {
    return <div>Loading...</div>;
  }

  if (session) {
    console.log(session);
    return (
      <VStack>
        Hello, {session.user.name ?? session.user.email} <br />
        <Button onClick={() => signOut()}>Sign out</Button>
        <ProfileForm />
      </VStack>
    );
  } else {
    return (
      <Center h="100vh">
        {showSignin ? (
          <Signin />
        ) : (
          <>
            You are not logged in!
            <Button onClick={() => setShow(true)}>Sign in</Button>
          </>
        )}
      </Center>
    );
  }
};

export default IndexPage;
