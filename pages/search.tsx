import * as React from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import {
  NotionPageObjectMetadata,
  SearchVariantObjectsResponse,
} from "@operandinc/sdk";
import Layout from "../components/layout";
import { SearchIcon } from "../components/icons";
import Link from "next/link";
import { LoadingSpinner } from "../components/loading";

type workspace = {
  name: string;
  icon: string;
  id: string;
};

const SearchInterface: NextPage = () => {
  const router = useRouter();
  // Get params from the URL
  const { link } = router.query;
  const [query, setQuery] = React.useState<string>("");
  const [searchResults, setSearchResults] =
    React.useState<SearchVariantObjectsResponse | null>(null);
  const [workspace, setWorkspace] = React.useState<workspace | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (link) {
      // Assert key as string
      if (typeof link !== "string") {
        return;
      }
      // Fetch workspace from /api/workspace/:link
      const workspace = async () => {
        const response = await fetch(`/api/workspace?link=${link}`);
        const json = await response.json();
        return json;
      };
      workspace().then((result) => {
        setWorkspace(result);
      });
    }
  }, [link]);

  const search = async () => {
    const response = await fetch(`/api/operand?query=${query}&link=${link}`);
    const json = await response.json();
    setSearchResults(json.results);
    setLoading(false);
  };

  function renderSearchResults(results: SearchVariantObjectsResponse) {
    if (!results.results) {
      return null;
    }
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        {results.results.map((r) => {
          const meta = r.object.metadata as NotionPageObjectMetadata;
          return (
            <div
              onClick={() => {
                window.open(meta.url, "_blank");
              }}
              key={r.object.id}
              className="col-span-1 border p-3 border-gray rounded shadow flex hover:cursor-pointer"
            >
              <div className="prose">
                <h2 className="text-2xl font-bold">{meta.title}</h2>
                <div className="divide-y divide-solid ">
                  <p className=" my-2"> {r.snippet} </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto pt-6 lg:pt-10 px-3 sm:px-6 lg:px-8">
        <div className=" pb-3 sm:flex sm:items-center sm:justify-between">
          <div className="flex-grow">
            <h3 className="text-3xl pl-4 pb-6 font-medium text-gray-900">
              Workspace: {workspace?.name ? workspace.name : "Loading..."}
            </h3>
            <div className="flex space-x-4 items-center">
              <input
                type="text"
                onChange={(e) => {
                  setQuery(e.target.value);
                }}
                onKeyUpCapture={(e) => {
                  if (e.key === "Enter") {
                    setLoading(true);
                    setSearchResults(null);
                    search();
                  }
                }}
                className="flex-grow pl-4 focus:outline-none focus:ring-0 border border-black p-4 shadow-lg rounded"
                placeholder="discover something new"
                value={query}
                autoFocus
                enterKeyHint="search"
              ></input>
              <button
                onClick={() => {
                  setLoading(true);
                  setSearchResults(null);
                  search();
                }}
                className="hidden sm:block hover:bg-gray-100 text-gray-800 font-bold border border-black p-4 shadow-lg rounded"
              >
                <div className="flex items-center space-x-4">
                  <p className="font-normal">Search</p>
                  <SearchIcon />
                </div>
              </button>
            </div>
          </div>
        </div>
        <div className="flex mt-4 justify-end text-sm text-gray-600">
          <div className="flex flex-col items-end space-y-2">
            <Link href="https://operand.ai">
              <a className="cursor-pointer hover:underline" target="_blank">
                powered by operand
              </a>
            </Link>
          </div>
        </div>
        <div className="py-8">
          {loading ? (
            <div className="flex justify-center">
              <LoadingSpinner />
            </div>
          ) : searchResults && !loading ? (
            renderSearchResults(searchResults)
          ) : (
            <></>
          )}
        </div>
      </div>
    </Layout>
  );
};
export default SearchInterface;
