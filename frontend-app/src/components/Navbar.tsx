import { Box, Button, Flex, Link } from "@chakra-ui/react";
import { CSSObject } from "@emotion/react";
import React from "react";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";

interface NavbarProps {}

const style: CSSObject = {
  backgroundColor: "tomato",
  textAlign: "right",
};

export const Navbar: React.FC<NavbarProps> = ({}) => {
  const [{ data, fetching }] = useMeQuery();
  const [{fetching: fetchingLogout}, logout] = useLogoutMutation();
  let body = null;

  if (!data?.me) {
    // user is not logged in
    body = (
      <>
        <NextLink href="/login">
          <Link mr={2}>login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link>Register</Link>
        </NextLink>
      </>
    );
  } else {
    // user is logged in
    body = (
      <Flex justifyContent={"right"}>
        <Box mr={5}>{data.me.userName}</Box>
        <Button onClick={() => logout()} isLoading={fetchingLogout} variant="link">
          Logout
        </Button>
      </Flex>
    );
  }

  return (
    <Flex __css={style} p={5}>
      <Box ml={"auto"}>{body}</Box>
    </Flex>
  );
};
