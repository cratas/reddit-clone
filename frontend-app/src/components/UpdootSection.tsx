import {
  ChevronDownIcon,
  ChevronUpIcon,
  DeleteIcon,
  EditIcon,
} from "@chakra-ui/icons";
import { Flex, Box, Heading, Text, IconButton, Link } from "@chakra-ui/react";
import React from "react";
import {
  PostSnippetFragment,
  useDeletePostMutation,
  useMeQuery,
  useVoteMutation,
} from "../generated/graphql";
import NextLink from "next/link";

interface UpdootSectionProps {
  post: PostSnippetFragment;
}

const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
  const [{ fetching }, vote] = useVoteMutation();
  const [, deletePost] = useDeletePostMutation();
  const [{ data: meData }] = useMeQuery();

  return (
    <Flex key={post.id} p={5} shadow="md" borderWidth="1px">
      <Flex
        flexDirection={"column"}
        justifyContent="center"
        alignItems={"center"}
      >
        <IconButton
          onClick={() => {
            if (post.voteStatus === 1) {
              return;
            }
            vote({ postId: post.id, value: 1 });
          }}
          isLoading={fetching}
          w={10}
          aria-label="chevron up"
          h={10}
          icon={<ChevronUpIcon />}
          backgroundColor={post.voteStatus === 1 ? "green" : undefined}
        />
        {post.points}
        <IconButton
          onClick={() => {
            if (post.voteStatus === -1) {
              return;
            }
            vote({ postId: post.id, value: -1 });
          }}
          isLoading={fetching}
          aria-label="chevron down"
          w={10}
          h={10}
          icon={<ChevronDownIcon />}
          backgroundColor={post.voteStatus === -1 ? "red" : undefined}
        />
      </Flex>
      <Box ml={5}>
        <NextLink href="/post/[id]" as={`/post/${post.id}`}>
          <Link>
            <Heading fontSize="xl">{post.title}</Heading>
          </Link>
        </NextLink>
        <Text>{"Posted by: " + post.creator.username}</Text>
        <Text mt={4}>{post.textSnippet}</Text>
      </Box>
      {meData?.me?.id === post.creator.id ? (
        <Box ml="auto">
          <NextLink href="/post/edit/[id]" as={`/post/edit/${post.id}`}>
            <IconButton
              icon={<EditIcon />}
              aria-label="edit post"
              onClick={() => {
                // deletePost({ id: post.id });
              }}
              mr={2}
            />
          </NextLink>
          <IconButton
            icon={<DeleteIcon />}
            aria-label="delete post"
            onClick={() => {
              deletePost({ id: post.id });
            }}
            backgroundColor="red"
          />
        </Box>
      ) : null}
    </Flex>
  );
};

export default UpdootSection;
