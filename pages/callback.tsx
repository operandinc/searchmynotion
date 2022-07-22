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
                We'll send you an email when we're finished indexing your
                workspace. This can take anywhere from a few minutes to an hour
                or so. In the meantime, here's a few fun things you can do:
              </p>
              <ul>
                <li>
                  Check out our <a href="https://operand.ai">website</a>.
                </li>
                <li>
                  Follow us on{" "}
                  <a href="https://twitter.com/operandai">Twitter</a>.
                </li>
                <li>
                  Learn about how{" "}
                  <a href="https://a-z-animals.com/blog/how-do-whales-mate-and-reproduce/">
                    whales reproduce
                  </a>
                  .
                </li>
              </ul>
            </article>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Callback;
