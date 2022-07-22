import { NextPage } from "next";
import * as React from "react";
import Layout from "../components/layout";
import { trackGoal } from "fathom-client";

const Index: NextPage = () => {
  const setupUrl = `https://api.notion.com/v1/oauth/authorize?owner=user&response_type=code&client_id=${process.env.NEXT_PUBLIC_NOTION_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/notion/redirect`;

  return (
    <Layout>
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto py-20">
            {/* Big button */}
            <div className="flex justify-between items-center pb-20">
              <div className="flex-shrink-0 text-3xl sm:text-6xl animate-bounce-left">
                👉
              </div>
              <button
                type="button"
                onClick={() => {
                  trackGoal("95KFL7NF", 1);
                  window.location.href = setupUrl;
                }}
                className="inline-flex items-center px-5 sm:px-10 py-3 sm:py-6 border border-gray-700 shadow-xl rounded text-2xl sm:text-3xl sm:text-5xl font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              >
                Search my Notion!
              </button>
              <div className="flex-shrink-0 text-3xl sm:text-6xl animate-bounce-right">
                👈
              </div>
            </div>
            <article className="prose lg:prose-xl">
              <h3 className="text-center pb-10">
                Click the button above to experience the magic of semantic
                search with your very own Notion content.
              </h3>
              <h2>How does it work?</h2>
              <ol>
                <li>
                  Click the button above to authorize access to a Notion
                  workspace.
                </li>
                <li>
                  Choose the appropriate pages you would like to be able to
                  search over.
                </li>
                <li>
                  Once you finish choosing pages, we will begin indexing your
                  content. This may take some time.
                </li>
                <li>
                  When everything is done we will send you an email with your
                  unique link!
                </li>
              </ol>
              <h2>What do you get when you press the button?</h2>
              <ul>
                <li>A unique link where you can search your Notion.</li>
                <li>Intuitive and unlimited semantic search.</li>
                <li>New Notion content indexed every day.</li>
              </ul>
              <h2>What do we get out of this product?</h2>
              <ul>
                <li>
                  We love Notion! and if we can make using Notion a better
                  experience for you that's great!
                </li>
                <li>
                  To show you what you can build with{" "}
                  <a href="https://operand.ai">Operand</a>.
                </li>
                <li> Get people to check out our serverless product.</li>
              </ul>
              <h2>What don't we get?</h2>
              <ul>
                <li> To share your data. It's your and always will be.</li>
                <li>To edit your Notion.</li>
                <li>To spam you with emails.</li>
              </ul>
              <h2>How was this made?</h2>
              <p>
                {" "}
                searchmynotion.com works by indexing your Notion content and
                then searching it with the{" "}
                <a href="https://operand.ai">Operand</a> API. This specific
                product was built using our{" "}
                <a href="https://operand.ai/auth">serverless</a> product and our{" "}
                <a href="https://github.com/operandinc/typescript-sdk">
                  Typescript SDK
                </a>{" "}
                and we have open sourced this product on GitHub. You can also
                read our blog post on how this was created here.
              </p>
              <h2>Who made this?</h2>
              <p>
                {" "}
                searchmynotion.com was made by{" "}
                <a href="https://operand.ai">Operand</a>. You can learn more
                about us and what we do at{" "}
                <a href="https://operand.ai/about">operand.ai</a>. Operand's{" "}
                <a href="https://operand.ai/terms">terms</a> and{" "}
                <a href="https://operand.ai/privacy">privacy policy</a> apply to
                searchmynotion.com.
              </p>
              <h2>I need help!</h2>
              <p>
                {" "}
                For help or any other questions you can reach us at{" "}
                <a href="mailto:support@operand.ai">support@operand.ai</a> or
                you can join our{" "}
                <a href="https://discord.com/invite/WpaFpt5C9M">
                  discord server
                </a>
              </p>
            </article>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
