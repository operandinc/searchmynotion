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
                search inside your very own Notion workspace.
              </h3>
              <h2>How it works:</h2>
              <ol>
                <li>
                  When you click the button, you'll be redirected to Notion to
                  login.
                </li>
                <li>
                  You can then choose which pages of your Notion you want to
                  search over.
                </li>
                <li>
                  Once we've finished indexing your Notion workspace, we'll send
                  you an email with a unique link to search! Depending on how
                  busy we are, this may take anywhere from a few minutes to a
                  few hours.
                </li>
              </ol>
              <h2>Features:</h2>
              <ul>
                <li>Search over all the content in your Notion workspace.</li>
                <li>Powerful, AI-powered semantic search.</li>
                <li>New content will be fetched and indexed periodically.</li>
              </ul>
              <h2>How was this made?</h2>
              <p>
                This website is a thin wrapper atop the{" "}
                <a href="https://operand.ai">Operand</a> API. Specifically, we
                used the{" "}
                <a href="https://github.com/operandinc/typescript-sdk">
                  TypeScript SDK
                </a>{" "}
                and have open sourced all of this code on{" "}
                <a href="https://github.com/operandinc/searchmynotion">
                  GitHub
                </a>
                . In the near future, we're also going to release a blog post
                detailing the process of building the site, and where we want to
                take it in the future.
              </p>
              <h2>Why did we make this?</h2>
              <ul>
                <li>We love Notion! We use it every day.</li>
                <li>To showcase our API and provide an example of usage.</li>
                <li>
                  And yes, to start conversations with{" "}
                  <a href="https://notion.so">Notion</a> itself and similar
                  companies.
                </li>
              </ul>
              <h2>Our promises:</h2>
              <ul>
                <li>Your data is yours, and it always will be.</li>
                <li>
                  You can <a href="mailto:support@operand.ai">email us</a> at
                  any time, and we'll delete your data off our servers.
                </li>
                <li>Your email inbox won't be spammed.</li>
              </ul>
              <p>
                Operand's <a href="https://operand.ai/terms">terms</a> and{" "}
                <a href="https://operand.ai/privacy">privacy policy</a> apply.
              </p>
              <h2>FAQ</h2>
              <ul>
                <li>
                  <strong>What exactly do you index?</strong>
                  <p>
                    Currently we index text, images, and lists. No tables or
                    other fancy Notion blocks yet, but please let us know if
                    those would be useful for you!
                  </p>
                </li>
                <li>
                  <strong>I lost my link :(</strong>
                  <p>
                    If you haven't deleted your emails its probably in there,
                    but we can also go find it for you so just reach out on
                    discord or email.
                  </p>
                </li>
                <li>
                  <strong>I need more help!</strong>
                  <p>
                    Same. Ok, for real, you can{" "}
                    <a href="mailto:support@operand.ai">email us</a> or{" "}
                    <a href="https://discord.com/invite/WpaFpt5C9M">
                      join our community Discord
                    </a>
                    . We'll try our best to respond as quickly as possible!
                  </p>
                </li>
              </ul>
            </article>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
