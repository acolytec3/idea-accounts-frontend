import React from "react";
import { useSession } from "next-auth/client";
import { Box, Button, Divider, HStack, Input, Text, VStack } from "@chakra-ui/react";
import axios from "axios";
const pica = require("pica")();

const ProfileForm: React.FC = () => {
  const [session, loading] = useSession();
  const [username, setName] = React.useState(session.user.name);
  const [email, setEmail] = React.useState("");
  const [source, setSource] = React.useState("");
  const [avatar, setAvatar] = React.useState(session.user.image);

  React.useEffect(() => {
    const data = {
      username: session.user.name ?? session.user.email,
    };
    axios.post("api/accounts/getProfile", data).then((res) => {
      if (res.data.username) {
        setName(res.data.username);
      }
      if (res.data.email) {
        setEmail(res.data.email);
      }
      if (res.data.source) {
        setSource(res.data.source);
      }
      if (res.data.avatar) {
        setAvatar(res.data.avatar);
      }
    });
  }, []);

  const updateEmail = async () => {
    const data = {
      username: username,
      email: email,
    };

    const res = await axios.post("/api/accounts/updateEmail", data);
    if (res.status === 200) {
      alert("Email updated");
    }
  };

  const updateAvatar = async (acceptedFiles: FileList) => {
    const reader = new FileReader();
    reader.onabort = () => console.log("file reading was aborted");
    reader.onerror = () => console.log("file reading has failed");
    reader.onloadend = async function (event) {
      let img = new window.Image();
      //@ts-ignore
      img.src = reader.result;
      img.onload = async function () {
        const to = document.createElement("canvas");
        to.height = 48;
        to.width = 48;
        const result = await pica.resize(img, to);
        let blob = result.toDataURL();
        let data = {
          img: blob,
          username: username,
        };
        const res = await axios.post("/api/accounts/avatar", data);
        if (res.status === 200) {
          alert("updated avatar successfully");
        }
      };
    };
    try {
      reader.readAsDataURL(acceptedFiles[0]);
    } catch (err) {
      console.log("error in avatar!", err);
    }
  };

  return (
    <VStack>
      <HStack>
        <Text>Username</Text>
        <Input value={username} placeholder="Username" readOnly />
      </HStack>
      <Divider />
      <Input
        value={email}
        placeholder="Email"
        onChange={(evt) => {
          setEmail(evt.target.value);
        }}
      />
      <Button onClick={updateEmail}>Update email</Button>
      <Divider />
      <HStack>
        <Text>Authentication Provider</Text>
        <Input value={source} placeholder="Auth Provider" readOnly />
      </HStack>
      <Divider />
      <Text fontSize="xl">Avatar</Text>
      <img src={avatar} />
      <HStack>
        <Text>Choose image</Text>
        <Input
          type="file"
          accept="image/*"
          onChange={(evt) => updateAvatar(evt.target.files)}
        />
      </HStack>
    </VStack>
  );
};

export default ProfileForm;
