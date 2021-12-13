import {createElement} from 'react';

export default function Nav({goldNumber}) {
  return (
    <div className="nav">
      <div className="backbtn">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="icon"
          viewBox="0 0 1024 1024"
          id="icon-back"
        >
          <path
            d="M671.968 912c-12.288 0-24.576-4.672-33.952-14.048L286.048 545.984c-18.752-18.72-18.752-49.12 0-67.872l351.968-352c18.752-18.752 49.12-18.752 67.872 0 18.752 18.72 18.752 49.12 0 67.872L387.872 512.032l318.016 318.016c18.752 18.752 18.752 49.12 0 67.872-9.344 9.408-21.632 14.08-33.92 14.08z"
            fill="currentColor"
            fill-rule="evenodd"
          ></path>
        </svg>
      </div>
      <div className="goldinfo">
        <div className="icon"></div>
        <span>{goldNumber}</span>
      </div>
    </div>
  );
}
