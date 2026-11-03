import type { SVGProps } from 'react';

// Giữ lại dấu hai thanh bấm giờ của giao diện ban đầu.
export function BrandMark(props: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" {...props}>
    <path d="M6 5h4v14H6V5zm8 0h4v14h-4V5z" />
  </svg>;
}
