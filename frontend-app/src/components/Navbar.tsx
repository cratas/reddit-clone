import { Box, Flex, Link } from "@chakra-ui/react";
import { CSSObject } from "@emotion/react";
import React from "react";
import NextLink from "next/link";

interface NavbarProps {}

const style: CSSObject = {
  backgroundColor: "tomato",
  textAlign: 'right'
};

export const Navbar: React.FC<NavbarProps> = ({}) => {
  return (
    <Flex __css={style} p={5}>
      <Box ml={"auto"}>
        <NextLink href="/login">
          <Link mr={2}>
            login
          </Link>
        </NextLink>
        <NextLink href="/register">
          <Link>Register</Link>
        </NextLink>
      </Box>
    </Flex>
  );
};
