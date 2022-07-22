import { NextPage } from "next";
import * as React from "react";
import Layout from "../components/layout";

const Callback: NextPage = () => {
  return (
    <Layout>
      <div className="bg-white ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto py-20">
            <article className="prose  sm:prose-xl">
              <h2>👍 Success!</h2>
              <p>
                We will send you an email when we are finished indexing your
                workspace. In the meantime you can checkout our{" "}
                <a href="https://github.com/operandinc">GitHub</a> to learn more
                about Operand.
              </p>
            </article>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Callback;
