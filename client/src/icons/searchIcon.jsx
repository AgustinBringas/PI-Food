import * as React from "react"

function SearchIcon(props) {
  return (
    <svg
      width={48}
      height={48}
      viewBox="0 0 12.7 12.7"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g fill="none" stroke="#000">
        <ellipse
          cx={4.512}
          cy={4.519}
          rx={4.151}
          ry={4.225}
          strokeWidth={1}
        />
        <path d="M7.198 7.607l5.135 4.931" strokeWidth={2} />
      </g>
    </svg>
  )
}

export default SearchIcon
