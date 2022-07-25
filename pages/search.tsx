import * as React from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import {
  OperandV3,
  SearchVariantContentsRequest,
  SearchVariantContentsResponse,
  Snippet,
  Object,
  NotionPageObjectMetadata,
} from "@operandinc/sdk";
import Layout from "../components/layout";
import { SearchIcon } from "../components/icons";
import Link from "next/link";

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
    React.useState<SearchVariantContentsResponse | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [workspace, setWorkspace] = React.useState<workspace | null>(null);

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

  React.useEffect(() => {
    // Debounce search to make it look less janky
    if (query.length == 0) {
      setSearchResults(null);
      setLoading(false);
      return;
    }
    // If we are already searching for this query, don't do it again
    if (loading) {
      return;
    }
    const firedQuery = query;
    setLoading(true);
    // Fire search request to /api/search
    fetch(`/api/operand?query=${query}&link=${link}`)
      .then((res) => {
        if (res.status === 200) {
          if (firedQuery === query) {
            res.json().then((result) => {
              setSearchResults(result);
              setLoading(false);
            });
          }
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [query, link]);

  function renderSearchResults(results: SearchVariantContentsResponse) {
    if (!results) {
      return null;
    }
    // Create empty map of objectId to contents
    const mappedResults = new Map<Object, Snippet[]>();
    // Loop through all contents in the response and add them to the map
    results.contents.forEach((snippet) => {
      // Get object using objectId
      const object = results.objects[snippet.objectId] as Object;
      // Check if we are dealing with a top-3 object
      // Since snippets are returned in order of relevance we can create objects until we have 3 and then stop
      // And only add to existing objects
      if (mappedResults.size < 3) {
        // If the objectId is not in the map, add it and set the contents to the snippet
        if (!mappedResults.has(object)) {
          mappedResults.set(object, []);
        }
      }
      if (mappedResults.has(object)) {
        mappedResults.get(object)!.push(snippet);
      }
    });

    return (
      // Grid of cards max
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        {Array.from(mappedResults).map(([object, snippets]) => {
          const meta = object.metadata as NotionPageObjectMetadata;
          return (
            <div
              onClick={() => {
                window.open(meta.url, "_blank");
              }}
              key={object.id}
              className="col-span-1 border p-3 border-gray rounded shadow flex hover:cursor-pointer"
            >
              <div className="prose">
                <h2 className="text-2xl font-bold">{meta.title}</h2>
                <div className="divide-y divide-solid ">
                  {snippets.map((snippet, idx) => {
                    return (
                      <div
                        key={idx}
                        className="flex items-center sm:hover:bg-gray-100"
                      >
                        <p className="line-clamp-2 sm:line-clamp-3 my-2">
                          {" "}
                          {snippet.content}{" "}
                        </p>
                      </div>
                    );
                  })}
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
              Workspace: {workspace?.name}
            </h3>
            <div className="flex space-x-4 border border-black p-3 items-center">
              <input
                type="text"
                onChange={(e) => {
                  setQuery(e.target.value);
                }}
                className="border-hidden flex-grow pl-4 focus:outline-none focus:ring-0"
                placeholder="discover something new"
                value={query}
                autoFocus
                enterKeyHint="search"
              ></input>
              <SearchIcon className="w-6 h-6" />
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
          {searchResults ? renderSearchResults(searchResults) : null}
        </div>
      </div>
    </Layout>
  );
};
export default SearchInterface;
