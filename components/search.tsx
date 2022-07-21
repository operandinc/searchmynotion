import * as React from "react";
import {
  CompletionVariantAnswerResponse,
  ImageObjectMetadata,
  Object,
  OperandV3,
  SearchVariantContentsResponse,
  Snippet,
} from "@operandinc/sdk";
import { SearchIcon } from "./icons";
import Link from "next/link";
import { TwitterShareButton, TwitterIcon } from "next-share";
import { SkeletonRow } from "./loading";

export interface Search {
  client: OperandV3;
  title: string | undefined;
}

const Search: React.FC<Search> = ({ client, title }) => {
  const [query, setQuery] = React.useState<string>("");
  const [searchResults, setSearchResults] =
    React.useState<SearchVariantContentsResponse | null>(null);
  const [answerResult, setAnswerResult] =
    React.useState<CompletionVariantAnswerResponse | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    async function search() {
      if (query == "") {
        setSearchResults(null);
        setAnswerResult(null);
        setLoading(false);
        return;
      }
      const firedQuery = query;
      setLoading(true);
      // Fire and await multiple promises in parallel.
      const searchResults = await client.searchContents({
        query: query,
        max: 10,
      });
      if (firedQuery === query) {
        setSearchResults(searchResults);
      }
      // If the user hasn't typed for ~500ms, then we fire an answer request.
      const timeout = setTimeout(async () => {
        const answerResult = await client.completionAnswer({
          question: query,
        });
        if (firedQuery === query) {
          setAnswerResult(answerResult);
          setLoading(false);
        }
      }, 500);
      return () => {
        clearTimeout(timeout);
      };
    }
    search();
  }, [query]);

  function renderSearchResults(results: SearchVariantContentsResponse) {
    if (!results) {
      return null;
    }
    let mappings = new Map<Object, Snippet[]>();
    for (const content of results.contents) {
      let oid = content.objectId;
      let object = results.objects?.[oid];
      if (!object) {
        continue;
      }
      if (!mappings.has(object)) {
        mappings.set(object, []);
      }
      mappings.get(object)!.push(content);
    }
    let objects = Array.from(mappings.keys());
    return (
      <div className="flex flex-col mt-4">
        <h3 className="mb-1 pl-4 text-lg">relevant content: </h3>
        <div className="space-y-4">
          {objects.map((object) => {
            let snippets = mappings.get(object);
            return (
              <div
                key={object.id}
                className="border p-2 space-y-2 rounded border-black"
              >
                <ul className="list-none pl-2">
                  {snippets!.map(
                    (snippet, idx) =>
                      // only list top 3 snippets
                      idx < 3 && (
                        <li key={idx} className="">
                          <p>{snippet.content}</p>
                        </li>
                      )
                  )}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  function renderAnswerResponse(result: CompletionVariantAnswerResponse) {
    return (
      <>
        <h3 className="mb-1 text-black pl-4 text-lg">best answer: </h3>
        <div className="pl-4 p-4 rounded space-y-4 bg-gray-600 w-4/5">
          <p className="text-white">
            {result.answer == "" ? "No answer found." : result.answer}
          </p>
          {result.answer != "" && result.sources.length > 0 && (
            <p className="text-white">
              Sources:{" "}
              {result.sources.map((source, i) => (
                <span key={source.id} className="text-white">
                  {(source.metadata as { html: string; title?: string })
                    .title || ""}{" "}
                  (from {source.label ? source.label : source.id})
                  {i != result.sources.length - 1 && ", "}
                </span>
              ))}
            </p>
          )}
        </div>
      </>
    );
  }

  return (
    <div>
      <div className="max-w-7xl mx-auto pt-6 lg:pt-10 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
          <div className="flex-grow">
            <h3 className="text-lg pl-4 font-medium text-gray-900">
              {title || "Content-based Search"}
            </h3>
            <div className="flex space-x-4 items-center">
              <input
                type="text"
                onChange={(e) => {
                  e.preventDefault();
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
          <div className="flex-grow">
            {loading ? (
              <SkeletonRow width="4/5" height="20" />
            ) : answerResult != null ? (
              renderAnswerResponse(answerResult)
            ) : null}
          </div>
          <div className="flex flex-col items-end space-y-2">
            <Link href="https://operand.ai">
              <a className="cursor-pointer hover:underline" target="_blank">
                powered by operand
              </a>
            </Link>
            <TwitterShareButton
              url={window.location.toString()}
              title={"check out this search engine I made with @operandai"}
            >
              <TwitterIcon className="w-6 h-6" />
            </TwitterShareButton>
          </div>
        </div>

        <div>{searchResults ? renderSearchResults(searchResults) : null}</div>
      </div>
    </div>
  );
};

export default Search;
