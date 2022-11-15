import { Box, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";
import router from "next/router";
import React from "react";
import { InputField } from "../../../components/InputField";
import { Layout } from "../../../components/Layout";
import {
  usePostQuery,
  useUpdatePostMutation,
} from "../../../generated/graphql";
import { createUrqlClient } from "../../../utils/createUrqlClient";
import { UseGetIntId } from "../../../utils/useGetIntId";

const EditPost = ({}) => {
  const intId = UseGetIntId();
  const [{ data, fetching }] = usePostQuery({
    pause: intId === -1,
    variables: {
      id: intId,
    },
  });
  const [, updatePost] = useUpdatePostMutation();

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
    <Layout variant="small">
      <Formik
        initialValues={{ title: data?.post?.title, text: data?.post?.text }}
        onSubmit={async (values, { setErrors }) => {
          await updatePost({
            id: intId,
            title: values.title,
            text: values.text,
          });
          router.push("/");
          //   router.back();  alternative way -> takes u one route back
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Box mt={3}>
              <InputField name="title" placeholder="title" label="Title" />
            </Box>
            <Box mt={3} mb={5}>
              <InputField
                name="text"
                placeholder="text..."
                label="Body"
                textarea
              />
            </Box>
            <Button type="submit" isLoading={isSubmitting}>
              Update post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(EditPost);
