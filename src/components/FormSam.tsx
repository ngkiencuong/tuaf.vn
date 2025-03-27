"use client";

import { useEffect } from "react";

// Hàm tạo iframe
const createIframeForSam = (
  url: string,
  uuid: string,
  divClass: string
): HTMLIFrameElement => {
  const referrer = document.referrer || window.location.origin;
  const iframeUrl = `${url}?referrer=${encodeURIComponent(referrer)}`;
  const iframe = document.createElement("iframe");
  iframe.setAttribute("src", iframeUrl);
  iframe.style.width = "100%";
  iframe.style.minHeight = "450px";
  iframe.classList.add(divClass);
  return iframe;
};

// Hàm gắn iframe vào container
const attachIframeForSam = (
  url: string,
  uuid: string,
  divId: string,
  divClass: string
): void => {
  const containers = document.getElementsByClassName(divClass);
  Array.from(containers).forEach((container) => {
    if (!container.querySelector("iframe")) {
      const iframe = createIframeForSam(url, uuid, divClass);
      container.appendChild(iframe);
    }
  });
};

interface FormProps {
  url: string;
  uuid: string;
  divId: string;
  divClass: string;
}

export const FormSam: React.FC<FormProps> = ({
  url,
  uuid,
  divId,
  divClass
}) => {
  useEffect(() => {
    if (url && divClass) {
      attachIframeForSam(url, uuid, divId, divClass);
    }
  }, [url, uuid, divId, divClass]);

  return <div id={divId} className={divClass}></div>;
};
