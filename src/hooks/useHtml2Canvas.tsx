import { useSnackbar } from "./useSnackbar";
import html2canvas from "html2canvas";

export function useHtml2Canvas() {
  const snackbar = useSnackbar();

  function ignoreElementsFn(element: Element) {
    return element.classList.contains("ignore");
  }

  async function captureElement(component: HTMLElement, fileName: string = 'downlaod_' + Date.now()) {
    if (!component) {
      snackbar("خطا در دریافت ", "error");
      return;
    }
    return await html2canvas(component, {
      ignoreElements: ignoreElementsFn,
    });
  }

  async function getCanvas(component: HTMLElement) {
    return await captureElement(component);
  }

  function downloadImage(canvas: any, imageFileName?: string): void {
    const fakeLink: HTMLAnchorElement = window.document.createElement("a")
    const imageUrl = canvas.toDataURL("image/png", 1.0);
    fakeLink.style.display = "none";
    fakeLink.download = imageFileName ?? 'fiche_' + Date.now();
    // fakeLink.href = URL.createObjectURL(blob);
    fakeLink.href = imageUrl;
    document.body.appendChild(fakeLink);
    fakeLink.click();
    document.body.removeChild(fakeLink);
    fakeLink?.remove();
  }

  return {
    captureElement,
    getCanvas,
    downloadImage,
  };
};