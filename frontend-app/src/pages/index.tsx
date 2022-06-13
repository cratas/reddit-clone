import { Navbar } from "../components/Navbar";
import { createUrqlClient } from "../utils/createUrqlClient";
import { withUrqlClient } from "next-urql";
import { usePostsQuery } from "../generated/graphql";

const Index = () => {
  const [{ data }] = usePostsQuery();

  return (
    <div>
      <Navbar />
      <div>Hello word</div>
      <br />
      {!data ? (
        <div>loading</div>
      ) : (
        data.posts.map((p) => <div key={p.id}>{p.title}</div>)
      )}
    </div>
  );
};

export default withUrqlClient(createUrqlClient, {ssr: true})(Index);
