import React from 'react';

export default function ModelFallback({ type, className = '' }) {
  if (type === 'room') {
    return (
      <svg className={className} viewBox="0 0 500 360" aria-hidden="true">
        <polygon points="42,236 250,132 460,230 250,338" fill="#d5b58c" />
        <polygon points="42,236 250,132 250,33 42,137" fill="#f3eee4" />
        <polygon points="250,132 460,230 460,128 250,33" fill="#e8dfd0" />
        <polygon points="84,144 250,62 250,69 84,152" fill="#31594b" />
        <polygon points="250,160 442,250 442,260 250,170" fill="#b4764f" />
        <g fill="#fffdf9" stroke="#b9a486" strokeWidth="4">
          <polygon points="124,200 196,164 255,192 182,229" />
          <polygon points="242,258 315,222 374,250 301,287" />
        </g>
        <g fill="#e6edf0">
          <polygon points="130,195 195,163 246,188 181,220" />
          <polygon points="248,253 314,221 365,246 299,278" />
        </g>
        <g fill="#8b5e3c">
          <polygon points="116,230 124,226 124,246 116,250" />
          <polygon points="190,235 198,231 198,251 190,255" />
          <polygon points="234,288 242,284 242,305 234,309" />
          <polygon points="309,293 317,289 317,310 309,314" />
        </g>
        <polygon points="320,92 390,126 390,173 320,139" fill="#c8dce0" stroke="#fffdf9" strokeWidth="7" />
        <polygon points="42,236 250,338 460,230 460,242 250,351 42,248" fill="#31594b" />
      </svg>
    );
  }

  return (
    <svg className={className} viewBox="0 0 500 360" aria-hidden="true">
      <ellipse cx="260" cy="304" rx="190" ry="28" fill="#1f3a2f" opacity=".18" />
      <ellipse cx="250" cy="286" rx="205" ry="42" fill="#31594b" />
      <ellipse cx="250" cy="278" rx="205" ry="40" fill="#f3eee4" />
      <ellipse cx="250" cy="270" rx="190" ry="31" fill="#8cb69b" />
      <polygon points="145,104 300,68 375,91 219,130" fill="#b4764f" />
      <polygon points="219,130 375,91 375,246 219,288" fill="#31594b" />
      <polygon points="145,104 219,130 219,288 145,256" fill="#26483d" />
      <polygon points="153,112 292,80 292,228 153,258" fill="#fffdf9" />
      <g fill="#a9c7ce" stroke="#8b5e3c" strokeWidth="5">
        <polygon points="164,126 205,134 205,172 164,164" />
        <polygon points="226,137 269,128 269,167 226,176" />
        <polygon points="164,181 205,189 205,228 164,220" />
        <polygon points="226,187 269,178 269,218 226,227" />
      </g>
      <polygon points="143,258 219,287 375,245 375,256 219,300 143,269" fill="#b4764f" />
      <g fill="#70a782">
        <circle cx="99" cy="239" r="19" /><circle cx="91" cy="220" r="14" />
        <circle cx="401" cy="231" r="20" /><circle cx="407" cy="209" r="15" />
      </g>
      <g stroke="#8b5e3c" strokeWidth="7">
        <path d="M99 239v34M401 231v39" />
      </g>
    </svg>
  );
}
