import { useEffect } from "react";

/** Sets the tab title: "<page> - hack::peel", or just "hack::peel" on the home page. */
export function useTitle(page?: string) {
  useEffect(() => {
    document.title = page ? `${page} - hack::peel` : "hack::peel";
  }, [page]);
}
