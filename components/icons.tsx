import * as React from "react";

export interface IconProps {
  className?: string;
}

const SearchIcon: React.FC<IconProps> = (props) => {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 21 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={props.className}
    >
      <path
        fill="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.0626 19.4298L14.5353 13.9025C15.754 12.4806 16.4611 10.6407 16.4611 8.62122C16.4611 4.13293 12.8232 0.496216 8.33606 0.496216C3.84896 0.496216 0.246216 4.13411 0.246216 8.62122C0.246216 13.1083 3.88372 16.7462 8.33606 16.7462C10.3548 16.7462 12.1974 16.0056 13.6173 14.7872L19.1446 20.3146C19.3009 20.4337 19.4611 20.4962 19.6212 20.4962C19.7814 20.4962 19.9411 20.4352 20.063 20.3131C20.3087 20.0704 20.3087 19.672 20.0626 19.4298ZM8.37122 15.4962C4.547 15.4962 1.49622 12.4103 1.49622 8.62122C1.49622 4.83215 4.547 1.74622 8.37122 1.74622C12.1954 1.74622 15.2462 4.797 15.2462 8.62122C15.2462 12.4454 12.1603 15.4962 8.37122 15.4962Z"
      />
    </svg>
  );
};

export { SearchIcon };
