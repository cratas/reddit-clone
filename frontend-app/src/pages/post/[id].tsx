import { Box, Heading } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import Router, { useRouter } from "next/router";
import React from "react";
import { Layout } from "../../components/Layout";
import { usePostQuery } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { UseGetPostFromUrl } from "../../utils/useGetPostFromUrl";

const Post = ({}) => {
  const [{ data, fetching }] = UseGetPostFromUrl();

  if (fetching) {
    return (
      <Layout>
        <Box>loading ...</Box>
      </Layout>
    );
  }

  if (!data?.post) {
    return (
      <Layout>
        <Box>Could not find post</Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Heading mb={4}>{data?.post?.title}</Heading>
      {data.post.text}
    </Layout>
  );
};
export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
