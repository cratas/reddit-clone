import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { Flex, Box, Heading, Text, IconButton } from "@chakra-ui/react";
import React from "react";
import { PostSnippetFragment, useVoteMutation } from "../generated/graphql";

interface UpdootSectionProps {
  post: PostSnippetFragment;
}

const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
  const [{ fetching, operation }, vote] = useVoteMutation();

  return (
    <Flex key={post.id} p={5} shadow="md" borderWidth="1px">
      <Flex
        flexDirection={"column"}
        justifyContent="center"
        alignItems={"center"}
      >
        <IconButton
          onClick={() => {
            vote({ postId: post.id, value: 1 });
          }}
          isLoading={fetching}
          w={10}
          aria-label="chevron up"
          h={10}
          icon={<ChevronUpIcon />}
        />
        {post.points}
        <IconButton
          onClick={() => {
            vote({ postId: post.id, value: -1 });
          }}
          isLoading={fetching}
          aria-label="chevron down"
          w={10}
          h={10}
          icon={<ChevronDownIcon />}
        />
      </Flex>
      <Box ml={5}>
        <Heading fontSize="xl">{post.title}</Heading>
        <Text>{"Posted by: " + post.creator.username}</Text>
        <Text mt={4}>{post.textSnippet}</Text>
      </Box>
    </Flex>
  );
};

export default UpdootSection;
